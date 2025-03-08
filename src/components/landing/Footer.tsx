
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
            <div className="mb-4">
              <img 
                src="/lovable-uploads/a8a385c7-0e89-4d36-92bf-e69731a98a66.png" 
                alt="Aller Paws Logo" 
                className="h-10 md:h-12"
              />
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Helping pet owners identify and manage food allergies to keep their furry friends happy and healthy.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-[#033b5c] hover:text-[#33c1db] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#033b5c] hover:text-[#33c1db] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-[#033b5c] hover:text-[#33c1db] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-[#033b5c] mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-[#33c1db] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#33c1db] transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#33c1db] transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-[#33c1db] transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-[#033b5c] mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/faqs" className="text-gray-600 hover:text-[#33c1db] transition-colors">FAQs</Link></li>
              <li><Link to="/help" className="text-gray-600 hover:text-[#33c1db] transition-colors">Help Center</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-[#33c1db] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-[#33c1db] transition-colors">Terms of Service</Link></li>
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
