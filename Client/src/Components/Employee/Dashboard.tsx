import CalendarComponent from "./Calander";
import MonthlyReport from "./MonthlyReport";
import { useParams } from "react-router-dom";

function DashboardEmployee() {
  const { id } = useParams();
  return (
    <>
      <h1>Welcome to Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="">
          <MonthlyReport id={id!}></MonthlyReport>
        </div>
        <div className="">
          <CalendarComponent id={id!}></CalendarComponent>
        </div>
      </div>
    </>
  );
}

export default DashboardEmployee;
