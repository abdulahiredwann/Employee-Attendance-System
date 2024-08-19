import { useEffect, useState } from "react";
import api from "../../../Services/api";
import profile from "../../../../public/RVIUjs01.svg";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface WarningPerson {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  late: number;
  absent: number;
}

function WarningPerson() {
  const [warningPerson, setWarningPeroson] = useState<WarningPerson[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarningPerson = async () => {
      const response = await api.get("/attendance/warning");
      setWarningPeroson(response.data);
    };
    fetchWarningPerson();
  }, []);
  console.log(warningPerson);
  return (
    <>
      <div className="card bg-base-100 w-96 shadow-xl shadow-gray-400 hover:scale-105">
        <h1 className="flex items-center justify-center text-xl text-red-600 font-mono">
          Warning Employees
          <IoWarningOutline className="ml-2" />
        </h1>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
              </tr>
            </thead>
            {warningPerson.map((info) => (
              <tbody>
                <tr key={info.employeeId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="  h-12 w-12">
                          <img
                            src={profile}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div
                          onClick={() => {
                            navigate(`/admin/seedetails/${info.employeeId}`);
                          }}
                          className="hover:text-slate-400 tooltip tooltip-warning  hover:cursor-pointer"
                          data-tip="Show Details"
                        >
                          <div className="font-bold">
                            {info.firstName} {info.lastName}
                          </div>
                        </div>
                        <div className="text-sm opacity-50">{info.email}</div>
                      </div>
                    </div>
                  </td>

                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </>
  );
}

export default WarningPerson;
