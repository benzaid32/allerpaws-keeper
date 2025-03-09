
import React from "react";
import { Reminder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash, Clock, Calendar, AlertTriangle, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onToggleActive: (reminder: Reminder) => Promise<void>;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onToggleActive,
  onDelete,
  isDeleting = false,
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
  
  // Format time to be more readable (e.g., "08:00" -> "8:00 AM")
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className={`hover:shadow-md transition-all ${!reminder.active ? "bg-muted/30" : "bg-card"}`}>
      <CardContent className="pt-6 pb-3">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg leading-tight line-clamp-1 mr-3 flex-grow">
            {reminder.title}
          </h3>
          <Switch 
            checked={reminder.active}
            onCheckedChange={() => onToggleActive(reminder)}
            className="touch-manipulation"
          />
        </div>

        {reminder.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {reminder.description}
          </p>
        )}
        
        <div className="flex flex-col space-y-3 mb-2">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{formatTime(reminder.time)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{formatDays(reminder.days)}</span>
          </div>
        </div>
        
        {reminder.petName && (
          <Badge variant="outline" className="mt-2 bg-primary/10 hover:bg-primary/15 text-primary border-primary/20 flex w-fit">
            For {reminder.petName}
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4 border-t border-border/40">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(reminder)}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Trash className="h-3.5 w-3.5 mr-1.5" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                Delete reminder
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                "{reminder.title}" reminder.
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
