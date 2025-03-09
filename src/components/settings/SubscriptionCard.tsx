
import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileCard from "@/components/ui/mobile-card";
import CurrentPlan from "@/components/subscription/CurrentPlan";
import { useUserSubscription } from "@/hooks/use-user-subscription";

const SubscriptionCard: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, loading } = useUserSubscription();
  
  return (
    <MobileCard
      icon={<Crown className="h-5 w-5 text-primary" />}
      title="Your Subscription"
    >
      <CurrentPlan subscription={subscription} isLoading={loading} />
      <div className="mt-4">
        <Button 
          onClick={() => navigate("/pricing")} 
          className="w-full"
          variant="outline"
        >
          View All Plans
        </Button>
      </div>
    </MobileCard>
  );
};

export default SubscriptionCard;
