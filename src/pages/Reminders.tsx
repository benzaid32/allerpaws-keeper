import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Bell, BellOff } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ReminderFormDialog from "@/components/reminders/ReminderFormDialog";
import ReminderCard from "@/components/reminders/ReminderCard";
import EmptyReminders from "@/components/reminders/EmptyReminders";
import { useReminders } from "@/hooks/use-reminders";
import { useNotifications } from "@/hooks/use-notifications";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Reminders = () => {
  const {
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
  } = useReminders();
  
  const {
    isNotificationsSupported,
    permissionState,
    requestPermission,
    sendTestNotification
  } = useNotifications();

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

      {isNotificationsSupported && permissionState !== "granted" && (
        <Alert className="mb-6">
          <Bell className="h-4 w-4" />
          <AlertTitle>Enable notifications</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>Get notified when it's time for your reminders</span>
            <Button variant="outline" size="sm" onClick={requestPermission}>
              Enable
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isNotificationsSupported && permissionState === "granted" && (
        <div className="flex justify-between items-center mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary mr-2" />
            <span>Notifications are enabled</span>
          </div>
          <Button variant="outline" size="sm" onClick={sendTestNotification}>
            Test Notification
          </Button>
        </div>
      )}

      {!isNotificationsSupported && (
        <Alert variant="destructive" className="mb-6">
          <BellOff className="h-4 w-4" />
          <AlertTitle>Notifications not supported</AlertTitle>
          <AlertDescription>
            Your browser doesn't support notifications. Consider using a modern browser to receive reminder notifications.
          </AlertDescription>
        </Alert>
      )}

      {reminders.length === 0 ? (
        <EmptyReminders onCreateReminderClick={openNewReminder} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={openEditReminder}
              onToggleActive={handleToggleActive}
              onDelete={(id) => handleDelete(reminders.find(r => r.id === id)!)}
            />
          ))}
        </div>
      )}

      <ReminderFormDialog
        open={open}
        onOpenChange={setOpen}
        isEditing={isEditing}
        formData={formData}
        setFormData={setFormData}
        pets={pets}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <BottomNavigation />
    </div>
  );
};

export default Reminders;
