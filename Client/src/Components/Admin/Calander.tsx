import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css"; // Import default styles
import "./Calendar.css"; // Import custom styles
import api from "../../Services/api";
import { format } from "date-fns";
import { AiOutlineCarryOut } from "react-icons/ai";
import Calendar from "react-calendar";

interface DayStatus {
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE" | "N/A";
}

interface Props {
  id: string;
}

const CalendarComponent: React.FC<Props> = ({ id }) => {
  const [value, setValue] = useState<Date | null>(new Date());
  const [days, setDays] = useState<DayStatus[]>([]);

  const handleDateChange = (date: Date) => {
    setValue(date);
  };

  const fetchAttendanceData = (month: number, year: number) => {
    api
      .get(`/attendance/get/${id}`, {
        params: { month, year },
      })
      .then((response) => {
        const attendance = response.data.map((record: any) => ({
          date: new Date(record.timestamp),
          status: record.status.toUpperCase() as
            | "PRESENT"
            | "ABSENT"
            | "LATE"
            | "N/A",
        }));
        setDays(attendance);
      })
      .catch((error) => {
        console.error("Error fetching calendar data:", error);
      });
  };

  useEffect(() => {
    if (value) {
      const month = value.getMonth() + 1; // getMonth() returns 0-indexed month
      const year = value.getFullYear();
      fetchAttendanceData(month, year);
    }
  }, [value, id]);

  const tileContent = ({ date }: any) => {
    const foundDay = days.find(
      (d) => format(d.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    if (foundDay) {
      const badgeClass = (() => {
        switch (foundDay.status) {
          case "PRESENT":
            return "badge badge-primary";
          case "ABSENT":
            return "badge badge-error";
          case "LATE":
            return "badge badge-warning";
          default:
            return "";
        }
      })();

      return (
        <div className="mt-1 flex justify-center">
          <span className={badgeClass}>{foundDay.status}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl mx-auto text-center p-4">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center">
        Calendar
        <AiOutlineCarryOut color="blue" className="ml-2 text-gray-600" />
      </h2>
      <Calendar
        onChange={(date) => handleDateChange(date as Date)}
        value={value}
        tileContent={tileContent} // Display the status immediately
        className="react-calendar border rounded-lg shadow-md"
      />
      <div className="mt-4"></div>
    </div>
  );
};

export default CalendarComponent;
