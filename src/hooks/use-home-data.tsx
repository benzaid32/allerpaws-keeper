
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export type HomeLog = {
  id: string;
  date: string;
  petName: string;
  symptoms: string[];
};

export type HomeReminder = {
  id: string;
  time: string;
  title: string;
  description: string | null;
};

export const useHomeData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentLogs, setRecentLogs] = useState<HomeLog[]>([]);
  const [reminders, setReminders] = useState<HomeReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch recent symptom logs with pet names
      const { data: logsData, error: logsError } = await supabase
        .from("symptom_entries")
        .select(`
          id,
          date,
          pets:pet_id (name),
          symptom_details (
            symptoms:symptom_id (name)
          )
        `)
        .eq("symptom_entries.pet_id.user_id", user.id)
        .order("date", { ascending: false })
        .limit(3);
        
      if (logsError) throw logsError;
      
      // Format logs data
      const formattedLogs: HomeLog[] = (logsData || []).map(log => {
        const symptomNames = log.symptom_details
          ? log.symptom_details
              .filter(detail => detail.symptoms)
              .map(detail => detail.symptoms.name)
          : [];
        
        return {
          id: log.id,
          date: formatDate(log.date),
          petName: log.pets?.name || "Unknown Pet",
          symptoms: symptomNames
        };
      });
      
      setRecentLogs(formattedLogs);
      
      // Fetch active reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select(`
          id,
          title,
          description,
          time
        `)
        .eq("user_id", user.id)
        .eq("active", true)
        .order("time")
        .limit(3);
        
      if (remindersError) throw remindersError;
      
      // Format reminders data
      const formattedReminders: HomeReminder[] = (remindersData || []).map(reminder => ({
        id: reminder.id,
        time: reminder.time,
        title: reminder.title,
        description: reminder.description
      }));
      
      setReminders(formattedReminders);
    } catch (error: any) {
      console.error("Error fetching home data:", error.message);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return {
    recentLogs,
    reminders,
    loading,
    fetchData
  };
};
