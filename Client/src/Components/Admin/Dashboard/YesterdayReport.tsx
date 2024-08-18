import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import api from "../../../Services/api";

interface Response {
  status: "PRESENT" | "LATE" | "ABSENT";
}

function YesterdayReports() {
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });

  // Generate months dynamically

  useEffect(() => {
    const todayReport = async () => {
      try {
        const response = await api.get<Response[]>(`/attendance/yesterday`);
        const report = response.data;

        // Count the number of each status
        const presentCount = report.filter(
          (item) => item.status === "PRESENT"
        ).length;
        const lateCount = report.filter(
          (item) => item.status === "LATE"
        ).length;
        const absentCount = report.filter(
          (item) => item.status === "ABSENT"
        ).length;

        setAttendanceData({
          absent: absentCount,
          late: lateCount,
          present: presentCount,
        });
      } catch (error) {
        console.log(error);
      }
    };

    todayReport();
  }, []);

  return (
    <div className="card bg-base-100 w-96 shadow-xl shadow-orange-300 hover:scale-105 pb-16">
      <h1 className="text-center text-lg">Yesterday Reports</h1>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: attendanceData.present,
                label: `Present ${attendanceData.present}`,
              },
              {
                id: 1,
                value: attendanceData.late,
                label: `Late ${attendanceData.late} `,
              },
              {
                id: 2,
                value: attendanceData.absent,
                label: `Absent ${attendanceData.absent}`,
              },
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

export default YesterdayReports;
