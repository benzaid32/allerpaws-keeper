
import React, { useEffect } from "react";
import { useReminderForm } from "@/hooks/reminders/use-reminder-form";
import { useReminderOperations } from "@/hooks/reminders/use-reminder-operations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reminder } from "@/lib/types";
import { Calendar, Clock, AlarmClock, Plus, Check, XIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ReminderFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reminderToEdit: Reminder | null;
}

const DAYS_OF_WEEK = [
  { value: "mon", label: "M", fullName: "Monday" },
  { value: "tue", label: "T", fullName: "Tuesday" },
  { value: "wed", label: "W", fullName: "Wednesday" },
  { value: "thu", label: "T", fullName: "Thursday" },
  { value: "fri", label: "F", fullName: "Friday" },
  { value: "sat", label: "S", fullName: "Saturday" },
  { value: "sun", label: "S", fullName: "Sunday" }
];

const ReminderFormDialog: React.FC<ReminderFormDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  reminderToEdit 
}) => {
  const { toast } = useToast();
  
  // Create hooks with required parameters
  const hookParams = {
    fetchData: async () => {},
    setReminders: () => {},
    setOpen: onOpenChange,
    setSubmitting: () => {}
  };
  
  const { formData, setFormData, isEditing, submitting, setSubmitting, setIsEditing } = useReminderForm();
  const { handleSubmit } = useReminderOperations(hookParams);

  useEffect(() => {
    if (reminderToEdit) {
      setFormData({
        id: reminderToEdit.id,
        title: reminderToEdit.title,
        description: reminderToEdit.description || "",
        time: reminderToEdit.time,
        days: reminderToEdit.days,
        petId: reminderToEdit.petId || "none",
        petName: reminderToEdit.petName,
        active: reminderToEdit.active
      });
      setIsEditing(true);
    } else {
      setIsEditing(false);
      // Initialize with default values
      setFormData({
        id: "",
        title: "",
        description: "",
        time: "08:00",
        days: ["mon", "tue", "wed", "thu", "fri"],
        petId: "none",
        petName: undefined,
        active: true
      });
    }
  }, [reminderToEdit, setFormData, setIsEditing]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await handleSubmit(e, formData, isEditing);
      toast({
        title: isEditing ? "Reminder updated" : "Reminder created",
        description: isEditing 
          ? `Your "${formData.title}" reminder has been updated`
          : `New reminder "${formData.title}" has been created`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting reminder:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to save your reminder. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const selectAllDays = () => {
    handleFieldChange("days", DAYS_OF_WEEK.map(day => day.value));
  };
  
  const selectWeekdaysOnly = () => {
    handleFieldChange("days", ["mon", "tue", "wed", "thu", "fri"]);
  };
  
  const selectWeekendsOnly = () => {
    handleFieldChange("days", ["sat", "sun"]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Clock className="h-5 w-5 text-primary" />
                Edit Reminder
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Create Reminder
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of your existing reminder" 
              : "Set up a new reminder for your pet care routine"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[70vh]">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="flex items-center">
                Title <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Medication reminder"
                required
                className="focus-visible:ring-primary"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Give 1 pill with food"
                className="resize-none focus-visible:ring-primary"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time" className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                Time <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleFieldChange("time", e.target.value)}
                required
                className="touch-manipulation focus-visible:ring-primary"
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  Days <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="flex gap-1.5 text-xs">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs px-1.5"
                    onClick={selectAllDays}
                  >
                    All
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs px-1.5"
                    onClick={selectWeekdaysOnly}
                  >
                    Weekdays
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-xs px-1.5"
                    onClick={selectWeekendsOnly}
                  >
                    Weekends
                  </Button>
                </div>
              </div>
              <ToggleGroup 
                type="multiple" 
                variant="outline" 
                value={formData.days}
                onValueChange={(value) => {
                  if (value.length > 0) {
                    handleFieldChange("days", value)
                  }
                }}
                className="justify-between"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <ToggleGroupItem 
                    key={day.value} 
                    value={day.value} 
                    aria-label={day.fullName}
                    className="touch-manipulation rounded-md min-w-8 h-8 data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
                    title={day.fullName}
                  >
                    {day.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            <div className="flex items-center justify-between mt-2 bg-muted/40 p-3 rounded-lg">
              <div className="flex flex-col">
                <Label htmlFor="active" className="mb-1">Active status</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.active ? "Notifications enabled" : "Notifications paused"}
                </span>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleFieldChange("active", checked)}
                className="touch-manipulation data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 sm:flex-none gap-2"
              disabled={submitting}
            >
              <XIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              className="flex-1 sm:flex-none gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {isEditing ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderFormDialog;
