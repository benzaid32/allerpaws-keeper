
import { useRemindersData } from "./reminders/use-reminders-data";
import { useReminderForm } from "./reminders/use-reminder-form";
import { useReminderOperations } from "./reminders/use-reminder-operations";

export const useReminders = () => {
  const { reminders, pets, loading, fetchData, setReminders } = useRemindersData();
  
  const {
    formData,
    setFormData,
    open,
    setOpen,
    isEditing,
    submitting,
    setSubmitting,
    openNewReminder,
    openEditReminder,
  } = useReminderForm();
  
  const { handleSubmit, handleToggleActive, handleDelete } = useReminderOperations({
    fetchData,
    setReminders,
    setOpen,
    setSubmitting
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e, formData, isEditing);
  };

  return {
    // Data
    reminders,
    pets,
    loading,
    
    // Form state
    open,
    setOpen,
    formData,
    setFormData,
    isEditing,
    submitting,
    
    // Actions
    openNewReminder,
    openEditReminder,
    handleSubmit: handleFormSubmit,
    handleToggleActive,
    handleDelete,
  };
};
