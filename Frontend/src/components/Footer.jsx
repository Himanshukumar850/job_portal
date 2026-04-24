import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-100 border-t mt-20">

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo Section */}
        <div>
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#6A38C2]">Portal</span>
          </h1>
          <p className="text-gray-600 mt-3">
            Find your dream job with thousands of job opportunities from top companies.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Quick Links</h2>

          <ul className="space-y-2 text-gray-600">

            <li className="hover:text-[#6A38C2] cursor-pointer" onClick={() =>navigate (`/`)} >Home</li>
            <li className="hover:text-[#6A38C2] cursor-pointer" onClick={() => navigate(`/Browse`)} >Browse Jobs</li>
            <li className="hover:text-[#6A38C2] cursor-pointer" onClick={() => navigate(`/about`)} >About Us</li>

          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Follow Us</h2>

          <div className="flex gap-4 text-xl">

            <div className="p-3 bg-white rounded-full shadow hover:bg-[#6A38C2] hover:text-white cursor-pointer">
              <FaFacebookF />
            </div>

            <div className="p-3 bg-white rounded-full shadow hover:bg-[#6A38C2] hover:text-white cursor-pointer">
              <FaTwitter />
            </div>

            <div className="p-3 bg-white rounded-full shadow hover:bg-[#6A38C2] hover:text-white cursor-pointer">
              <FaLinkedinIn />
            </div>

            <div className="p-3 bg-white rounded-full shadow hover:bg-[#6A38C2] hover:text-white cursor-pointer">
              <FaInstagram />
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t text-center py-4 text-gray-500 text-sm">
        © 2026 JobPortal. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;