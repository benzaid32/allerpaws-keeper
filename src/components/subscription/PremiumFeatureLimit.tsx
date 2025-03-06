
import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";

interface PremiumFeatureLimitProps {
  title: string;
  description: string;
  showUpgradeButton?: boolean;
}

const PremiumFeatureLimit = ({
  title,
  description,
  showUpgradeButton = true
}: PremiumFeatureLimitProps) => {
  const navigate = useNavigate();
  
  return (
    <Alert className="bg-muted/30 border-primary/20">
      <Lock className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary font-medium">{title}</AlertTitle>
      <AlertDescription className="text-muted-foreground mt-2">
        <p className="mb-3">{description}</p>
        {showUpgradeButton && (
          <Button 
            size="sm" 
            onClick={() => navigate("/pricing")}
            className="mt-1"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default PremiumFeatureLimit;
