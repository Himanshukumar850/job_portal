import React from "react";
import { useNavigate } from "react-router-dom";
import himanshuImage from "../assets/himanshu.jpg";
const About = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white">
      
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">
          About <span className="text-purple-600">JobPortal</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We connect talented individuals with top companies around the world.
          Our mission is to simplify the hiring process and empower careers.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        <div className="p-6 bg-gray-50 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-3"> Our Mission</h2>
          <p className="text-gray-600">
            To help job seekers discover meaningful opportunities and enable
            companies to hire the best talent quickly and efficiently.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-3"> Our Vision</h2>
          <p className="text-gray-600">
            To become the most trusted and innovative job platform globally,
            bridging the gap between talent and opportunity.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Us?
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-lg mb-2"> Smart Job Search</h3>
            <p className="text-gray-600 text-sm">
              Find jobs tailored to your skills and preferences with our smart filtering system.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-lg mb-2"> Fast Hiring</h3>
            <p className="text-gray-600 text-sm">
              Companies can quickly connect with the right candidates and streamline hiring.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <h3 className="font-semibold text-lg mb-2"> Trusted Platform</h3>
            <p className="text-gray-600 text-sm">
              Thousands of users trust our platform for secure and reliable job opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-purple-600">10K+</h3>
            <p className="text-gray-600 text-sm">Jobs Posted</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-600">5K+</h3>
            <p className="text-gray-600 text-sm">Companies</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-600">20K+</h3>
            <p className="text-gray-600 text-sm">Candidates</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-600">95%</h3>
            <p className="text-gray-600 text-sm">Success Rate</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Meet Our Team
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow">
            <img
              src={himanshuImage}
              alt="team"
              className="mx-auto rounded-full mb-4"
            />
            <h3 className="font-semibold">Himanshu Kumar</h3>
            <p className="text-gray-500 text-sm">Founder & Developer</p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-6">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Find Your Dream Job?
        </h2>
        <button onClick={() =>navigate(`/`)} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Get Started
        </button>
      </section>

    </div>
  );
};

export default About;