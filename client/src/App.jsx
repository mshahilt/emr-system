import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorRoutes from "./Routes/DoctorRoute";
import React from "react";
import Home from "./Pages/doctor/HomePage";
import "./App.css";
import "./index.css";
import "./styles/tailwind.css";
import "./styles/doctor.css";
import "./styles/doctorResponsive.css";    

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={ <Home/>}/>
        <Route path="/doctor/*" element={<DoctorRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;
