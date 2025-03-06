
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRemindersData } from "@/hooks/reminders/use-reminders-data";
import { useReminderOperations } from "@/hooks/reminders/use-reminder-operations";
import BottomNavigation from "@/components/BottomNavigation";
import ReminderFormDialog from "@/components/reminders/ReminderFormDialog";
import ReminderCard from "@/components/reminders/ReminderCard";
import EmptyReminders from "@/components/reminders/EmptyReminders";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Clock, Bell } from "lucide-react";

const Reminders = () => {
  const navigate = useNavigate();
  const { reminders, loading, error } = useRemindersData();
  const { deleteReminder, toggleReminderActive } = useReminderOperations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  
  // Handle opening form for editing
  const handleEditReminder = (reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };
  
  // Filter reminders by active status
  const activeReminders = reminders?.filter(reminder => reminder.active) || [];
  const inactiveReminders = reminders?.filter(reminder => !reminder.active) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      
      <div className="container relative pb-20 pt-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">Reminders</h1>
          <Button onClick={() => setIsFormOpen(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            New Reminder
          </Button>
        </div>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-muted-foreground"
        >
          <p>Set reminders for feedings, medications, and vet appointments</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            Error loading reminders: {error.message}
          </div>
        ) : reminders && reminders.length > 0 ? (
          <Tabs defaultValue="active" className="mb-6">
            <TabsList className="grid grid-cols-2 bg-muted/50">
              <TabsTrigger value="active" className="flex gap-2">
                <Bell className="h-4 w-4" />
                Active ({activeReminders.length})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex gap-2">
                <Clock className="h-4 w-4" />
                Inactive ({inactiveReminders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="pt-4">
              <div className="space-y-4">
                {activeReminders.length > 0 ? (
                  activeReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ReminderCard
                        reminder={reminder}
                        onEdit={() => handleEditReminder(reminder)}
                        onDelete={() => deleteReminder(reminder.id)}
                        onToggleActive={() => toggleReminderActive(reminder.id, !reminder.active)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-4">No active reminders</p>
                    <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
                      Create Reminder
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="inactive" className="pt-4">
              <div className="space-y-4">
                {inactiveReminders.length > 0 ? (
                  inactiveReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ReminderCard
                        reminder={reminder}
                        onEdit={() => handleEditReminder(reminder)}
                        onDelete={() => deleteReminder(reminder.id)}
                        onToggleActive={() => toggleReminderActive(reminder.id, !reminder.active)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No inactive reminders</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyReminders onCreateReminder={() => setIsFormOpen(true)} />
        )}
      </div>
      
      <ReminderFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        reminderToEdit={editingReminder}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Reminders;
