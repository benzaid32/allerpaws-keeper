
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
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

  // Enhanced debug logging
  useEffect(() => {
    console.log('SubscriptionProvider mounted with initial state:', {
      isLoading,
      subscription,
      isPremium,
      maxAllowedPets,
      maxEntriesPerMonth,
      canAccessAdvancedAnalysis,
    });
  }, []);

  // Enhanced debug logging for state changes
  useEffect(() => {
    console.log('SubscriptionProvider state updated:', {
      isLoading,
      subscription,
      isPremium,
      maxAllowedPets,
      maxEntriesPerMonth,
      canAccessAdvancedAnalysis,
    });
  }, [isLoading, subscription, isPremium, maxAllowedPets, maxEntriesPerMonth, canAccessAdvancedAnalysis]);

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
