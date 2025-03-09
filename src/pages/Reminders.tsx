
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
import { ArrowLeft, Plus, Bell, Clock, CalendarClock, Loader2 } from "lucide-react";
import { Reminder } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Reminders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reminders, loading, fetchData, setReminders, isOffline } = useRemindersData();
  const { handleDelete, handleToggleActive } = useReminderOperations({
    fetchData,
    setReminders,
    setOpen: () => {},
    setSubmitting: () => {}
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Handle opening form for editing
  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };
  
  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };
  
  // Handle deletion with confirmation
  const handleDeleteReminder = async (reminder: Reminder) => {
    try {
      setDeletingId(reminder.id);
      await handleDelete(reminder);
      toast({
        title: "Reminder deleted",
        description: "Your reminder has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete the reminder",
        variant: "destructive",
      });
      console.error("Error deleting reminder:", error);
    } finally {
      setDeletingId(null);
    }
  };
  
  // Handle toggle with feedback
  const handleToggle = async (reminder: Reminder) => {
    try {
      await handleToggleActive(reminder);
      toast({
        title: reminder.active ? "Reminder deactivated" : "Reminder activated",
        description: reminder.active 
          ? "Notifications are now paused for this reminder" 
          : "You'll now receive notifications for this reminder",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update the reminder status",
        variant: "destructive",
      });
      console.error("Error toggling reminder:", error);
    }
  };
  
  // Filter reminders by active status
  const activeReminders = reminders?.filter(reminder => reminder.active) || [];
  const inactiveReminders = reminders?.filter(reminder => !reminder.active) || [];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0"></div>
      
      <div className="container relative pb-20 pt-4 px-4 md:px-6 z-10">
        <header className="flex flex-col space-y-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 sm:mr-3" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold">Reminders</h1>
            </div>
            <Button 
              onClick={() => setIsFormOpen(true)} 
              className="gap-1 shadow-sm"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Reminder</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
          
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground max-w-xl"
          >
            <p>Set reminders for pet care tasks like medications, vet appointments, and feedings</p>
          </motion.div>
        </header>

        {isOffline && (
          <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300 rounded-lg px-4 py-3 flex items-center text-sm">
            <div className="flex-shrink-0 mr-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
            <p>You're currently offline. Changes will sync when you reconnect.</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your reminders...</p>
          </div>
        ) : reminders && reminders.length > 0 ? (
          <Tabs defaultValue="active" className="mb-6 w-full">
            <TabsList className="grid grid-cols-2 bg-muted/50 w-full mb-4">
              <TabsTrigger value="active" className="flex gap-2">
                <Bell className="h-4 w-4" />
                <span>Active</span>
                <span className="ml-1 bg-primary/15 px-1.5 py-0.5 rounded-full text-xs font-medium text-primary">
                  {activeReminders.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex gap-2">
                <Clock className="h-4 w-4" />
                <span>Inactive</span>
                <span className="ml-1 bg-muted-foreground/20 px-1.5 py-0.5 rounded-full text-xs font-medium">
                  {inactiveReminders.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="pt-1">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                        onDelete={() => handleDeleteReminder(reminder)}
                        onToggleActive={() => handleToggle(reminder)}
                        isDeleting={deletingId === reminder.id}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg col-span-full">
                    <CalendarClock className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No active reminders</p>
                    <Button onClick={() => setIsFormOpen(true)}>
                      Create Reminder
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="inactive" className="pt-1">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                        onDelete={() => handleDeleteReminder(reminder)}
                        onToggleActive={() => handleToggle(reminder)}
                        isDeleting={deletingId === reminder.id}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg col-span-full">
                    <p className="text-muted-foreground">No inactive reminders</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyReminders onCreateReminderClick={() => setIsFormOpen(true)} />
        )}
      </div>
      
      <ReminderFormDialog
        isOpen={isFormOpen}
        onOpenChange={handleFormClose}
        reminderToEdit={editingReminder}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Reminders;
