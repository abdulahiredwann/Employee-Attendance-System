import { MdDashboard } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { LuQrCode } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { useAuth } from "../../Services/Auth";
import { useNavigate } from "react-router-dom";
import api from "../../Services/api";
import avater from "../../../public/profile.png";
import logo from "../../../public/ABD tech company logo.png";
import { useEffect, useState } from "react";
import useValidateAdmin from "../../hooks/useValidateAdmin";
import { IoIosAddCircleOutline } from "react-icons/io";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

function SideBar() {
  useValidateAdmin();
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

  const handleLogout = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/loginadmin");
  };

  return (
    <div className="fixed top-0 left-0 h-full w-72 flex flex-col justify-between border-r bg-base-200 p-4">
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
            onClick={() => navigate("/admin/dashboard")}
          >
            <MdDashboard />
            Dashboard
          </button>
          <button
            className="btn btn-outline flex items-center gap-2"
            onClick={() => navigate("/admin/attendance")}
          >
            <LuQrCode />
            Attendance
          </button>
          <button
            className="btn btn-outline flex items-center gap-2"
            onClick={() => navigate("/admin/analytics")}
          >
            <IoAnalyticsOutline />
            Analytics
          </button>
        </nav>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-1">
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
        <button
          onClick={() => {
            navigate("/admin/register");
          }}
          className="btn btn-sm btn-outline border-none flex items-center gap-2"
        >
          <IoIosAddCircleOutline size={25} /> Register
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline border-none flex items-center gap-2"
        >
          <LiaSignOutAltSolid size={20} /> Signout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
