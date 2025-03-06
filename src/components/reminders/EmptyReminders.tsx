
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Plus } from "lucide-react";

interface EmptyRemindersProps {
  onCreateReminderClick: () => void;
}

const EmptyReminders: React.FC<EmptyRemindersProps> = ({ onCreateReminderClick }) => {
  return (
    <Card className="text-center p-6">
      <div className="flex flex-col items-center justify-center py-10">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">No Reminders Set</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Set up reminders for feeding times, medication, vet appointments, or other important pet care tasks.
        </p>
        <Button onClick={onCreateReminderClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Reminder
        </Button>
      </div>
    </Card>
  );
};

export default EmptyReminders;
