import MonthlyReports from "./MonthlyReports";
import TodayReport from "./TodayReport";
import WarningPerson from "./WarningPerson";
import YesterdayReports from "./YesterdayReport";

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
        <div className=" p-7">
          <YesterdayReports></YesterdayReports>
        </div>
        <div className=" p-7">
          <WarningPerson></WarningPerson>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
