
import React, { createContext, useContext, ReactNode } from "react";
import { useSubscription } from "@/hooks/use-subscription";
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
    fetchSubscription: refreshSubscription,
    cancelSubscription,
    resumeSubscription
  } = useSubscription();

  const value: SubscriptionContextType = {
    isLoading,
    subscription,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription,
    cancelSubscription,
    resumeSubscription
  };

  console.log("SubscriptionProvider rendering with value:", { 
    isLoading, 
    hasSubscription: Boolean(subscription),
    isPremium 
  });

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
