
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  status: string;
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
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
        throw error;
      }

      if (data && data.length > 0) {
        const subData = data[0];
        setSubscription({
          status: subData.status,
          planId: subData.plan_id,
          currentPeriodEnd: subData.current_period_end,
          cancelAtPeriodEnd: subData.cancel_at_period_end,
        });
      } else {
        // No subscription found
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Don't show error toast for 404/406 errors which are expected when no subscription exists
      if (!(error.message && error.message.includes('JSON object requested, multiple (or no) rows returned'))) {
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
          cancelAtPeriodEnd: true
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
          cancelAtPeriodEnd: false
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
    cancelSubscription,
    resumeSubscription,
    fetchSubscription
  };
};
