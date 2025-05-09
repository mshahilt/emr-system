import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/Middleware/protectedRoute";

// Admin Pages
import Login from "@/Pages/admin/Login";
import Signup from "@/Pages/admin/Signup"; 
import Dashboard from "@/Pages/admin/Dashboard";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} /> 
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
