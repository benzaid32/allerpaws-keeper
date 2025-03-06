
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { HomeReminder } from "@/hooks/use-home-data";

interface RemindersCardProps {
  reminders: HomeReminder[];
}

const RemindersCard = ({ reminders }: RemindersCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Active Reminders</CardTitle>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/reminders")}>
            <Bell className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">{reminder.description}</p>
                </div>
                <div className="text-primary font-medium">{reminder.time}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No active reminders</p>
            <Button variant="link" onClick={() => navigate("/reminders")}>
              Set up reminders
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersCard;
