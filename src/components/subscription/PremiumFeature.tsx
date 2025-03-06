
import React, { ReactNode } from "react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import PremiumFeatureLimit from "./PremiumFeatureLimit";

interface PremiumFeatureProps {
  children: ReactNode;
  title: string;
  description: string;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
}

const PremiumFeature = ({
  children,
  title,
  description,
  fallback,
  showUpgradeButton = true
}: PremiumFeatureProps) => {
  const { isPremium } = useSubscriptionContext();
  
  if (isPremium) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <PremiumFeatureLimit 
      title={title}
      description={description}
      showUpgradeButton={showUpgradeButton}
    />
  );
};

export default PremiumFeature;
