import React from "react";
import Navbar from "../../Components/doctor/navbar";
import Footer from "../../Components/doctor/Footer";

const Home = () => {
  return (
    <>
      <div className=" bg-green-100 flex flex-col">
        <Navbar />
        {/* Hero Section */}
        <section className="min-h-screen flex-grow flex items-center justify-center bg-green-100 px-4 py-6">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              SUHAIM SOFT
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-9 animate-fade-in delay-100">
              Transform healthcare with AI-driven Electronic Medical Records
              (EMRs) that are secure, efficient, and predictive.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded animate-fade-in delay-200">
              Learn More
            </button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white py-16 px-4 md:px-10 flex flex-col items-center text-center rounded-lg mx-4 md:mx-20 mt-8 shadow-md">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">SUHAIM SOFT</h1>
          <p className="text-base md:text-lg max-w-4xl text-gray-700 mb-6">
            Transform healthcare with AI-driven Electronic Medical Records
            (EMRs) that are secure, efficient, and predictive. With the power of
            Artificial Intelligence, EMRs are now smarter, faster, and more
            capable of supporting healthcare professionals and improving patient
            outcomes.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded">
            Learn More
          </button>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-green-100 px-4 md:px-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow p-6 text-center transform transition duration-500 hover:scale-105 animate-pop">
              <h3 className="font-bold text-lg mb-2">Improved Patient Care</h3>
              <p className="text-sm text-gray-600">
                AI-powered EMR systems analyze patient data in real-time,
                offering insights that help healthcare providers deliver
                personalized care.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow p-6 text-center transform transition duration-500 hover:scale-105 animate-pop delay-100">
              <h3 className="font-bold text-lg mb-2">Enhanced Data Security</h3>
              <p className="text-sm text-gray-600">
                With advanced encryption and AI-based security measures, EMRs
                provide a higher level of data protection, ensuring patient
                privacy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow p-6 text-center transform transition duration-500 hover:scale-105 animate-pop delay-200">
              <h3 className="font-bold text-lg mb-2">Increased Efficiency</h3>
              <p className="text-sm text-gray-600">
                AI-driven automation reduces administrative burden, enabling
                healthcare professionals to focus more on patient care.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
