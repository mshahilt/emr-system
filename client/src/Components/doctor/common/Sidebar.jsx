import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaPills,
  FaStethoscope,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import NavLink from "./NavLink";

function Sidebar() {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Dr. Name",
    phone: "+91XXXXXXXXXX",
  });

  useEffect(() => {
    // Fetch doctor info from API
    const fetchDoctorInfo = async () => {
      try {
        // Uncomment when API is ready
        // const response = await axiosInstance.get("/api/doctor/profile");
        // setDoctorInfo(response.data);
      } catch (error) {
        console.error("Error fetching doctor info", error);
      }
    };

    fetchDoctorInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/doctor/login";
  };

  return (
    <aside className="w-72 bg-blue-900 text-white flex flex-col py-6 px-4">
      {/* Logo and Doctor Info */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
          <FaUserMd className="text-blue-800 text-3xl" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{doctorInfo.name}</h2>
        <p className="text-sm text-gray-300">{doctorInfo.phone}</p>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-4 text-sm font-medium">
        <NavLink to="/doctor/dashboard" icon={<FaUsers />} label="Dashboard" />
        <NavLink
          to="/doctor/appointment"
          icon={<FaCalendarAlt />}
          label="Book Appointment"
        />
        <NavLink to="/doctor/medicines" icon={<FaPills />} label="Medicines" />
        <NavLink
          to="/doctor/patient-history"
          icon={<FaStethoscope />}
          label="Patient History"
        />
        <NavLink to="/doctor/support" icon={<FaComments />} label="Support" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700 w-full text-left"
        >
          <span className="text-lg">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
