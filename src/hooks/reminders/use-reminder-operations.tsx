
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Reminder } from "@/lib/types";
import { ReminderFormData } from "./use-reminder-form";

interface UseReminderOperationsProps {
  fetchData: () => Promise<void>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setOpen: (open: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
}

export const useReminderOperations = ({
  fetchData,
  setReminders,
  setOpen,
  setSubmitting
}: UseReminderOperationsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, formData: ReminderFormData, isEditing: boolean) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to manage reminders",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the reminder",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.days.length === 0) {
      toast({
        title: "Days required",
        description: "Please select at least one day for the reminder",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const reminderData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        time: formData.time,
        days: formData.days,
        pet_id: formData.petId === "none" ? null : formData.petId || null,
        active: formData.active,
      };
      
      if (isEditing) {
        // Update existing reminder
        const { error } = await supabase
          .from("reminders")
          .update(reminderData)
          .eq("id", formData.id);
          
        if (error) throw error;
        
        toast({
          title: "Reminder updated",
          description: "Your reminder has been updated",
        });
      } else {
        // Create new reminder
        const { error } = await supabase
          .from("reminders")
          .insert(reminderData);
          
        if (error) throw error;
        
        toast({
          title: "Reminder created",
          description: "Your new reminder has been set",
        });
      }
      
      // Refresh reminders list
      await fetchData();
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to save reminder",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (reminder: Reminder) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .update({ active: !reminder.active })
        .eq("id", reminder.id);
        
      if (error) throw error;
      
      // Update local state
      setReminders(prev => 
        prev.map(r => r.id === reminder.id ? { ...r, active: !r.active } : r)
      );
      
      toast({
        title: reminder.active ? "Reminder paused" : "Reminder activated",
        description: `${reminder.title} has been ${reminder.active ? "paused" : "activated"}`,
      });
    } catch (error: any) {
      console.error("Error toggling reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setReminders(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been removed",
      });
    } catch (error: any) {
      console.error("Error deleting reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  return {
    handleSubmit,
    handleToggleActive,
    handleDelete
  };
};
