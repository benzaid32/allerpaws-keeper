
import { useState, useEffect } from "react";
import { LocalNotifications, PermissionState } from '@capacitor/local-notifications';
import { useToast } from "./use-toast";
import { isPlatform } from "@/lib/utils";

export const useNotifications = () => {
  const [permissionState, setPermissionState] = useState<PermissionState | "denied" | "granted" | "default">("default");
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSupport = async () => {
      // Check if we're on a mobile device with Capacitor
      if (isPlatform('capacitor')) {
        setIsNotificationsSupported(true);
        
        try {
          // Check permission state
          const { display } = await LocalNotifications.checkPermissions();
          setPermissionState(display);
        } catch (error) {
          console.error("Error checking notification permissions:", error);
        }
      } else {
        // Web fallback
        setIsNotificationsSupported('Notification' in window);
        
        if ('Notification' in window) {
          setPermissionState(Notification.permission);
        }
      }
    };
    
    checkSupport();
  }, []);

  const requestPermission = async () => {
    try {
      if (isPlatform('capacitor')) {
        // Capacitor API
        const { display } = await LocalNotifications.requestPermissions();
        setPermissionState(display);
        return display === 'granted';
      } else {
        // Web fallback
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setPermissionState(permission);
          return permission === 'granted';
        }
      }
      return false;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      toast({
        title: "Error",
        description: "Could not request notification permissions",
        variant: "destructive",
      });
      return false;
    }
  };

  const scheduleNotification = async (
    id: number, 
    title: string, 
    body: string, 
    timeInMillis: number
  ) => {
    try {
      if (isPlatform('capacitor')) {
        await LocalNotifications.schedule({
          notifications: [{
            id,
            title,
            body,
            schedule: { at: new Date(timeInMillis) },
            sound: 'beep.wav',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF'
          }]
        });
        return true;
      } else {
        // Web fallback
        if (permissionState === 'granted') {
          const timeUntilNotification = timeInMillis - Date.now();
          if (timeUntilNotification > 0) {
            setTimeout(() => {
              new Notification(title, {
                body,
                icon: '/favicon.ico'
              });
            }, timeUntilNotification);
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error scheduling notification:", error);
      toast({
        title: "Error",
        description: "Could not schedule notification",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendTestNotification = async () => {
    const notificationTime = Date.now() + 5000; // 5 seconds from now
    
    const success = await scheduleNotification(
      999,
      "Test Notification",
      "This is a test notification from Allerpaws Keeper!",
      notificationTime
    );
    
    if (success) {
      toast({
        title: "Test notification sent",
        description: "You should receive a notification in 5 seconds",
      });
    }
  };

  return {
    isNotificationsSupported,
    permissionState,
    requestPermission,
    scheduleNotification,
    sendTestNotification
  };
};
