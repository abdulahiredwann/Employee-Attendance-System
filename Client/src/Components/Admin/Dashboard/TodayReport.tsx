import { PieChart } from "@mui/x-charts";
import React, { useEffect, useState } from "react";
import api from "../../../Services/api";

interface Response {
  status: "PRESENT" | "LATE" | "ABSENT";
}

function TodayReport() {
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });

  // Generate months dynamically

  useEffect(() => {
    const todayReport = async () => {
      try {
        const response = await api.get<Response[]>(`/attendance/today`);
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
    <div className="card bg-base-100 w-96 shadow-xl shadow-orange-300 hover:scale-105">
      <h1 className="text-center text-lg">Monthly Reports</h1>
      <PieChart
        series={[
          {
            data: [
              {
                id: 0,
                value: 4,
                label: `Present 1`,
              },
              {
                id: 1,
                value: 5,
                label: `Late `,
              },
              {
                id: 2,
                value: 23,
                label: `Absent `,
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

export default TodayReport;
