import { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { LuQrCode } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import AttendanceComponent from "./AttendanceComponent";
import AnalyticsComponent from "./Analytics"; // Correct import for AnalyticsComponent
import { useAuth } from "../../Services/Auth";
import api from "../../Services/api";
import avater from "../../../public/profile.png";
import logo from "../../../public/ABD tech company logo.png";
import { useNavigate } from "react-router-dom";

type ActiveComponent = "dashboard" | "attendance" | "analytics" | "welcome";
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function SideBar() {
  const [activeComponent, setActiveComponent] =
    useState<ActiveComponent>("welcome");
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get("/admin/user");
          setUser(response.data);
        } catch (error) {
          console.log(error);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated]);

  const handleButtonClick = (component: ActiveComponent) => {
    setActiveComponent(component);
  };

  const renderContent = () => {
    switch (activeComponent) {
      case "attendance":
        return <AttendanceComponent />;
      case "analytics":
        return <AnalyticsComponent />;
      case "dashboard":
        return <div>Dashboard Content</div>;
      default:
        return <div>Welcome</div>;
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr] ">
      {/* Sidebar */}
      <div className="flex flex-col justify-between gap-2 border-r bg-base-200 p-4 ">
        {/* Header and User Info */}
        <div>
          <div className="flex h-[40px] items-center justify-between border-b px-2">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <img className="h-11" src={logo} alt="ABD tech" />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="avatar">
              <div className="h-12">
                <img src={avater} className="" alt="User Avatar" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 p-2 mt-9">
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={() => handleButtonClick("dashboard")}
            >
              <MdDashboard />
              Dashboard
            </button>
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={() => handleButtonClick("attendance")}
            >
              <LuQrCode />
              Attendance
            </button>
            <button
              className="btn btn-outline flex items-center gap-2"
              onClick={() => {
                handleButtonClick("analytics");
                navigate("/admin/analytics");
              }}
            >
              <IoAnalyticsOutline />
              Analytics
            </button>
          </nav>
        </div>

        {/* Footer Navigation */}
        {/* Footer Navigation */}
        <div className="flex flex-col gap-1 ">
          <button className="btn btn-sm btn-outline border-none flex items-center gap-2">
            <div className="indicator">
              <span className="mb-1 indicator-item badge badge-primary top-0 left-24">
                4+
              </span>
              <IoIosNotificationsOutline size={20} />
            </div>
            Notification
          </button>
          <button className="btn btn-sm btn-outline border-none flex items-center gap-2">
            <BiSupport size={20} /> Support
          </button>
          <button className="btn btn-sm btn-outline border-none flex items-center gap-2">
            <LiaSignOutAltSolid size={20} /> Signout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">{renderContent()}</div>
    </div>
  );
}

export default SideBar;
