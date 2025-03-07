
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileCard from "@/components/ui/mobile-card";

interface AccountCardProps {
  onSignOut: () => Promise<void>;
}

const AccountCard: React.FC<AccountCardProps> = ({ onSignOut }) => {
  const navigate = useNavigate();
  
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
          onClick={onSignOut} 
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
