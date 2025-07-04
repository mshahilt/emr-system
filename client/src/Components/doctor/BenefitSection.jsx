import React, { useEffect, useRef } from "react";

const BenefitsSection = () => {
  const countersRef = useRef([]);

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = 200;
    const updateCount = () => {
      const count = +counter.innerText.replace("%", "");
      const inc = target / speed;
      if (count < target) {
        counter.innerText = Math.ceil(count + inc) + "%";
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target + "%";
      }
    };
    updateCount();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countersRef.current.forEach((counter) => observer.observe(counter));
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      stat: 100,
      title: "Time Savings",
      description:
        "Reduce administrative overhead, allowing more time for what matters most: patient consultations.",
    },
    {
      stat: 100,
      title: "Data Accuracy",
      description:
        "Our system minimizes data entry errors, ensuring highly accurate and reliable patient records.",
    },
    {
      stat: 100,
      title: "Revenue Boost",
      description:
        "Streamline billing and coding to increase revenue collection by an average of 100%.",
    },
    {
      stat: 100,
      title: "Patient Satisfaction",
      description:
        "Faster check-ins and better data access lead to a significant increase in patient satisfaction.",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-24 px-4 text-center bg-[#f8f9fa] dark:bg-[#0d1b2a]"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-5 relative inline-block text-[#333] dark:text-[#f1faee]">
        Tangible Results
        <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-[#00a896] rounded"></span>
      </h2>
      <p className="text-base md:text-lg max-w-3xl mx-auto mb-12 text-[#666] dark:text-[#a0a0a0]">
        Our platform isn't just about features; it's about delivering real-world
        benefits that impact your bottom line and patient satisfaction.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className="bg-white dark:bg-[#1b263b] p-8 rounded-2xl border-l-4 border-[#00a896] shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 fade-in"
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            <div
              className="text-5xl font-extrabold text-[#333] dark:text-[#f1faee] mb-2"
              data-target={benefit.stat}
              ref={(el) => (countersRef.current[index] = el)}
            >
              0%
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[#333] dark:text-[#f1faee]">
              {benefit.title}
            </h3>
            <p className="text-sm text-[#666] dark:text-[#a0a0a0]">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
