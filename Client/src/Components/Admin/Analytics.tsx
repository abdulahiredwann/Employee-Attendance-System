import { useEffect, useState } from "react";
import api from "../../Services/api";
import { IoAnalytics } from "react-icons/io5";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Data {
  status: string;
  timestamp: Date;
  id: number;
  employee: Employee;
}

function Analytics() {
  const [userData, setUserData] = useState<Data[]>([]);
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      const response = await api.get("/attendance/all");
      setUserData(response.data);
      setFilteredData(response.data); // Initialize filtered data with all data
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchName, filterStatus, filterDate, userData]);

  const filterData = () => {
    let filtered = userData;

    if (searchName) {
      filtered = filtered.filter(
        (data) =>
          data.employee.firstName
            .toLowerCase()
            .includes(searchName.toLowerCase()) ||
          data.employee.lastName
            .toLowerCase()
            .includes(searchName.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (data) => data.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (data) =>
          new Date(data.timestamp).toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
      );
    }

    setFilteredData(filtered);
  };

  const statusStyles: { [key: string]: string } = {
    LATE: "text-yellow-600 font-semibold",
    ABSENT: "text-red-600 font-semibold",
    PRESENT: "text-blue-700 font-semibold ",
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h1 className="text-3xl   font-semibold mb-6   flex items-center gap-2 justify-center  text-blue-900   ">
        Analytics Attendance <IoAnalytics></IoAnalytics>
      </h1>

      <div className="p-6">
        <form className="flex space-x-4">
          {/* Search by Name */}
          <div className="flex flex-col flex-1">
            <label htmlFor="name" className="text-gray-700 font-medium mb-1">
              Search by Name
            </label>
            <input
              type="text"
              id="name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg shadow-slate-400">
        <table className="table-auto w-full ">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr key={data.id} className="border-b">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`seedetails/${data.employee.id}`}
                      className="hover:text-blue-500 tooltip tooltip-primary"
                      data-tip="Show Details"
                    >
                      {data.employee.firstName} {data.employee.lastName}
                    </a>
                  </td>
                  <td className="px-4 py-3">{data.employee.email}</td>
                  <td
                    className={`px-4 py-3 ${
                      statusStyles[data.status] || "text-gray-600"
                    }`}
                  >
                    <span className="badge badge-outline">{data.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
