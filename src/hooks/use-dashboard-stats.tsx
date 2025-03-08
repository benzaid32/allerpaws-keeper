
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useDashboardStats() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<number>(0);
  const [symptomsThisWeek, setSymptomsThisWeek] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get date for 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString();
        
        // Fetch all pet IDs for the current user
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('id')
          .eq('user_id', user.id);
          
        if (petsError) throw petsError;
        
        if (!petsData || petsData.length === 0) {
          // User has no pets yet
          setRecentActivity(0);
          setSymptomsThisWeek(0);
          setLoading(false);
          return;
        }
        
        const petIds = petsData.map(pet => pet.id);
        
        // Query 1: Count recent activity (all entries in the last 7 days)
        // First count symptom entries
        const { count: symptomCount, error: symptomError } = await supabase
          .from('symptom_entries')
          .select('id', { count: 'exact', head: false })
          .in('pet_id', petIds)
          .gte('date', sevenDaysAgoStr);
          
        if (symptomError) throw symptomError;
        
        // Then count food entries
        const { count: foodCount, error: foodError } = await supabase
          .from('food_entries')
          .select('id', { count: 'exact', head: false })
          .in('pet_id', petIds)
          .gte('date', sevenDaysAgoStr);
          
        if (foodError) throw foodError;
        
        // Query 2: Count symptoms this week
        const { data: symptomData, error: symptomDetailError } = await supabase
          .from('symptom_entries')
          .select(`
            id,
            symptom_details:symptom_details (id)
          `)
          .in('pet_id', petIds)
          .gte('date', sevenDaysAgoStr);
          
        if (symptomDetailError) throw symptomDetailError;
        
        // Count unique symptoms (each symptom detail is a symptom occurrence)
        let symptomDetailsCount = 0;
        if (symptomData) {
          symptomDetailsCount = symptomData.reduce((count, entry) => {
            return count + (entry.symptom_details ? entry.symptom_details.length : 0);
          }, 0);
        }
        
        // Set the states with the fetched data
        setRecentActivity((symptomCount || 0) + (foodCount || 0));
        setSymptomsThisWeek(symptomDetailsCount);
        
      } catch (error: any) {
        console.error("Error fetching dashboard stats:", error);
        setError(error.message || "Failed to load dashboard statistics");
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
        // Set default values in case of error
        setRecentActivity(0);
        setSymptomsThisWeek(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, toast]);

  return {
    recentActivity,
    symptomsThisWeek,
    loading,
    error
  };
}
