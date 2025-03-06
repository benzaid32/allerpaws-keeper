
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Subscription {
  id: string;
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing";
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch the user's subscription
  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned"
        console.error("Error fetching subscription:", error);
        throw error;
      }

      if (data) {
        setSubscription({
          id: data.id,
          status: data.status,
          planId: data.plan_id,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
        });
      } else {
        setSubscription(null);
      }
    } catch (error: any) {
      console.error("Error in fetchSubscription:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user || !subscription) return;
    
    try {
      setIsProcessing(true);
      
      // For a real implementation, this would call a Supabase Edge Function
      // that would interact with Stripe to cancel the subscription
      
      // For now, we'll just update our local database
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);
      
      if (error) throw error;
      
      // Update the local state
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true,
      });
      
      toast({
        title: "Subscription canceled",
        description: "Your subscription will end at the end of the current billing period",
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Resume subscription
  const resumeSubscription = async () => {
    if (!user || !subscription) return;
    
    try {
      setIsProcessing(true);
      
      // For a real implementation, this would call a Supabase Edge Function
      // that would interact with Stripe to resume the subscription
      
      // For now, we'll just update our local database
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id);
      
      if (error) throw error;
      
      // Update the local state
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: false,
      });
      
      toast({
        title: "Subscription resumed",
        description: "Your subscription will continue automatically",
      });
    } catch (error: any) {
      console.error("Error resuming subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resume subscription",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user has active premium features
  const hasPremium = () => {
    if (!subscription) return false;
    
    // User has premium if they have an active subscription
    // or a canceled subscription that hasn't ended yet
    return (
      subscription.status === "active" || 
      subscription.status === "trialing" ||
      (subscription.status === "canceled" && new Date(subscription.currentPeriodEnd) > new Date())
    );
  };

  // Initialize subscription data
  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    isProcessing,
    hasPremium: hasPremium(),
    fetchSubscription,
    cancelSubscription,
    resumeSubscription,
  };
};
