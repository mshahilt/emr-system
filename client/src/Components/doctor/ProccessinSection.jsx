import React from "react";

const ProcessSection = () => {
  const processes = [
    {
      step: 1,
      title: "Consult & Demo",
      description:
        "Request a demo, and our specialists will showcase the platform's power, tailored to your clinic's needs.",
    },
    {
      step: 2,
      title: "Seamless Integration",
      description:
        "Our team handles the heavy lifting, migrating your existing data and integrating our EMR into your workflow.",
    },
    {
      step: 3,
      title: "Training & Support",
      description:
        "We provide comprehensive training and dedicated support to ensure your team is confident and successful.",
    },
  ];

  return (
    <section
      id="process"
      className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-white dark:bg-[#0d1b2a] overflow-hidden"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          id="process-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 relative inline-block text-[#1b263b] dark:text-[#f1faee] tracking-tight"
        >
          Our Simple Onboarding Process
          <span className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-[#00a896] rounded-full"></span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-12 text-[#6b7280] dark:text-[#a0b0c0] leading-relaxed">
          Get started with SUHAIM SOFT in three easy steps. Streamline your
          practice with our intuitive platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {processes.map((process, index) => (
            <div
              key={process.step}
              className="relative bg-[#f8fafc] dark:bg-[#1b263b] p-6 sm:p-8 rounded-2xl border border-[#e5e7eb] dark:border-[#ffffff1a] shadow-lg hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 ease-out group"
              style={{ transitionDelay: `${index * 0.15}s` }}
              role="region"
              aria-label={`Step ${process.step}: ${process.title}`}
            >
              {/* Step Number Circle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#00a896]/10 dark:bg-[#00a896]/20 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#00a896] mb-5 transition-transform duration-300 group-hover:scale-105 mx-auto">
                <span className="leading-none">{process.step}</span>
              </div>
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[#1b263b] dark:text-[#f1faee] tracking-tight">
                {process.title}
              </h3>
              {/* Description */}
              <p className="text-sm sm:text-base text-[#6b7280] dark:text-[#a0b0c0] leading-relaxed">
                {process.description}
              </p>
              {/* Subtle Gradient Overlay on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#00a896]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
