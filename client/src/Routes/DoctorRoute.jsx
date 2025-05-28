import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "../Pages/doctor/HomePage";
// import DoctorRegistration from "../Pages/doctor/DoctorRegistration";
import LoginPage from "../Pages/doctor/Login";

import ProtectedRoutes from "./ProtectedRoutes";

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="home" element={<Home />} />
      <Route path="/*" element={<ProtectedRoutes />} />
      <Route path="*" element={<Navigate to="/doctor/login" replace />} />
    </Routes>
  );
};

export default DoctorRoutes;
