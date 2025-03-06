
import { useState } from "react";
import { Reminder } from "@/lib/types";

export interface ReminderFormData {
  id: string;
  title: string;
  description: string;
  time: string;
  days: string[];
  petId: string;
  active: boolean;
}

export const useReminderForm = () => {
  const [formData, setFormData] = useState<ReminderFormData>({
    id: "",
    title: "",
    description: "",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    petId: "",
    active: true,
  });
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openNewReminder = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      time: "08:00",
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      petId: "",
      active: true,
    });
    setIsEditing(false);
    setOpen(true);
  };

  const openEditReminder = (reminder: Reminder) => {
    setFormData({
      id: reminder.id,
      title: reminder.title,
      description: reminder.description || "",
      time: reminder.time,
      days: reminder.days,
      petId: reminder.pet_id || "",
      active: reminder.active,
    });
    setIsEditing(true);
    setOpen(true);
  };

  return {
    formData,
    setFormData,
    open,
    setOpen,
    isEditing,
    setIsEditing,
    submitting,
    setSubmitting,
    openNewReminder,
    openEditReminder,
  };
};
