
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { PawPrint } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#78c6d9] backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-white" />
          <span className="font-bold text-xl text-white">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="text-white hover:bg-white/10"
          >
            Log in
          </Button>
          <Button 
            onClick={() => navigate("/auth?signup=true")}
            className="bg-white text-[#78c6d9] hover:bg-white/90"
          >
            Sign up free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
