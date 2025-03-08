
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-xl text-black mb-4">Aller Paws</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Helping pet owners identify and manage food allergies to keep their furry friends happy and healthy.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-[#33c1db] hover:text-[#33c1db]/80">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#33c1db] hover:text-[#33c1db]/80">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-[#33c1db] hover:text-[#33c1db]/80">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-black mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-[#33c1db]">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#33c1db]">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#33c1db]">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-[#33c1db]">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-black mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="text-gray-600 hover:text-[#33c1db]">FAQs</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-[#33c1db]">Help Center</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-[#33c1db]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-[#33c1db]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Aller Paws. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
