import React from "react";

const Footer = () => {
  return (
    <div className="bg-blue-100 pt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
        Contact Us
      </h2>

      <div className="max-w-md bg-gray-100 mx-auto p-6 rounded shadow-md">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full px-4 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          ></textarea>
          <div className="text-center">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-16 text-center text-sm text-white bg-black py-9">
        © 2025 SUHAIM SOFT Systems. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Footer;
