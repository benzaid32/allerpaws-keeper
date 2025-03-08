
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white sticky top-0 z-40 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-xl text-black">Aller Paws</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#why" className="text-[#33c1db] hover:text-[#33c1db]/80">WHY</a>
          <a href="#how" className="text-[#33c1db] hover:text-[#33c1db]/80">HOW</a>
          <a href="#cost" className="text-[#33c1db] hover:text-[#33c1db]/80">COST</a>
        </nav>
        
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="text-[#33c1db]"
          >
            <Phone className="h-5 w-5 mr-2" />
            Contact
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
