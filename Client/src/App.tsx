import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/NavBar";
import LoginPage from "./Components/Login/Login";
import SideBar from "./Components/Admin/SideBar";
import AdminLogin from "./Components/Admin/AdminLogin";
import AttendanceComponent from "./Components/Admin/AttendanceComponent";
import AnalyticsComponent from "./Components/Admin/Analytics";
import { AuthProvider } from "./Services/Auth";
import ShowDetails from "./Components/Admin/ShowDetails";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginadmin" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <div className="flex">
              <SideBar />
              <div className="ml-72 flex-1 p-4">
                <Routes>
                  <Route
                    path="dashboard"
                    element={
                      <div>
                        <Dashboard></Dashboard>
                      </div>
                    }
                  />
                  <Route path="attendance" element={<AttendanceComponent />} />
                  <Route path="analytics" element={<AnalyticsComponent />} />
                  <Route path="seedetails/:id" element={<ShowDetails />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
