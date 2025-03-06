
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import ReminderFormDialog from "@/components/reminders/ReminderFormDialog";
import ReminderCard from "@/components/reminders/ReminderCard";
import EmptyReminders from "@/components/reminders/EmptyReminders";
import { useReminders } from "@/hooks/use-reminders";

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
        <EmptyReminders onCreateReminderClick={openNewReminder} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={openEditReminder}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
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
