
import React from "react";
import { Reminder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, Clock, Calendar } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onToggleActive: (reminder: Reminder) => Promise<void>;
  onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day";
    
    const dayMap: Record<string, string> = {
      mon: "Mon", 
      tue: "Tue", 
      wed: "Wed", 
      thu: "Thu", 
      fri: "Fri", 
      sat: "Sat", 
      sun: "Sun"
    };
    
    return days.map(day => dayMap[day]).join(", ");
  };

  return (
    <Card className={`${!reminder.active ? "opacity-70" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="line-clamp-1 mr-2">{reminder.title}</span>
          <Switch 
            checked={reminder.active}
            onCheckedChange={() => onToggleActive(reminder)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        {reminder.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {reminder.description}
          </p>
        )}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{reminder.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDays(reminder.days)}</span>
          </div>
          {reminder.petName && (
            <div className="text-sm font-medium mt-2 bg-primary/10 text-primary px-2 py-1 rounded-md inline-block w-fit">
              For {reminder.petName}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(reminder)}>
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
              <Trash className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete reminder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone and the reminder will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(reminder.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ReminderCard;
