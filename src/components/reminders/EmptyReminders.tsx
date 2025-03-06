
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export interface EmptyRemindersProps {
  onCreateReminderClick: () => void;
}

const EmptyReminders: React.FC<EmptyRemindersProps> = ({ onCreateReminderClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-center"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Bell className="h-8 w-8 text-primary" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">No Reminders Yet</h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        Stay on top of your pet's care routine by creating reminders for feedings, medications, 
        supplements, and vet visits.
      </p>
      
      <Button onClick={onCreateReminderClick} className="gap-2">
        <Bell className="h-4 w-4" />
        Create Your First Reminder
      </Button>
    </motion.div>
  );
};

export default EmptyReminders;
