import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-gray-100 border-t mt-16">

      {/* FULL WIDTH BACKGROUND */}
      <div className="w-full">

        {/* CENTERED CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-10
                        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Logo Section */}
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold">
              Job<span className="text-[#6A38C2]">Portal</span>
            </h1>

            <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
              Find your dream job with thousands of job opportunities 
              from top companies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-base sm:text-lg mb-3">
              Quick Links
            </h2>

            <ul className="space-y-2 text-gray-600 text-sm sm:text-base">

              <li
                className="hover:text-[#6A38C2] cursor-pointer transition"
                onClick={() => navigate(`/`)}
              >
                Home
              </li>

              <li
                className="hover:text-[#6A38C2] cursor-pointer transition"
                onClick={() => navigate(`/browse`)}
              >
                Browse Jobs
              </li>

              <li
                className="hover:text-[#6A38C2] cursor-pointer transition"
                onClick={() => navigate(`/about`)}
              >
                About Us
              </li>

            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h2 className="font-semibold text-base sm:text-lg mb-3">
              Follow Us
            </h2>

            <div className="flex justify-center sm:justify-start gap-4">

              {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-full shadow-md 
                             hover:bg-[#6A38C2] hover:text-white 
                             cursor-pointer transition duration-300"
                >
                  <Icon size={16} />
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;