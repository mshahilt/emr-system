import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <a
      href="#home"
      className={`fixed bottom-5 right-5 bg-[#00a896] text-[#f1faee] w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none"
      } hover:bg-[#02c39a] hover:-translate-y-1`}
      aria-label="Scroll to top"
    >
      <Icon icon="mdi:arrow-up" className="text-xl" />
    </a>
  );
};

export default ScrollToTop;
