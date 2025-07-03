import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleThemeToggle = () =>
    setTheme(theme === "light" ? "dark" : "light");

  return (
    <nav className="bg-[#0d1b2a]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-20 py-4 flex justify-between items-center border-b border-white/10">
      <Link to="/" className="text-2xl font-bold text-[#f1faee]">
        <i className="fas fa-laptop-medical text-[#00a896] mr-2"></i> SUHAIM
        SOFT
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <ul
          className={`fixed md:static top-0 left-0 w-full h-screen md:h-auto bg-[#1b263b] md:bg-transparent flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 transition-all duration-400 ${
            isOpen ? "left-0" : "-left-full"
          }`}
        >
          {[
            "Home",
            "Welcome",
            "Process",
            "Features",
            "Benefits",
            "Enroll Now",
          ].map((item) => (
            <li key={item}>
              <Link
                to={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[#f1faee] text-lg hover:text-[#00a896] relative group"
                onClick={() => setIsOpen(false)}
              >
                {item}
                <span className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#00a896] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/doctor/login"
              className="text-[#f1faee] text-lg hover:text-[#00a896]"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
        <div className="relative inline-block w-12 h-6">
          <input
            type="checkbox"
            id="theme-toggle"
            className="hidden"
            checked={theme === "dark"}
            onChange={handleThemeToggle}
          />
          <label
            htmlFor="theme-toggle"
            className="block w-12 h-6 bg-gray-600 rounded-full cursor-pointer transition-colors duration-400"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-400 ${
                theme === "dark" ? "translate-x-6" : ""
              }`}
              style={{
                backgroundImage: `url(https://api.iconify.design/solar:${
                  theme === "dark" ? "moon" : "sun"
                }-bold.svg)`,
                backgroundSize: "cover",
              }}
            ></span>
          </label>
        </div>
        <div
          className="md:hidden flex flex-col gap-1.5 cursor-pointer"
          onClick={toggleMenu}
        >
          <span
            className={`w-7 h-0.5 bg-[#f1faee] transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2.5" : ""
            }`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-[#f1faee] transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-7 h-0.5 bg-[#f1faee] transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`}
          ></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
