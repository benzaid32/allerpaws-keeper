
import React, { createContext, useContext, ReactNode } from "react";
import { useSubscription as useSubscriptionHook } from "@/hooks/use-subscription";
import { SubscriptionContextType } from "@/types/subscription-context";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { 
    subscription, 
    loading: isLoading, 
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    fetchSubscription: refreshSubscription
  } = useSubscriptionHook();

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

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscriptionContext must be used within a SubscriptionProvider");
  }
  return context;
};
