
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileCard from "@/components/ui/mobile-card";
import { useAuth } from "@/contexts/AuthContext";

const AccountCard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/onboarding");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <MobileCard
      icon={<User className="h-5 w-5 text-primary" />}
      title="Account"
    >
      <div className="space-y-4">
        <Button
          onClick={() => navigate("/profile")}
          variant="outline"
          className="w-full"
        >
          Edit Profile
        </Button>
        <Button 
          onClick={handleSignOut} 
          variant="destructive" 
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </MobileCard>
  );
};

export default AccountCard;
