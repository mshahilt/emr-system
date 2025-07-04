import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorRoutes from "./Routes/DoctorRoute";
import Home from "./Pages/doctor/HomePage";
import "./App.css";
import "./index.css";
import React from "react";

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
