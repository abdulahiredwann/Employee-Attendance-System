import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Services/api";

interface Employee {
  firstName: string;
  lastName: string;
  email: string;

  id: string;
}
function EmployeeInfo() {
  const { id } = useParams();
  const [emplyee, setEmloyee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await api.get(`/employee/info/${id}`);

      setEmloyee(response.data);
    };
    fetchEmployee();
  }, [id]);

  const formatID = (id: string) => {
    if (id.length === 2) {
      return `00-00-${id}`;
    } else if (id.length === 3) {
      return `00-0-${id}`;
    } else if (id.length === 4) {
      return `00-${id}`;
    }
    return `00-00-${id}`;
  };
  return (
    <>
      <div className="p-4">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="p-9">
            <h2 className=" text-xl font-bold mb-4">Employee Info:</h2>
            <div className="flex items-center mb-2">
              <p className="text-lg font-bold text-gray-700 mr-2">Name:</p>
              <p className="text-lg  text-gray-900">
                {emplyee?.firstName} {emplyee?.lastName}
              </p>
            </div>
            <div className="flex items-center mb-2">
              <p className="text-lg font-bold text-gray-700 mr-2">Email:</p>
              <p className="text-lg text-gray-900">{emplyee?.email}</p>
            </div>
            <div className="flex items-center">
              <p className="text-lg font-bold text-gray-700 mr-2">ID:</p>
              <p className="text-lg text-gray-900">{formatID(id!)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeInfo;
