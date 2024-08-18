import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import api from "../../Services/api";
interface Props {
  id: string;
}

interface DayStatus {
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE" | "N/A";
}

function DataAnalytics({ id }: Props) {
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
  return (
    <div>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: count.PRESENT, label: "Present" },
              { id: 1, value: count.ABSENT, label: "Absent" },
              { id: 2, value: count.LATE, label: "Late " },
              { id: 3, value: daysLeft, label: "Days Left" },
            ],
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
            startAngle: -90,
            endAngle: 180,
          },
        ]}
        height={230}
      />
    </div>
  );
}

export default DataAnalytics;
