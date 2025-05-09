import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BookAppointment from "../Pages/doctor/BookAppoiment";
// import SupportPage from "../pages/SupportPage";
import DashboardLayout from "../Components/doctor/layout/DashboardLayout";
import DashboardPage from "../Pages/admin/dashboard";
import MedicinePage from "../Pages/doctor/MedicinePage";
import PatientHistoryPage from "../Pages/doctor/PatientHIstory";

function ProtectedRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('token',token)
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/doctor/login" replace />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointment" element={<BookAppointment />} />
        <Route path="medicines" element={<MedicinePage />} />
        <Route path="patient-history" element={<PatientHistoryPage />} />
        {/* <Route path="support" element={<SupportPage />} /> */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

export default ProtectedRoutes;
