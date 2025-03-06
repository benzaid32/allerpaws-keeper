
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserSubscription } from "@/types/subscriptions";

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
        const subData = data as unknown as UserSubscription;
        setSubscription({
          id: subData.id,
          status: subData.status,
          planId: subData.plan_id,
          currentPeriodEnd: subData.current_period_end,
          cancelAtPeriodEnd: subData.cancel_at_period_end,
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
      
      // For LemonSqueezy, we'll redirect to their customer portal
      // This is just a placeholder - replace with actual LemonSqueezy customer portal URL
      window.location.href = "https://allerpaws.lemonsqueezy.com/my-account";
      
      // Note: the actual cancellation will be handled by LemonSqueezy
      // and the webhook will update our database
      
      toast({
        title: "Redirecting to customer portal",
        description: "You'll be redirected to manage your subscription",
      });
      
      // We don't immediately update state since the change will happen on LemonSqueezy's side
      return;
    } catch (error: any) {
      console.error("Error redirecting to customer portal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Resume subscription (manage on LemonSqueezy portal)
  const resumeSubscription = async () => {
    if (!user || !subscription) return;
    
    try {
      setIsProcessing(true);
      
      // For LemonSqueezy, we'll redirect to their customer portal
      window.location.href = "https://allerpaws.lemonsqueezy.com/my-account";
      
      toast({
        title: "Redirecting to customer portal",
        description: "You'll be redirected to manage your subscription",
      });
      
      return;
    } catch (error: any) {
      console.error("Error redirecting to customer portal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
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
