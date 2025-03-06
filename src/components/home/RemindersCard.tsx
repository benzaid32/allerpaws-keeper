
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Plus } from "lucide-react";
import { HomeReminder } from "@/hooks/use-home-data";

interface RemindersCardProps {
  reminders: HomeReminder[];
}

const RemindersCard = ({ reminders }: RemindersCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-4 w-4 mr-2 text-primary" />
            Active Reminders
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/reminders")}>
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  {reminder.description && (
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  )}
                </div>
                <div className="text-primary font-medium bg-primary/10 px-2 py-1 rounded-md text-sm">
                  {reminder.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground mb-2">No active reminders</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/reminders")} className="mt-2">
              Set up reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersCard;
