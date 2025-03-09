
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export interface EmptyRemindersProps {
  onCreateReminderClick: () => void;
}

const EmptyReminders: React.FC<EmptyRemindersProps> = ({ onCreateReminderClick }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg text-center max-w-xl mx-auto border border-border/30"
    >
      <motion.div 
        variants={item}
        className="relative mb-10 mt-4"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute -top-4 -right-4 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
        >
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute -bottom-4 -left-4 w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center"
        >
          <Calendar className="h-5 w-5 text-violet-600 dark:text-violet-300" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        variants={item}
        className="text-xl font-medium mb-2"
      >
        No Reminders Yet
      </motion.h3>
      
      <motion.p 
        variants={item}
        className="text-muted-foreground mb-6 max-w-md"
      >
        Never miss an important pet care task again. Set up reminders for medications, 
        vet visits, feedings, and more.
      </motion.p>
      
      <motion.div variants={item}>
        <Button onClick={onCreateReminderClick} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Reminder
        </Button>
      </motion.div>
      
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-sm"
      >
        <div className="bg-background p-4 rounded-lg border border-border/30 shadow-sm">
          <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <Bell className="h-4 w-4 text-red-500" />
          </div>
          <h4 className="font-medium mb-1">Medication Alerts</h4>
          <p className="text-muted-foreground text-xs">Never miss giving medication on time</p>
        </div>
        
        <div className="bg-background p-4 rounded-lg border border-border/30 shadow-sm">
          <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <Calendar className="h-4 w-4 text-amber-500" />
          </div>
          <h4 className="font-medium mb-1">Vet Appointments</h4>
          <p className="text-muted-foreground text-xs">Stay on top of important check-ups</p>
        </div>
        
        <div className="bg-background p-4 rounded-lg border border-border/30 shadow-sm">
          <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2 mx-auto">
            <Clock className="h-4 w-4 text-green-500" />
          </div>
          <h4 className="font-medium mb-1">Feeding Schedule</h4>
          <p className="text-muted-foreground text-xs">Maintain consistent feeding times</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmptyReminders;
