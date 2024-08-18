import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import api from "../../../Services/api";

interface Response {
  status: "PRESENT" | "LATE" | "ABSENT";
}

function MonthlyReports() {
  const [attendanceData, setAttendanceData] = useState({
    present: 0,
    late: 0,
    absent: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [months, setMonths] = useState<string[]>([]);

  // Generate months dynamically
  useEffect(() => {
    const generateMonths = () => {
      const monthsArray = [];
      const currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth();

      for (let i = 0; i < 12; i++) {
        const monthFormatted = `${year}-${String(month + 1).padStart(2, "0")}`;
        monthsArray.push(monthFormatted);

        month--;
        if (month < 0) {
          month = 11;
          year--; // Move to December of the previous year
        }
      }

      setMonths(monthsArray.reverse()); // Ensure the months are in ascending order
      setSelectedMonth(monthsArray[monthsArray.length - 1]); // Set the current month as default
    };

    generateMonths();
  }, []);

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchMonthlyReports = async () => {
      try {
        const response = await api.get<Response[]>(
          `/attendance/monthly?month=${selectedMonth}`
        );
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

    fetchMonthlyReports();
  }, [selectedMonth]);

  const handleMonthChange = (direction: "prev" | "next") => {
    const currentIndex = months.indexOf(selectedMonth);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1]);
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl shadow-orange-300 hover:scale-105">
      <h1 className="text-center text-lg">Monthly Reports</h1>
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
                label: `Late ${attendanceData.late}`,
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
      <div className="flex justify-center mt-4">
        <button
          className="join-item btn mr-1"
          onClick={() => handleMonthChange("prev")}
          disabled={months.indexOf(selectedMonth) === 0}
        >
          «
        </button>
        <button className="join-item btn mr-1">{selectedMonth}</button>
        <button
          className="join-item btn"
          onClick={() => handleMonthChange("next")}
          disabled={months.indexOf(selectedMonth) === months.length - 1}
        >
          »
        </button>
      </div>
    </div>
  );
}

export default MonthlyReports;
