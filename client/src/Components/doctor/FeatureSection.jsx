import React from "react";
import { Icon } from "@iconify/react";

const FeaturesSection = () => {
  const features = [
    {
      icon: "mdi:prescription",
      title: "30-Second Prescriptions",
      description:
        "Generate and finalize complete prescriptions in under 30 seconds with intelligent templates and drug databases.",
    },
    {
      icon: "mdi:send",
      title: "Automated Prescription Delivery",
      description:
        "Instantly and securely send finalized prescriptions directly to the patient's email or preferred pharmacy, eliminating paper and wait times.",
    },
    {
      icon: "mdi:view-dashboard",
      title: "Live Appointment Dashboard",
      description:
        "Staff can manage patient bookings, while doctors see all appointment data in real-time on their dashboard, ensuring perfect sync and preparation.",
    },
    {
      icon: "mdi:video",
      title: "Digital Consultation Room",
      description:
        "Conduct secure and efficient patient consultations from anywhere. Our easy-to-use digital EMR provides all the tools you need.",
    },
    {
      icon: "mdi:lightning-bolt",
      title: "Fast & Easy to Use",
      description:
        "Our system is designed for speed and simplicity, allowing your staff to manage clinic operations with minimal training and maximum efficiency.",
    },
    {
      icon: "mdi:shield-lock",
      title: "Secure Platform",
      description:
        "Built with multiple layers of security to protect your data and ensure HIPAA compliance at all times.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-[#0d1b2a]"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 relative inline-block text-[#f1faee] tracking-tight"
        >
          Key Features
          <span className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-[#00a896] rounded-full"></span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-12 text-[#a0b0c0] leading-relaxed">
          Explore the core functionalities that set our EMR system apart.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-[#1b263b] p-6 sm:p-8 rounded-2xl border border-[#ffffff1a] shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 ease-out group"
              style={{ transitionDelay: `${(index % 3) * 0.15}s` }}
              role="region"
              aria-label={`Feature: ${feature.title}`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-5">
                <Icon
                  icon={feature.icon}
                  className="text-4xl sm:text-5xl text-[#00a896] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[#f1faee] tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-[#a0b0c0] leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#00a896]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
