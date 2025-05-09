import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../../API/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/doctor/login", {
        email,
        password,
      });

      console.log(response.data.doctor);
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("doctorData", response.data.doctor);

      toast.success("Login successful!", {
        position: "top-center",
      });

      // Handle success (e.g., redirect or store token)
      console.log("Login success:", response.data);
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-700 to-cyan-400 px-4 relative">
      <ToastContainer />

      {/* Back Button */}
      <button className="absolute top-4 left-4 bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-800 transition-all">
        <div className="flex items-center gap-1">
          <FaArrowLeft size={12} />
          <span>Back</span>
        </div>
      </button>

      {/* Login Box */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center space-y-5">
        <h2 className="text-3xl font-bold text-gray-800">Doctor Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-cyan-400 cursor-not-allowed"
              : "bg-cyan-600 hover:bg-cyan-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
