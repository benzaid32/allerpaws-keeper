
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Reminder } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

// Define props for hook to match expected usage in components
interface UseReminderOperationsProps {
  fetchData: () => Promise<void>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useReminderOperations = (props?: UseReminderOperationsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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
      // Make sure the reminder has the user_id from the authenticated user
      const reminderWithUserId = {
        ...reminder,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from("reminders")
        .insert(reminderWithUserId)
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

  // Add the handler methods expected by components
  const handleSubmit = async (e: React.FormEvent, formData: any, isEditing: boolean) => {
    e.preventDefault();
    
    if (!props) return;
    
    props.setSubmitting(true);
    
    try {
      // If we're editing an existing reminder
      if (isEditing && formData.id) {
        await updateReminder(formData.id, formData);
      } else {
        // Creating a new reminder
        await addReminder(formData as Reminder);
      }
      
      // Refresh the reminders list
      await props.fetchData();
      
      // Close the form
      props.setOpen(false);
    } catch (error) {
      console.error("Error submitting reminder:", error);
    } finally {
      props.setSubmitting(false);
    }
  };
  
  const handleToggleActive = async (reminder: Reminder) => {
    if (!props) return;
    
    try {
      // Toggle the active state
      await updateReminder(reminder.id, { 
        active: !reminder.active 
      });
      
      // Update the reminders list with the toggled value
      props.setReminders(prev => 
        prev.map(r => r.id === reminder.id ? { ...r, active: !r.active } : r)
      );
    } catch (error) {
      console.error("Error toggling reminder:", error);
    }
  };
  
  const handleDelete = async (reminder: Reminder) => {
    if (!props) return;
    
    try {
      await deleteReminder(reminder.id);
      
      // Remove the deleted reminder from the list
      props.setReminders(prev => prev.filter(r => r.id !== reminder.id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  return {
    fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    loading,
    // Add the handler methods to the return object
    handleSubmit,
    handleToggleActive,
    handleDelete
  };
};
