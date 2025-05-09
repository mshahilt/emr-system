import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "../Pages/doctor/home";
import DoctorRegistration from "../Pages/doctor/DoctorRegistration";
import LoginPage from "../Pages/doctor/Login";
import BookAppointment from "../Pages/doctor/BookAppoiment";

import ProtectedRoutes from "./ProtectedRoutes";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="home" element={<Home />} />
      <Route path="Registration" element={<DoctorRegistration />} />
{/*       
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="appointment" element={<BookAppointment />} />
      <Route path="medicines" element={<MedicinePage />} />  */}
      
      <Route path="/*" element={<ProtectedRoutes />} />
      <Route path="*" element={<Navigate to="/doctor/login" replace />} />
    </Routes>
  );
};

export default DoctorRoutes;
