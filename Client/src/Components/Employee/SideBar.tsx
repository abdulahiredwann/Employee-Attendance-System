import React from "react";

// Define the type for the props, including children
type SidebarLayoutProps = {
  children: React.ReactNode;
};

// Define the SidebarLayout component with props type
const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr] bg-base-200">
      {/* Sidebar */}
      <div className="flex flex-col gap-2 border-r bg-base-100 p-4">
        <div className="flex h-[60px] items-center justify-between border-b px-2">
          <h2 className="text-lg font-semibold">Attendance</h2>
          <button className="btn btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <path d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-2">
          <button className="btn btn-primary">Dashboard</button>
          <button className="btn btn-primary">Reports</button>
          <button className="btn btn-primary">Settings</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
