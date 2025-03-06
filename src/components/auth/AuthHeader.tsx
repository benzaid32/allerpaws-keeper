
import React from "react";
import { Pet } from "@/lib/types";

interface AuthHeaderProps {
  tempPetData?: Pet | null;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ tempPetData }) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-8 h-8 text-primary"
        >
          <path d="M19 9c0 1.3-.8 2.1-1.3 2.7-.7.8-1.7 1.3-2.7 1.3s-2-.5-2.7-1.3C11.8 11.1 11 10.3 11 9c0-1.3.8-2.1 1.3-2.7.7-.8 1.7-1.3 2.7-1.3s2 .5 2.7 1.3c.5.6 1.3 1.4 1.3 2.7z" />
          <path d="M9 18h6" />
          <path d="M14 13v5" />
          <path d="M5 5c.3 1 1.5 2 3 2" />
          <path d="M17 18.7c.4.2.7.3 1 .3 1 0 2-.5 2.7-1.3.5-.6 1.3-1.4 1.3-2.7s-.8-2.1-1.3-2.7c-.7-.8-1.7-1.3-2.7-1.3" />
          <path d="M10 18.7c-.4.2-.7.3-1 .3-1 0-2-.5-2.7-1.3C5.8 17.1 5 16.3 5 15s.8-2.1 1.3-2.7c.7-.8 1.7-1.3 2.7-1.3" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">AllerPaws</h1>
      <p className="text-muted-foreground mt-2">
        Managing your pet's food allergies made simple
      </p>
      {tempPetData && (
        <div className="mt-4 p-3 bg-primary/10 rounded-md">
          <p className="text-sm font-medium">
            Sign up or log in to save {tempPetData.name}'s information
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthHeader;
