import { TfiMenuAlt } from "react-icons/tfi";
import { MdDashboard } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { LuQrCode } from "react-icons/lu";

function SideBar() {
  return (
    <>
      <div className="grid min-h-screen grid-cols-[280px_1fr] bg-base-200">
        {/* Sidebar */}
        <div className="flex flex-col justify-between gap-2 border-r bg-base-100 p-4">
          {/* Header and User Info */}
          <div>
            <div className="flex h-[40px] items-center justify-between border-b px-2">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <button className="btn btn-ghost btn-sm">
                <TfiMenuAlt size={21} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="User Avatar"
                  />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">Abdulahi Redwan</p>
                <p className="text-sm text-gray-600">
                  abdulahiredwann@gmail.com
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 p-2 mt-9">
              <button className="btn   btn-outline  flex items-center gap-2">
                <MdDashboard />
                Dashboard
              </button>
              <button className="btn  btn-outline  flex items-center gap-2">
                <LuQrCode />
                Attendance
              </button>
              <button className="btn  btn-outline  flex items-center gap-2">
                <IoAnalyticsOutline />
                Analytics
              </button>
            </nav>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col gap-2 p-2">
            <button className="btn btn-outline border-none flex items-center gap-2">
              <IoIosNotificationsOutline />
              Notification
            </button>
            <button className="btn btn-outline border-none flex items-center gap-2">
              <LiaSignOutAltSolid /> Signout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">Welcome</div>
      </div>
    </>
  );
}

export default SideBar;
