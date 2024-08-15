import { useState } from "react";
import logo from "../../public/ABD tech company logo.png";
import { CiLogin } from "react-icons/ci";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <a href="/" className="text-gray-800 text-sm font-bold">
            ABD tech
          </a>
        </div>
        {/* Desktop view */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/"
            className="text-gray-800 hover:text-gray-600 transition duration-300"
          >
            Home
          </a>
          <a
            href="/about"
            className="text-gray-800 hover:text-gray-600 transition duration-300"
          >
            About Us
          </a>
          <a
            href="/services"
            className="text-gray-800 hover:text-gray-600 transition duration-300"
          >
            Services
          </a>
          <a
            href="/contact"
            className="text-gray-800 hover:text-gray-600 transition duration-300"
          >
            Contact
          </a>
          <a
            href="/login"
            className="flex items-center text-gray-800 hover:text-gray-600 transition duration-300"
          >
            <CiLogin size={25} className="mr-1" />
            <span>Login</span>
          </a>
        </div>
        {/* Mobile view */}
        <div className="md:hidden flex items-center space-x-4">
          <a
            href="/login"
            className="flex items-center text-gray-800 hover:text-gray-600 transition duration-300"
          >
            <CiLogin size={25} className="mr-1" />
            <span>Login</span>
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden mt-2 ${
          isOpen ? "block" : "hidden"
        } bg-white shadow-lg`}
      >
        <a
          href="/"
          className="block text-gray-800 py-2 px-4 hover:bg-gray-100 transition duration-300"
        >
          Home
        </a>
        <a
          href="/about"
          className="block text-gray-800 py-2 px-4 hover:bg-gray-100 transition duration-300"
        >
          About Us
        </a>
        <a
          href="/services"
          className="block text-gray-800 py-2 px-4 hover:bg-gray-100 transition duration-300"
        >
          Services
        </a>
        <a
          href="/contact"
          className="block text-gray-800 py-2 px-4 hover:bg-gray-100 transition duration-300"
        >
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
