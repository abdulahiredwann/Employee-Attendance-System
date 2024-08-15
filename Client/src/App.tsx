import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/NavBar";
import LoginPage from "./Components/Login/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<></>}></Route>
            <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
