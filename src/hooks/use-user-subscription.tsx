
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserSubscription } from "@/types/subscriptions";

export function useUserSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("useSubscription: fetching subscription for user", user.id);
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - not an error for us
        console.error("Error fetching subscription:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription information",
          variant: "destructive",
        });
      }

      setSubscription(data as UserSubscription || null);
    } catch (error) {
      console.error("Error in subscription hook:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription on mount and when user changes
  useEffect(() => {
    console.log("useSubscription: user changed, fetching subscription", user?.id);
    fetchSubscription();
  }, [user?.id]);

  // Calculate derived subscription states 
  const hasPremiumAccess = !!subscription && 
    subscription.status === "active" && 
    (subscription.plan_id === "monthly" || subscription.plan_id === "annual");
  
  // Define limits based on subscription status
  const maxAllowedPets = hasPremiumAccess ? 100 : 2;
  const maxEntriesPerMonth = hasPremiumAccess ? 1000 : 20;
  const canAccessAdvancedAnalysis = hasPremiumAccess;

  // Mock implementation for subscription management functions
  const cancelSubscription = async () => {
    // This would call an API to cancel subscription
    console.log("Cancel subscription requested");
    toast({
      title: "Subscription update",
      description: "Your subscription has been scheduled for cancellation at the end of the billing period.",
    });
    await fetchSubscription();
  };

  const resumeSubscription = async () => {
    // This would call an API to resume subscription
    console.log("Resume subscription requested");
    toast({
      title: "Subscription update",
      description: "Your subscription has been resumed.",
    });
    await fetchSubscription();
  };

  return {
    subscription,
    loading,
    hasPremiumAccess,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription: fetchSubscription,
    cancelSubscription,
    resumeSubscription
  };
}
