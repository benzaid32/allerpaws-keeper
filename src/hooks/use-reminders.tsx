
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Pet {
  id: string;
  name: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  time: string;
  days: string[];
  pet_id: string | null;
  pet_name?: string;
  active: boolean;
}

interface ReminderFormData {
  id: string;
  title: string;
  description: string;
  time: string;
  days: string[];
  petId: string;
  active: boolean;
}

export const useReminders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ReminderFormData>({
    id: "",
    title: "",
    description: "",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    petId: "",
    active: true,
  });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");
        
      if (petsError) throw petsError;
      
      setPets(petsData || []);
      
      // Fetch reminders with pet names
      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select(`
          id,
          title,
          description,
          time,
          days,
          pet_id,
          active,
          pets:pet_id (name)
        `)
        .eq("user_id", user.id)
        .order("time");
        
      if (remindersError) throw remindersError;
      
      const formattedReminders = remindersData.map(reminder => ({
        ...reminder,
        pet_name: reminder.pets?.name,
      }));
      
      setReminders(formattedReminders);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const openNewReminder = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      time: "08:00",
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      petId: "",
      active: true,
    });
    setIsEditing(false);
    setOpen(true);
  };

  const openEditReminder = (reminder: Reminder) => {
    setFormData({
      id: reminder.id,
      title: reminder.title,
      description: reminder.description || "",
      time: reminder.time,
      days: reminder.days,
      petId: reminder.pet_id || "",
      active: reminder.active,
    });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        pet_id: formData.petId || null,
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
    reminders,
    pets,
    loading,
    open,
    setOpen,
    formData,
    setFormData,
    isEditing,
    submitting,
    openNewReminder,
    openEditReminder,
    handleSubmit,
    handleToggleActive,
    handleDelete,
  };
};
