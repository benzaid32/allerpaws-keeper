
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserSubscription } from '@/types/subscriptions';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Derived properties based on subscription status
  const isPremium = Boolean(
    subscription && 
    subscription.status === "active" && 
    (subscription.plan_id === "monthly" || subscription.plan_id === "annual")
  );
  
  const maxAllowedPets = isPremium ? Infinity : 2; // Free users get 2 pets
  const maxEntriesPerMonth = isPremium ? Infinity : 30; // Free users get 30 entries per month
  const canAccessAdvancedAnalysis = isPremium;

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      setSubscription(null);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        // If it's not a "no rows" error, throw it
        if (!error.message?.includes('no rows')) {
          throw error;
        }
      }

      if (data && data.length > 0) {
        setSubscription(data[0] as UserSubscription);
      } else {
        // No subscription found
        setSubscription(null);
      }
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      // Don't show error toast for expected errors
      if (!(error.message && 
          (error.message.includes('JSON object requested, multiple (or no) rows returned') ||
           error.message.includes('no rows')))) {
        toast({
          title: 'Failed to load subscription',
          description: 'Please try again or contact support',
          variant: 'destructive',
        });
      }
      // Set subscription to null when there's an error
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // This would normally call the Supabase edge function or backend API
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      
      if (error) throw error;
      
      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancel_at_period_end: true
        });
      }
      
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription will end at the current billing period',
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Failed to cancel subscription',
        description: 'Please try again or contact support',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resumeSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // This would normally call the Supabase edge function or backend API
      const { data, error } = await supabase.functions.invoke('resume-subscription');
      
      if (error) throw error;
      
      // Update local state
      if (subscription) {
        setSubscription({
          ...subscription,
          cancel_at_period_end: false
        });
      }
      
      toast({
        title: 'Subscription resumed',
        description: 'Your subscription has been successfully resumed',
      });
    } catch (error) {
      console.error('Error resuming subscription:', error);
      toast({
        title: 'Failed to resume subscription',
        description: 'Please try again or contact support',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    isPremium,
    maxAllowedPets,
    maxEntriesPerMonth,
    canAccessAdvancedAnalysis,
    cancelSubscription,
    resumeSubscription,
    fetchSubscription
  };
};
