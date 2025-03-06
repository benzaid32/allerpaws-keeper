
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReminderFormData } from "@/hooks/reminders/use-reminder-form";

interface Pet {
  id: string;
  name: string;
}

interface ReminderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: ReminderFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReminderFormData>>;
  pets: Pet[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting: boolean;
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

const ReminderFormDialog: React.FC<ReminderFormDialogProps> = ({
  open,
  onOpenChange,
  isEditing,
  formData,
  setFormData,
  pets,
  onSubmit,
  submitting,
}) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Reminder" : "Create Reminder"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your reminder settings below." 
              : "Set up a new reminder for your pet care routine."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
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
  );
};

export default ReminderFormDialog;
