import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/NavBar";
import LoginPage from "./Components/Login/Login";
import SideBar from "./Components/Admin/SideBar";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {/* Conditionally render Navbar based on the route */}
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Home Page</h1>
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        {/* Admin routes */}
        <Route path="/admin/*" element={<SideBar />} />
      </Routes>
    </div>
  );
}

export default App;
