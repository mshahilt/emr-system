import React from "react";

const WelcomeSection = () => {
  return (
    <section
      id="welcome"
      className="py-24 px-4 text-center bg-[#f8f9fa] dark:bg-[#0d1b2a]"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-5 relative inline-block text-[#333] dark:text-[#f1faee]">
        WELCOME TO SUHAIM SOFT
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#00a896] rounded"></span>
      </h2>
      <p className="text-base md:text-lg max-w-3xl mx-auto mb-12 text-[#666] dark:text-[#a0a0a0]">
        Your Partner in Digital Healthcare Transformation.
      </p>
      <div className="max-w-4xl mx-auto text-left text-[#666] dark:text-[#a0a0a0] text-base leading-8 fade-in">
        <p className="mb-5">
          In today's fast-paced medical environment, the most valuable resource
          is time. Administrative tasks and cumbersome paperwork can divert
          focus from what truly matters: patient care. SUHAIM SOFT was founded
          on a simple principle: to give that time back to healthcare
          professionals.
        </p>
        <p>
          Our intelligent Electronic Medical Record (EMR) system is more than
          just a digital filing cabinet. It is a powerful, integrated platform
          designed to streamline your entire workflow, from patient check-in to
          billing. By automating repetitive tasks, providing actionable insights
          from patient data, and ensuring rock-solid security, we empower you to
          practice medicine more efficiently and effectively. Join us in
          building a smarter, more connected future for healthcare.
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;
