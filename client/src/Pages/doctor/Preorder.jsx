import React from "react";

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-[#0d1b2a] z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="w-16 h-16 border-8 border-[#1b263b] border-t-[#00a896] rounded-full animate-spin"></div>
    </div>
  );
};

export default Preloader;
