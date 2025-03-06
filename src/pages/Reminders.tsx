
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Calendar, Clock, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const daysOfWeek = [
  { value: "mon", label: "M" },
  { value: "tue", label: "T" },
  { value: "wed", label: "W" },
  { value: "thu", label: "T" },
  { value: "fri", label: "F" },
  { value: "sat", label: "S" },
  { value: "sun", label: "S" },
];

const Reminders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    petId: "",
    active: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
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
    
    fetchData();
  }, [user, toast]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const handleDaysChange = (values: string[]) => {
    setFormData(prev => ({ ...prev, days: values }));
  };

  const handlePetChange = (value: string) => {
    setFormData(prev => ({ ...prev, petId: value }));
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
      const { data: updatedReminders, error: fetchError } = await supabase
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
        
      if (fetchError) throw fetchError;
      
      const formattedReminders = updatedReminders.map(reminder => ({
        ...reminder,
        pet_name: reminder.pets?.name,
      }));
      
      setReminders(formattedReminders);
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

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  if (loading) {
    return (
      <div className="container pt-6 pb-20">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="container pt-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <Button onClick={openNewReminder}>
          <Plus className="h-4 w-4 mr-2" />
          New Reminder
        </Button>
      </div>

      {reminders.length === 0 ? (
        <Card className="text-center p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Reminders Set</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Set up reminders for feeding times, medication, vet appointments, or other important pet care tasks.
            </p>
            <Button onClick={openNewReminder}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Reminder
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={reminder.active ? "border-primary/20" : "opacity-70"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle>{reminder.title}</CardTitle>
                    {reminder.pet_name && (
                      <p className="text-sm text-muted-foreground">for {reminder.pet_name}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Switch
                      checked={reminder.active}
                      onCheckedChange={() => handleToggleActive(reminder)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 mb-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{formatTime(reminder.time)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>
                      {reminder.days.length === 7
                        ? "Every day"
                        : reminder.days.length > 3
                        ? `${reminder.days.length} days`
                        : reminder.days.map(d => d.substring(0, 1).toUpperCase()).join(", ")}
                    </span>
                  </div>
                </div>
                {reminder.description && (
                  <p className="text-sm text-muted-foreground mt-2">{reminder.description}</p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(reminder.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditReminder(reminder)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update your reminder settings below." 
                : "Set up a new reminder for your pet care routine."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Feed Fido, Give medication, etc."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pet">Pet (Optional)</Label>
                  <Select
                    value={formData.petId}
                    onValueChange={handlePetChange}
                  >
                    <SelectTrigger id="pet">
                      <SelectValue placeholder="Select pet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All pets</SelectItem>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="days">Repeat on days</Label>
                <ToggleGroup
                  type="multiple"
                  value={formData.days}
                  onValueChange={handleDaysChange}
                  className="justify-between"
                >
                  {daysOfWeek.map((day) => (
                    <ToggleGroupItem
                      key={day.value}
                      value={day.value}
                      className="w-8 h-8 p-0"
                    >
                      {day.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Any additional notes or instructions"
                  className="min-h-24"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="active" 
                  checked={formData.active}
                  onCheckedChange={handleActiveChange}
                />
                <Label htmlFor="active" className="cursor-pointer">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Reminder" : "Create Reminder"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Reminders;
