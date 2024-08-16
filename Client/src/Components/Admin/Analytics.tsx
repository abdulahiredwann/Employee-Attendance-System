import { useEffect, useState } from "react";
import api from "../../Services/api";

interface employee {
  firstName: string;
  lastName: string;
  email: string;
}

interface Data {
  status: string;
  timestamp: Date;
  id: number;
  employee: employee;
}
function Analytics() {
  const [userData, setUserData] = useState<Data[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const response = await api.get("/attendance/all");
      setUserData(response.data);
      console.log(response.data);
    };
    fetchAttendance();
  }, []);
  const statusStyles: { [key: string]: string } = {
    LATE: "text-yellow-600 font-semibold",
    ABSENT: "text-red-600 font-semibold",
    PRESENT: "text-blue-700 font-semibold ",
  };

  return (
    <div className="p-6  bg-base-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Analytics Attendance
      </h1>

      <div className=" p-6">
        <form className="flex  space-x-4">
          {/* Search by Name */}
          <div className="flex flex-col flex-1 ">
            <label htmlFor="name" className="text-gray-700 font-medium mb-1">
              Search by Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter name"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Status */}
          <div className="flex flex-col flex-1">
            <label htmlFor="status" className="text-gray-700 font-medium mb-1">
              Filter by Status
            </label>
            <select
              id="status"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="absent">Absent</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
            </select>
          </div>

          {/* Filter by Date */}
          <div className="flex flex-col flex-1">
            <label htmlFor="date" className="text-gray-700 font-medium mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              id="date"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg shadow-slate-400">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((data, index) => (
              <tr key={data.id}>
                <th>{index + 1}</th>
                <td>
                  {data.employee.firstName} {data.employee.lastName}
                </td>
                <td>{data.employee.email}</td>
                <td
                  className={`px-4 py-2 ${
                    statusStyles[data.status] || "text-gray-600"
                  }`}
                >
                  <div className="badge badge-outline">{data.status}</div>
                </td>
              </tr>
            ))}
            {/* row 1 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
