import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-yellow-400 text-2xl font-bold">Suhaim Soft</div>

        {/* Mobile menu toggle button */}
        <button onClick={toggleMenu} className="text-white md:hidden text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-16 items-center">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaInfoCircle /> About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaPhone /> Contact
            </Link>
          </li>
          <li>
            <Link
              to="/doctor/login"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaSignInAlt /> Login
            </Link>
          </li>
          <li>
            <Link
              to="/doctor/registration"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaUserPlus /> Create Account
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4">
          <li>
            <Link
              onClick={toggleMenu}
              to="/"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleMenu}
              to="/about"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaInfoCircle /> About
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleMenu}
              to="/contact"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaPhone /> Contact
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleMenu}
              to="/doctor/login"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaSignInAlt /> Login
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleMenu}
              to="/signup"
              className="flex items-center gap-1 hover:text-yellow-400"
            >
              <FaUserPlus /> Create Account
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
