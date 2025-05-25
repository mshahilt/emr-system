import React from "react";
import Sidebar from "../common/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: fixed width, responsive (w-20 on mobile, w-72 on desktop) */}
      <div className="w-20 md:w-72 fixed inset-y-0 left-0 bg-white shadow-md z-20 transition-all duration-300">
        <Sidebar />
      </div>

      {/* Main Content Area: adjust margin to match sidebar width */}
      <div className="flex-1 ml-20 md:ml-72 overflow-y-auto bg-gray-100 p-4 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
