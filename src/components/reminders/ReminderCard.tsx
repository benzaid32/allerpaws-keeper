
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, Edit, Trash2 } from "lucide-react";
import { Reminder } from "@/lib/types";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onToggleActive: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onToggleActive,
  onDelete,
}) => {
  // Format time to 12-hour format
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (e) {
      return time;
    }
  };

  return (
    <Card className={reminder.active ? "border-primary/20" : "opacity-70"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{reminder.title}</CardTitle>
            {reminder.petName && (
              <p className="text-sm text-muted-foreground">for {reminder.petName}</p>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Switch
              checked={reminder.active}
              onCheckedChange={() => onToggleActive(reminder)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{formatTime(reminder.time)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <span>
              {reminder.days.length === 7
                ? "Every day"
                : reminder.days.length > 3
                ? `${reminder.days.length} days`
                : reminder.days.map(d => d.substring(0, 1).toUpperCase()).join(", ")}
            </span>
          </div>
        </div>
        {reminder.description && (
          <p className="text-sm text-muted-foreground mt-2">{reminder.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(reminder.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(reminder)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReminderCard;
