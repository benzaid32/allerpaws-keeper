
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export type ReminderSetting = {
  id: string;
  name: string;
  time: string;
  active: boolean;
};

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminderSettings, setReminderSettings] = useState<ReminderSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminderSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Use a more direct query approach with explicit typing to avoid deep type instantiation
      const { data, error } = await supabase
        .from("reminders")
        .select("id, title, time, active")
        .eq("user_id", user.id)
        .eq("is_setting", true)
        .order("time");
        
      if (error) throw error;
      
      // Use type assertion to avoid circular reference issues
      const remindersData = data as Array<{
        id: string;
        title: string;
        time: string;
        active: boolean;
      }> | null;
      
      // Transform the data with simplified typing
      const settings: ReminderSetting[] = remindersData ? remindersData.map(item => ({
        id: item.id,
        name: item.title,
        time: format(new Date(`2000-01-01T${item.time}`), 'h:mm a'),
        active: item.active
      })) : [];
      
      setReminderSettings(settings);
    } catch (error: any) {
      console.error("Error fetching reminder settings:", error.message);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleReminderSetting = async (id: string, active: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("reminders")
        .update({ active })
        .eq("id", id)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Update local state
      setReminderSettings(prev => 
        prev.map(setting => 
          setting.id === id ? { ...setting, active } : setting
        )
      );
      
      toast({
        title: "Settings updated",
        description: "Reminder settings have been updated",
      });
    } catch (error: any) {
      console.error("Error updating reminder setting:", error.message);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  const exportData = async (dataType: "progress" | "food") => {
    if (!user) return;

    try {
      let data;
      
      if (dataType === "progress") {
        // Fetch symptom entries data
        const { data: entriesData, error: entriesError } = await supabase
          .from("symptom_entries")
          .select(`
            id,
            date,
            pets(id, name),
            pet_id
          `)
          .order("date", { ascending: false });
          
        if (entriesError) throw entriesError;
        
        data = entriesData;
      } else {
        // Fetch food entries data
        const { data: foodData, error: foodError } = await supabase
          .from("food_entries")
          .select(`
            id,
            date,
            pet_id,
            pets(name)
          `)
          .order("date", { ascending: false });
          
        if (foodError) throw foodError;
        
        data = foodData;
      }
      
      // Convert to JSON and create download
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `allerpaws-${dataType}-${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Export complete",
        description: `${dataType === "progress" ? "Progress report" : "Food diary"} has been exported`,
      });
    } catch (error: any) {
      console.error(`Error exporting ${dataType} data:`, error.message);
      toast({
        title: "Export failed",
        description: `Failed to export ${dataType === "progress" ? "progress report" : "food diary"}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchReminderSettings();
    }
  }, [user]);

  return {
    reminderSettings,
    loading,
    toggleReminderSetting,
    exportData,
    fetchReminderSettings
  };
};
