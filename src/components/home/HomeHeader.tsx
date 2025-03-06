
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HomeHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || "Pet Parent";
  
  // Get the first name only
  const firstName = userName.split(' ')[0];
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  return (
    <div className="pt-6 pb-6">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{firstName}!</span>
          </h1>
          <p className="text-muted-foreground">Track and manage your pet's food allergies</p>
        </div>
        
        {user?.user_metadata?.avatar_url ? (
          <div 
            className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all"
            onClick={handleProfileClick}
          >
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div 
            className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all"
            onClick={handleProfileClick}
          >
            <span className="text-primary font-semibold text-sm">
              {firstName.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
