
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NotificationSettings } from "@/lib/types";

export const useNotifications = () => {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: false,
    lastUpdated: new Date()
  });
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">("default");
  
  // Check if notifications are supported
  const isSupported = () => {
    return 'Notification' in window;
  };

  // Initialize permissions on component mount
  useEffect(() => {
    if (!isSupported()) {
      setPermissionState("unsupported");
      return;
    }

    // Check if permission is already granted
    setPermissionState(Notification.permission);
    
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setNotificationSettings({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        });
      } catch (error) {
        console.error("Error parsing notification settings", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Request notification permission
  const requestPermission = async () => {
    if (!isSupported()) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications",
        variant: "destructive"
      });
      return false;
    }

    if (Notification.permission === "granted") {
      setPermissionState("granted");
      setNotificationSettings({ enabled: true, lastUpdated: new Date() });
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      
      if (permission === "granted") {
        setNotificationSettings({ enabled: true, lastUpdated: new Date() });
        toast({
          title: "Notifications enabled",
          description: "You'll now receive reminders as notifications"
        });
        return true;
      } else {
        toast({
          title: "Notifications disabled",
          description: "Please enable notifications in your browser settings to receive reminders",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error enabling notifications",
        description: "Failed to request notification permission",
        variant: "destructive"
      });
      return false;
    }
  };

  // Send a test notification
  const sendTestNotification = async () => {
    if (permissionState !== "granted") {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      new Notification("Test Notification", {
        body: "This is a test reminder notification",
        icon: "/favicon.ico"
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
    }
  };

  // Schedule a notification
  const scheduleNotification = (title: string, body?: string, delay = 0) => {
    if (permissionState !== "granted") return;
    
    setTimeout(() => {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico"
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }, delay);
  };

  return {
    isNotificationsSupported: isSupported(),
    permissionState,
    notificationSettings,
    requestPermission,
    sendTestNotification,
    scheduleNotification,
    setNotificationSettings
  };
};
