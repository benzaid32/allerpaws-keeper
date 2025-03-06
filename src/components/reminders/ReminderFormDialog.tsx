
import React, { useEffect } from "react";
import { useReminderForm } from "@/hooks/reminders/use-reminder-form";
import { useReminderOperations } from "@/hooks/reminders/use-reminder-operations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Reminder } from "@/lib/types";

export interface ReminderFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reminderToEdit: Reminder | null;
}

const DAYS_OF_WEEK = [
  { value: "mon", label: "M" },
  { value: "tue", label: "T" },
  { value: "wed", label: "W" },
  { value: "thu", label: "T" },
  { value: "fri", label: "F" },
  { value: "sat", label: "S" },
  { value: "sun", label: "S" }
];

const ReminderFormDialog: React.FC<ReminderFormDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  reminderToEdit 
}) => {
  // Create hooks with required parameters
  const hookParams = {
    fetchData: async () => {},
    setReminders: () => {},
    setOpen: onOpenChange,
    setSubmitting: () => {}
  };
  
  const { formData, setFormData, isEditing, submitting, setIsEditing } = useReminderForm();
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
    await handleSubmit(e, formData, isEditing);
    onOpenChange(false);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[70vh]">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Medication reminder"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Give 1 pill with food"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleFieldChange("time", e.target.value)}
                required
                className="touch-manipulation"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Days</Label>
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
                    aria-label={day.value}
                    className="touch-manipulation min-w-8 h-8"
                  >
                    {day.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleFieldChange("active", checked)}
                className="touch-manipulation"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 flex-wrap sm:flex-nowrap">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderFormDialog;
