
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
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("useSubscription: fetching subscription for user", user.id);
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(); // Changed from single() to maybeSingle() to avoid errors when no subscriptions exist

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - not an error for us
        console.error("Error fetching subscription:", error);
        setError(new Error(error.message));
        toast({
          title: "Error",
          description: "Failed to load subscription information",
          variant: "destructive",
        });
      }

      setSubscription(data as UserSubscription || null);
    } catch (error: any) {
      console.error("Error in subscription hook:", error);
      setError(error);
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
    try {
      setLoading(true);
      // This would call an API to cancel subscription
      console.log("Cancel subscription requested");
      toast({
        title: "Subscription update",
        description: "Your subscription has been scheduled for cancellation at the end of the billing period.",
      });
      await fetchSubscription();
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resumeSubscription = async () => {
    try {
      setLoading(true);
      // This would call an API to resume subscription
      console.log("Resume subscription requested");
      toast({
        title: "Subscription update",
        description: "Your subscription has been resumed.",
      });
      await fetchSubscription();
    } catch (error: any) {
      console.error("Error resuming subscription:", error);
      toast({
        title: "Error",
        description: "Failed to resume subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    error,
    hasPremiumAccess,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    refreshSubscription: fetchSubscription,
    cancelSubscription,
    resumeSubscription
  };
}
