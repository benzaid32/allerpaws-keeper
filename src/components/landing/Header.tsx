
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#5ec9d7] sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-white" />
          <span className="font-bold text-xl text-white">Allé Paws</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white hover:text-white/80">Features</a>
          <a href="#how-it-works" className="text-white hover:text-white/80">How It Works</a>
          <a href="#about-us" className="text-white hover:text-white/80">About Us</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="text-white hover:bg-white/10"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/auth?signup=true")}
            className="bg-white text-[#5ec9d7] hover:bg-white/90"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
