
import React, { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MobileCard from "@/components/ui/mobile-card";
import { useNotifications } from "@/hooks/use-notifications";

const NotificationsCard: React.FC = () => {
  const { 
    notifications, 
    updateNotifications, 
    permissionState, 
    requestPermission, 
    checkPermissions,
    getNotificationInstructions 
  } = useNotifications();
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Get platform-specific instructions
  const instructions = getNotificationInstructions();

  // Handle notification toggle
  const handleNotificationToggle = async (enabled: boolean) => {
    // If enabling notifications, check/request permissions
    if (enabled) {
      console.log("Settings: Enabling notifications - checking permissions");
      await checkPermissions();
      
      if (permissionState !== "granted") {
        console.log("Settings: Permission not granted, requesting...");
        const granted = await requestPermission();
        if (!granted) {
          console.log("Settings: Permission request denied");
          setShowInstructions(true);
          // Don't enable notifications if permission not granted
          return;
        }
      }
    }
    
    // Update the setting
    console.log("Settings: Updating notification setting to", enabled);
    updateNotifications(enabled);
  };
  
  return (
    <MobileCard
      icon={<Bell className="h-5 w-5 text-primary" />}
      title="Notifications"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <Label htmlFor="notifications" className="text-base font-normal">
            Enable Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive updates about your pet's health and reminders
          </p>
        </div>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={handleNotificationToggle}
        />
      </div>
      
      {permissionState === "granted" && (
        <Alert className="mt-4 mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">Notifications are enabled</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-500">
            You will receive reminders and notifications from AllerPaws.
          </AlertDescription>
        </Alert>
      )}
      
      {permissionState === "denied" && (
        <Alert variant="destructive" className="mt-4 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Notifications are blocked</AlertTitle>
          <AlertDescription>
            You need to enable notifications in your device settings to receive reminders.
          </AlertDescription>
        </Alert>
      )}
      
      {permissionState === "default" && (
        <Alert className="mt-4 mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Notification permission required</AlertTitle>
          <AlertDescription>
            You'll need to allow notification permissions when prompted to receive reminders.
          </AlertDescription>
        </Alert>
      )}
      
      {showInstructions && (
        <div className="mt-4 mb-4 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">{instructions.title}</h3>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            {instructions.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </MobileCard>
  );
};

export default NotificationsCard;
