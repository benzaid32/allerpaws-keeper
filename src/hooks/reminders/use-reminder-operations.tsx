import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Reminder } from "@/lib/types";

export const useReminderOperations = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*");

      if (error) throw error;

      return data as Reminder[];
    } catch (error: any) {
      console.error("Error fetching reminders:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch reminders.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async (reminder: Reminder) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reminders")
        .insert(reminder)
        .select("*");

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder added successfully.",
      });

      return data;
    } catch (error: any) {
      console.error("Error adding reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to add reminder.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReminder = async (reminderId: string, updates: Partial<Reminder>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("reminders")
        .update(updates)
        .eq("id", reminderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to update reminder.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete reminder.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    loading,
  };
};
