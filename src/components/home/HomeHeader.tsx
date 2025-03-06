
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";

const HomeHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userName = user?.user_metadata?.full_name || "Pet Parent";
  
  // Get the first name only
  const firstName = userName.split(' ')[0];
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleSignOut = async () => {
    try {
      console.log("HomeHeader: Initiating sign out process");
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      // The page will be redirected by the signOut function in AuthContext
    } catch (error: any) {
      console.error("HomeHeader: Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "Could not sign out. Please try again.",
      });
    }
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user?.user_metadata?.avatar_url ? (
              <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all">
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all">
                <span className="text-primary font-semibold text-sm">
                  {firstName.charAt(0)}
                </span>
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HomeHeader;
