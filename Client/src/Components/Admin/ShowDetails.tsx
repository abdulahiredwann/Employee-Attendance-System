import { useParams } from "react-router-dom";
import DataAnalytics from "./DataAnalytics";
import Calander from "./Calander";
import EmployeeInfo from "./EmployeeInfo";

function ShowDetails() {
  const { id } = useParams();

  return (
    <>
      <h1 className="text-3xl font-serif text-center my-4">See Details</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <EmployeeInfo></EmployeeInfo>
        <div className=" p-4">{<DataAnalytics id={id!} />}</div>
      </div>
      <div className=" p-4">{<Calander id={id!}></Calander>}</div>
    </>
  );
}

export default ShowDetails;
