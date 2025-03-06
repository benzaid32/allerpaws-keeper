
import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { SubscriptionContextType } from '@/types/subscription-context';

// Create the context with a default value
const SubscriptionContext = createContext<SubscriptionContextType>({
  isLoading: true,
  subscription: null,
  isPremium: false,
  maxAllowedPets: 2,
  maxEntriesPerMonth: 30,
  canAccessAdvancedAnalysis: false,
  refreshSubscription: async () => {},
  cancelSubscription: async () => {},
  resumeSubscription: async () => {},
});

export const useSubscriptionContext = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    loading: isLoading,
    subscription,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    fetchSubscription: refreshSubscription,
    cancelSubscription,
    resumeSubscription,
  } = useSubscription();

  // Added debug log to see all subscription-related values
  console.log('SubscriptionProvider rendering with subscription state:', {
    isLoading,
    subscription,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
  });

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading,
        subscription,
        isPremium,
        maxAllowedPets,
        maxEntriesPerMonth,
        canAccessAdvancedAnalysis,
        refreshSubscription,
        cancelSubscription,
        resumeSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
