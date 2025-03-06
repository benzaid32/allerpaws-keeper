
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useUserSubscription } from '@/hooks/use-user-subscription';
import { SubscriptionContextType } from '@/types/subscription-context';
import { useToast } from '@/hooks/use-toast';

// Create the context with a default value
const SubscriptionContext = createContext<SubscriptionContextType>({
  isLoading: false,
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
  const { toast } = useToast();
  
  const {
    loading: isLoading,
    subscription,
    hasPremiumAccess: isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription,
    cancelSubscription,
    resumeSubscription,
    error
  } = useUserSubscription();

  // Only log once on mount to prevent excessive console output
  useEffect(() => {
    console.log('SubscriptionProvider mounted with initial state:', {
      isLoading,
      subscription,
      isPremium,
    });
    
    // Show error toast if there was an error fetching subscription
    if (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Couldn't Load Subscription",
        description: "Your subscription details couldn't be loaded. Some features may be limited.",
        variant: "destructive",
      });
    }
  }, []);

  // Log state updates when relevant values change
  useEffect(() => {
    console.log('SubscriptionProvider state updated:', {
      isLoading,
      subscription,
      isPremium,
    });
  }, [isLoading, subscription, isPremium]);

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
