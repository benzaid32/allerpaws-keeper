
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Aller Paws. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-[#33c1db]">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-[#33c1db]">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-[#33c1db]">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
