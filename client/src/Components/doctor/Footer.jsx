import React, { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css"; // Import default styles

const Footer = () => {
  const phoneInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (phoneInputRef.current) {
      const inputNode = phoneInputRef.current;
      const iti = intlTelInput(inputNode, {
        initialCountry: "in",
        onlyCountries: ["in", "us", "gb", "ca", "au"], // Limit to specific countries
        preferredCountries: ["in"], // Show India at the top
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        separateDialCode: true, // Show dial code separately
        dropdownContainer: document.body, // Ensure dropdown is appended to body for better positioning
      });

      // Event listener for country change
      const handleCountryChange = () => {
        console.log("Selected country:", iti.getSelectedCountryData().name);
      };
      inputNode.addEventListener("countrychange", handleCountryChange);

      return () => {
        iti.destroy();
        inputNode.removeEventListener("countrychange", handleCountryChange);
      };
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = formRef.current.querySelector("#name").value;
    const email = formRef.current.querySelector("#email").value;
    const phoneInput = intlTelInput.getInstance(phoneInputRef.current);

    if (!phoneInput.isValidNumber()) {
      alert("Please enter a valid phone number.");
      return;
    }

    const fullPhoneNumber = phoneInput.getNumber();
    const yourWANumber = "918891479505";
    const messageText = `*New Enrollment from SUHAIM SOFT Website*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${fullPhoneNumber}\n\nI'm interested in a demo.`;
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappURL = `https://wa.me/${yourWANumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <footer
      id="enroll-now-footer"
      className="bg-[#0d1b2a] text-[#f1faee] py-20 px-4 text-center"
    >
      <div className="max-w-xl mx-auto mb-12 fade-in">
        <h4 className="text-xl md:text-2xl font-semibold mb-3">
          Ready to Digitalize Your Practice?
        </h4>
        <p className="text-[#bbb] mb-8">
          Fill out the form below to begin your journey with SUHAIM SOFT. We'll
          get in touch with you shortly.
        </p>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-5 text-left">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              required
            />
          </div>
          <div className="mb-5 text-left">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              required
            />
          </div>
          <div className="mb-5 text-left">
            <label htmlFor="phone" className="block mb-2 font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              ref={phoneInputRef}
              className="w-full p-3 rounded-lg bg-[#1b263b] text-[#f1faee] border border-white/20"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <i className="fab fa-whatsapp"></i> Enroll Now via WhatsApp
          </button>
        </form>
      </div>
      <div className="mb-5">
        <a
          href="https://www.facebook.com/share/16WXpVs2Js/"
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          href="#"
          id="footer-wa-link"
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <a
          href="https://www.instagram.com/suhaimsoft?igsh=MWpzazg4emk2N2R3bQ=="
          className="text-[#f1faee] text-2xl mx-4 hover:text-[#00a896] hover:-translate-y-1 transition-all duration-300"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      <p>© 2025 SUHAIM SOFT Systems. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
