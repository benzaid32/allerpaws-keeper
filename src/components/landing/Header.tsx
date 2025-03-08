
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white sticky top-0 z-40 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <span className="font-bold text-xl text-black">Aller Paws</span>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-[#33c1db] hover:text-[#33c1db]/80 font-medium">WHY</a>
          <a href="#how-it-works" className="text-[#33c1db] hover:text-[#33c1db]/80 font-medium">HOW</a>
          <a href="#features" className="text-[#33c1db] hover:text-[#33c1db]/80 font-medium">FEATURES</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate("/auth")}
            variant="ghost" 
            className="hidden md:flex text-[#33c1db]"
          >
            Log In
          </Button>
          
          <Button 
            onClick={() => navigate("/auth?signup=true")}
            className="bg-[#33c1db] text-white hover:bg-[#33c1db]/90 rounded-full px-6"
          >
            Sign Up
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#33c1db]"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 pt-20 px-6">
          <div className="flex flex-col space-y-6 items-center">
            <a 
              href="#how-it-works" 
              className="text-xl font-medium text-[#33c1db]"
              onClick={() => setMobileMenuOpen(false)}
            >
              WHY
            </a>
            <a 
              href="#how-it-works" 
              className="text-xl font-medium text-[#33c1db]"
              onClick={() => setMobileMenuOpen(false)}
            >
              HOW
            </a>
            <a 
              href="#features" 
              className="text-xl font-medium text-[#33c1db]"
              onClick={() => setMobileMenuOpen(false)}
            >
              FEATURES
            </a>
            <Button 
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/auth");
              }}
              variant="ghost" 
              className="text-[#33c1db] w-full"
            >
              Log In
            </Button>
            <Button 
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/auth?signup=true");
              }}
              className="bg-[#33c1db] text-white hover:bg-[#33c1db]/90 rounded-full px-8 w-full"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
