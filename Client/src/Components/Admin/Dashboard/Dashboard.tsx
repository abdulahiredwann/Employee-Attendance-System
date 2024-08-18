import MonthlyReports from "./MonthlyReports";
import TodayReport from "./TodayReport";

function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-center my-4">
        Welcome to Dashboard
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className=" p-7 ">
          <MonthlyReports></MonthlyReports>
        </div>
        <div className="p-7 ">
          <TodayReport></TodayReport>
        </div>
        <div className="bg-red-500 p-7">Yesterdat Report Data</div>
        <div className="bg-blue-500 p-7">Warning Person</div>
      </div>
    </>
  );
}

export default Dashboard;
