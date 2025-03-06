
import React, { createContext, useContext, ReactNode } from "react";
import { useSubscription } from "@/hooks/use-subscription";
import { SubscriptionContextType } from "@/types/subscription-context";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { 
    subscription, 
    isLoading, 
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription 
  } = useSubscription();

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
