
import React, { createContext, useContext, ReactNode } from "react";
import { useSubscriptionOperations } from "@/hooks/use-subscription-operations";
import { SubscriptionContextType } from "@/types/subscription-context";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { subscription, isLoading, refreshSubscription } = useSubscriptionOperations();

  // Determine whether the user has premium access
  const isPremium = !!subscription && 
    subscription.status === "active" && 
    (subscription.plan_id === "monthly" || subscription.plan_id === "annual");

  // Define limits based on subscription status
  const maxAllowedPets = isPremium ? 100 : 2;
  const maxEntriesPerMonth = isPremium ? 1000 : 20;
  const canAccessAdvancedAnalysis = isPremium;

  const value: SubscriptionContextType = {
    isLoading,
    subscription,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
