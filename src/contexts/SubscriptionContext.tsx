
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserSubscription } from "@/types/subscriptions";

interface SubscriptionContextType {
  isLoading: boolean;
  subscription: UserSubscription | null;
  isPremium: boolean;
  maxAllowedPets: number;
  maxEntriesPerMonth: number;
  canAccessAdvancedAnalysis: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" which is not an error for us
        console.error("Error fetching subscription:", error);
      }

      setSubscription(data as UserSubscription || null);
    } catch (error) {
      console.error("Error in subscription context:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user?.id]);

  // Determine whether the user has premium access
  const isPremium = !!subscription && 
    subscription.status === "active" && 
    (subscription.plan_id === "monthly" || subscription.plan_id === "annual");

  // Define limits based on subscription status
  const maxAllowedPets = isPremium ? 100 : 2;
  const maxEntriesPerMonth = isPremium ? 1000 : 20;
  const canAccessAdvancedAnalysis = isPremium;

  const value = {
    isLoading,
    subscription,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription: fetchSubscription
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
