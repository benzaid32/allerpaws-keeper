
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <img 
            src="/icons/icon-144x144.png" 
            alt={APP_NAME} 
            className="w-8 h-8"
          />
          <span className="font-bold text-xl">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Log in
          </Button>
          <Button onClick={() => navigate("/auth?signup=true")}>
            Sign up free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
