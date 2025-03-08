
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white sticky top-0 z-40 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/a8a385c7-0e89-4d36-92bf-e69731a98a66.png" 
            alt="Aller Paws Logo" 
            className="h-12 md:h-14"
          />
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-[#033b5c] hover:text-[#33c1db] font-medium transition-colors">WHY</a>
          <a href="#how-it-works" className="text-[#033b5c] hover:text-[#33c1db] font-medium transition-colors">HOW</a>
          <a href="#features" className="text-[#033b5c] hover:text-[#33c1db] font-medium transition-colors">FEATURES</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate("/auth")}
            variant="ghost" 
            className="hidden md:flex text-[#033b5c] hover:text-[#33c1db] hover:bg-[#33c1db]/10 transition-colors"
          >
            Log In
          </Button>
          
          <Button 
            onClick={() => navigate("/auth?signup=true")}
            className="bg-[#033b5c] text-white hover:bg-[#033b5c]/90 rounded-full px-6"
          >
            Sign Up
          </Button>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-[#033b5c]"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-50 flex flex-col"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile menu header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <img 
                src="/lovable-uploads/a8a385c7-0e89-4d36-92bf-e69731a98a66.png" 
                alt="Aller Paws Logo" 
                className="h-10"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#033b5c]"
                aria-label="Close menu"
              >
                <X size={24} />
              </Button>
            </div>
            
            {/* Mobile menu items */}
            <div className="flex flex-col space-y-6 items-center justify-center flex-1 p-6">
              <a 
                href="#how-it-works" 
                className="text-xl font-medium text-[#033b5c] hover:text-[#33c1db] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                WHY
              </a>
              <a 
                href="#how-it-works" 
                className="text-xl font-medium text-[#033b5c] hover:text-[#33c1db] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOW
              </a>
              <a 
                href="#features" 
                className="text-xl font-medium text-[#033b5c] hover:text-[#33c1db] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FEATURES
              </a>
              <div className="w-full max-w-xs flex flex-col space-y-4 mt-6">
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                  variant="outline" 
                  className="text-[#033b5c] border-[#033b5c] hover:text-[#33c1db] hover:border-[#33c1db] w-full"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth?signup=true");
                  }}
                  className="bg-[#033b5c] text-white hover:bg-[#033b5c]/90 rounded-full w-full"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
