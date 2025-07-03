import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Header = ({
  color = 0x00a896,
  backgroundColor = 0x0d1b2a,
  size = 1.2,
}) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import Vanta.js
    import("vanta/dist/vanta.globe.min")
      .then((VANTA) => {
        if (vantaRef.current) {
          vantaEffect.current = VANTA.default.GLOBE({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color,
            backgroundColor,
            size,
            THREE,
          });
          setVantaLoaded(true);
        }
      })
      .catch((error) => {
        console.error("Failed to load Vanta.js:", error);
      });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, [color, backgroundColor, size]);

  return (
    <header
      id="home"
      className="relative min-h-[95vh] flex items-center justify-center text-center text-[#f1faee] px-4"
    >
      {!vantaLoaded && (
        <div className="absolute inset-0 z-0 bg-[#0d1b2a] flex items-center justify-center">
          <p>Loading background...</p>
        </div>
      )}
      <div
        ref={vantaRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="relative z-10 max-w-3xl bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
        <h1 className="text-4xl md:text-6xl font-bold mb-5 animate-fadeInDown">
          Suhaim Soft
        </h1>
        <p className="text-base md:text-lg mb-10 font-light animate-fadeInUp">
          SUHAIM SOFT delivers smart, secure, and efficient Electronic Medical
          Records (EMR) to empower healthcare professionals and improve patient
          outcomes.
        </p>
        <a
          href="#features"
          className="inline-block px-8 py-3 bg-[#00a896] text-[#f1faee] font-semibold rounded-full border-2 border-[#00a896] shadow-lg hover:bg-[#02c39a] hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Learn More
        </a>
      </div>
    </header>
  );
};

export default Header;
