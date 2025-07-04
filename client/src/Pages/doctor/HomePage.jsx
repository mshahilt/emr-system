import React, { useEffect, useState } from "react";
import Navbar from "../../Components/doctor/navbar";
import Footer from "../../Components/doctor/Footer";
import Preloader from "./Preorder"; 
import WhatsAppWidget from "../../Components/doctor/WhatsappWidget"; 
import ScrollToTop from "../../Components/doctor/Scrolltop"; 
import Header from "../../Components/doctor/Header"; 
import WelcomeSection from "../../Components/doctor/WelcomeSection"; 
import ProcessSection from "../../Components/doctor/ProccessinSection";
import FeaturesSection from "../../Components/doctor/FeatureSection"; 
import BenefitsSection from "../../Components/doctor/BenefitSection"; 
import "./Home.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {loading && <Preloader />}
      <Navbar theme={theme} setTheme={setTheme} />
      <Header />
      <div>
        <WelcomeSection />
        <ProcessSection />
        <FeaturesSection />
        <BenefitsSection />
      </div>
      <Footer />
      <WhatsAppWidget />
      <ScrollToTop />
    </>
  );
};

export default Home;
