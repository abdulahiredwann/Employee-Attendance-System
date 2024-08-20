import { useEffect, useState } from "react";
import api from "../../Services/api";
import { PieChart } from "@mui/x-charts";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { TbReportAnalytics } from "react-icons/tb";

interface Props {
  id: string;
}

interface DayStatus {
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE" | "N/A";
}

function MonthlyReport({ id }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [attendanceData, setAttendanceData] = useState<DayStatus[]>([]);
  const [count, setCount] = useState({
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
  });

  const fetchAttendanceData = (month: number, year: number) => {
    api
      .get(`/attendance/get/${id}`, {
        params: { month, year },
      })
      .then((response) => {
        const attendace = response.data.map((record: any) => ({
          date: new Date(record.timestamp),
          status: record.status.toUpperCase() as
            | "PRESENT"
            | "ABSENT"
            | "LATE"
            | "N/A",
        }));
        setAttendanceData(attendace);
      })
      .catch((error) => {
        console.log("Error fetching attendance data", error);
      });
  };

  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYearr = new Date().getFullYear();
    fetchAttendanceData(currentMonth, currentYearr);
  }, [id]);

  useEffect(() => {
    const statusCounts = attendanceData.reduce(
      (acc, day) => {
        if (
          day.status === "PRESENT" ||
          day.status === "ABSENT" ||
          day.status === "LATE"
        ) {
          acc[day.status]++;
        }
        return acc;
      },
      { PRESENT: 0, ABSENT: 0, LATE: 0 }
    );
    setCount(statusCounts);
  }, [attendanceData]);

  const currentDate = new Date();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const daysLeft = lastDayOfMonth.getDate() - currentDate.getDate();

  const chartSize = isMobile
    ? { width: 300, height: 200 }
    : { width: 400, height: 250 };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex justify-center items-center">
          <TbReportAnalytics color="blue"></TbReportAnalytics>
          Monthly Report
        </h1>
      </div>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: count.PRESENT,
                label: `Present:${count.PRESENT}`,
                color: "#3b82f6 ",
              },
              {
                id: 1,
                value: count.ABSENT,
                label: `Absent:${count.ABSENT}`,
                color: "#EF4444",
              },
              {
                id: 2,
                value: count.LATE,
                label: `Late:${count.LATE}`,
                color: "#FFA500",
              },
              { id: 3, value: daysLeft, label: "Days Left" },
            ],
            innerRadius: isMobile ? 20 : 30,
            outerRadius: isMobile ? 80 : 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 180,
            cy: isMobile ? 80 : 100,
          },
        ]}
        {...chartSize}
      />
    </div>
  );
}

export default MonthlyReport;
