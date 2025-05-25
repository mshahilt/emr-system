import React from "react";
import { Link, useLocation } from "react-router-dom";

function NavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center justify-center md:justify-start gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-700
        ${isActive ? "bg-blue-700 font-semibold" : ""}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="hidden md:block">{label}</span>
    </Link>
  );
}

export default NavLink;
