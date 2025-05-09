import React from "react";
import Sidebar from "../common/Sidebar";

function DashboardLayout({ children }) {
  console.log('dahboard')
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default DashboardLayout;
