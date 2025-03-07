
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SymptomEntry } from "@/lib/types";

export const useSymptomDiary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch symptom entries with pet names and symptom details
      const { data: entriesData, error: entriesError } = await supabase
        .from("symptom_entries")
        .select(`
          id,
          pet_id,
          date,
          notes,
          pets:pet_id (name),
          symptom_details:symptom_details (
            id,
            symptom_id,
            severity,
            notes,
            symptoms:symptom_id (name)
          )
        `)
        .eq("pets.user_id", user.id)
        .order("date", { ascending: false });
        
      if (entriesError) throw entriesError;
      
      // Transform the data to match our SymptomEntry type
      const formattedEntries: SymptomEntry[] = entriesData.map(entry => ({
        id: entry.id,
        petId: entry.pet_id,
        petName: entry.pets?.name || "Unknown Pet",
        date: new Date(entry.date).toISOString().split('T')[0],
        time: new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        symptoms: entry.symptom_details?.map(detail => ({
          symptomId: detail.symptom_id,
          name: detail.symptoms?.name,
          severity: detail.severity as "mild" | "moderate" | "severe",
          notes: detail.notes
        })) || [],
        notes: entry.notes
      }));
      
      setEntries(formattedEntries);
    } catch (error: any) {
      console.error("Error fetching symptom entries:", error.message);
      toast({
        title: "Error",
        description: "Failed to load symptom diary entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  return {
    entries,
    loading,
    fetchEntries
  };
};
