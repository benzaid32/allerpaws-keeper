
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Reminder } from "@/lib/types";
import { ReminderFormData } from "./use-reminder-form";
import { useNotifications } from "@/hooks/use-notifications";

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
  const { permissionState, scheduleNotification } = useNotifications();

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

        // Schedule next notification if permissions are granted
        if (permissionState === "granted" && formData.active) {
          scheduleNextNotification(formData);
        }
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

      // Schedule next notification if activating and permissions are granted
      if (!reminder.active && permissionState === "granted") {
        scheduleNextNotification({
          id: reminder.id,
          title: reminder.title,
          description: reminder.description || "",
          time: reminder.time,
          days: reminder.days,
          petId: reminder.petId || "none",
          active: true
        });
      }
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

  // Helper function to schedule the next notification for a reminder
  const scheduleNextNotification = (reminder: ReminderFormData) => {
    if (!reminder.active || permissionState !== "granted") return;
    
    try {
      const now = new Date();
      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      // Get day of week as number (0 = Sunday, 1 = Monday, etc.)
      const today = now.getDay();
      const daysMap: Record<string, number> = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
      };
      
      // Convert reminder days to day numbers
      const reminderDays = reminder.days.map(day => daysMap[day]);
      
      // Set target time for today
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);
      
      // If target time is in the past, we need to find the next occurrence
      if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1); // Move to tomorrow at least
      }
      
      // Find the next day that matches one of the reminder days
      let daysToAdd = 0;
      while (!reminderDays.includes((today + daysToAdd) % 7) && daysToAdd < 7) {
        daysToAdd++;
      }
      
      if (daysToAdd > 0) {
        targetTime.setDate(targetTime.getDate() + daysToAdd);
      }
      
      // Calculate delay in milliseconds
      const delay = targetTime.getTime() - now.getTime();
      
      // Only schedule if it's within the next 24 hours (for demo purposes)
      if (delay <= 24 * 60 * 60 * 1000) {
        const petText = reminder.petId !== "none" ? ` for ${reminder.petName || "your pet"}` : "";
        scheduleNotification(
          reminder.title,
          `${reminder.description || "Time for your scheduled reminder"}${petText}`,
          delay
        );
        
        console.log(`Notification scheduled for ${targetTime.toLocaleString()} (in ${Math.round(delay/1000/60)} minutes)`);
      }
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  return {
    handleSubmit,
    handleToggleActive,
    handleDelete
  };
};
