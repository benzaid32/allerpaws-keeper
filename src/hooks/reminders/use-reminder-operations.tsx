import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "@/lib/types";
import { ReminderFormData } from "@/hooks/reminders/use-reminder-form";
import { useNotifications } from "@/hooks/use-notifications";
import { v4 as uuidv4 } from "uuid";

interface UseReminderOperationsProps {
  fetchData: () => Promise<void>;
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useReminderOperations = ({
  fetchData,
  setReminders,
  setOpen,
  setSubmitting,
}: UseReminderOperationsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    permissionState, 
    requestPermission, 
    scheduleNotification 
  } = useNotifications();
  
  // Helper functions
  const parseTime = (timeString: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
  };
  
  const calculateNextOccurrence = (
    time: string, 
    days: string[]
  ): Date | null => {
    if (!days.length) return null;
    
    const daysMap: { [key: string]: number } = {
      sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
    };
    
    const { hours, minutes } = parseTime(time);
    const now = new Date();
    const todayDay = now.getDay();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    
    // Sort days by proximity to today
    const sortedDays = [...days].sort((a, b) => {
      const dayA = daysMap[a];
      const dayB = daysMap[b];
      
      const distanceA = (dayA - todayDay + 7) % 7;
      const distanceB = (dayB - todayDay + 7) % 7;
      
      return distanceA - distanceB;
    });
    
    for (const day of sortedDays) {
      const targetDay = daysMap[day];
      let daysToAdd = (targetDay - todayDay + 7) % 7;
      
      // If it's today, check if the time has already passed
      if (daysToAdd === 0) {
        const isPastOrPresent = 
          nowHours > hours || 
          (nowHours === hours && nowMinutes >= minutes);
        
        if (isPastOrPresent) {
          // If time has passed, move to the next week
          daysToAdd = 7;
        }
      }
      
      const nextDate = new Date(now);
      nextDate.setDate(now.getDate() + daysToAdd);
      nextDate.setHours(hours, minutes, 0, 0);
      
      return nextDate;
    }
    
    return null;
  };
  
  const scheduleReminderNotification = async (
    reminder: ReminderFormData
  ): Promise<boolean> => {
    if (permissionState !== "granted") {
      const granted = await requestPermission();
      if (!granted) {
        toast({
          title: "Notification permission required",
          description: "Notifications won't be sent for this reminder",
        });
        return false;
      }
    }
    
    // Calculate when to send the notification
    const nextOccurrence = calculateNextOccurrence(reminder.time, reminder.days);
    if (!nextOccurrence) return false;
    
    // Use numerical ID for notifications
    const numericId = parseInt(reminder.id.replace(/\D/g, '').slice(0, 9)) || Math.floor(Math.random() * 1000000);
    
    // Create notification content
    const title = reminder.title;
    let body = reminder.description || "Reminder from Allerpaws Keeper";
    
    // If reminder is for a specific pet, include their name
    if (reminder.petId !== "none" && reminder.petName) {
      body = `For ${reminder.petName}: ${body}`;
    }
    
    // Schedule the notification
    return scheduleNotification(
      numericId,
      title,
      body,
      nextOccurrence.getTime()
    );
  };
  
  const handleSubmit = async (
    e: React.FormEvent,
    formData: ReminderFormData,
    isEditing: boolean
  ) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setSubmitting(true);
      
      // Format data for database
      const reminderData = {
        title: formData.title,
        description: formData.description,
        time: formData.time,
        days: formData.days,
        pet_id: formData.petId === "none" ? null : formData.petId,
        active: formData.active,
        user_id: user.id
      };
      
      let reminderId = formData.id;
      
      if (isEditing) {
        // Update existing reminder
        const { error } = await supabase
          .from("reminders")
          .update(reminderData)
          .eq("id", formData.id);
          
        if (error) throw error;
        
        toast({
          title: "Reminder updated",
          description: "Your reminder has been updated successfully",
        });
      } else {
        // Create new reminder with generated ID
        reminderId = uuidv4();
        
        const { error } = await supabase
          .from("reminders")
          .insert({
            ...reminderData,
            id: reminderId
          });
          
        if (error) throw error;
        
        toast({
          title: "Reminder created",
          description: "Your new reminder has been created successfully",
        });
      }
      
      // Close the dialog and refresh data
      setOpen(false);
      await fetchData();
      
      // Only schedule notification if reminder is active
      if (formData.active) {
        const fullReminder = {
          ...formData,
          id: reminderId
        };
        
        const notificationScheduled = await scheduleReminderNotification(fullReminder);
        
        if (notificationScheduled) {
          console.log("Notification scheduled successfully");
        } else {
          console.log("Failed to schedule notification");
        }
      }
    } catch (error: any) {
      console.error("Error saving reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to save reminder. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleToggleActive = async (reminder: Reminder) => {
    if (!user) return;
    
    try {
      const newActiveState = !reminder.active;
      
      // Update in the database
      const { error } = await supabase
        .from("reminders")
        .update({ active: newActiveState })
        .eq("id", reminder.id);
        
      if (error) throw error;
      
      // Update local state for immediate UI feedback
      setReminders(prev =>
        prev.map(r =>
          r.id === reminder.id ? { ...r, active: newActiveState } : r
        )
      );
      
      // Schedule notification if activated
      if (newActiveState) {
        const reminderFormData: ReminderFormData = {
          id: reminder.id,
          title: reminder.title,
          description: reminder.description || "",
          time: reminder.time,
          days: reminder.days,
          petId: reminder.petId || "none",
          petName: reminder.petName,
          active: true
        };
        
        await scheduleReminderNotification(reminderFormData);
      }
      
      toast({
        title: newActiveState ? "Reminder activated" : "Reminder deactivated",
        description: `Your reminder has been ${newActiveState ? "activated" : "deactivated"} successfully`,
      });
    } catch (error: any) {
      console.error("Error toggling reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to update reminder. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (reminder: Reminder) => {
    if (!user) return;
    
    try {
      // Delete from database
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", reminder.id);
        
      if (error) throw error;
      
      // Update local state for immediate UI feedback
      setReminders(prev => prev.filter(r => r.id !== reminder.id));
      
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been deleted successfully",
      });
      
      // Refresh data to ensure everything is in sync
      await fetchData();
    } catch (error: any) {
      console.error("Error deleting reminder:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete reminder. Please try again.",
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
