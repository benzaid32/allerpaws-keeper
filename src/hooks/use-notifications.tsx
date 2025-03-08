
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { isPlatform } from "@/lib/utils";
import { CombinedPermissionState } from "@/lib/notification-types";
import { getNotificationInstructions } from "@/utils/notification-utils";
import {
  checkMobilePermissions,
  testMobilePermissions,
  requestMobilePermission,
  scheduleMobileNotification,
  sendMobileTestNotification
} from "@/utils/mobile-notifications";
import {
  checkWebPermissions,
  requestWebPermission,
  scheduleServiceWorkerNotification,
  scheduleWebNotification,
  sendServiceWorkerTestNotification,
  sendWebTestNotification
} from "@/utils/web-notifications";

export const useNotifications = () => {
  const [permissionState, setPermissionState] = useState<CombinedPermissionState>("default");
  const [isNotificationsSupported, setIsNotificationsSupported] = useState(false);
  const [isSystemBlocked, setIsSystemBlocked] = useState(false);
  const [hasTestedPermissions, setHasTestedPermissions] = useState(false);
  const { toast } = useToast();

  // Force check permissions on mount and when component updates
  useEffect(() => {
    checkPermissions();
  }, []);

  // Separate function to check permissions that can be called directly
  const checkPermissions = async () => {
    console.log("Checking notification permissions...");
    
    try {
      // Check if we're on a mobile device with Capacitor
      if (isPlatform('capacitor')) {
        setIsNotificationsSupported(true);
        
        // Check permission state
        const { permissionState, isBlocked } = await checkMobilePermissions();
        setPermissionState(permissionState);
        setIsSystemBlocked(isBlocked);
        
        // Try to schedule a silent notification to verify permissions
        if (permissionState !== 'denied') {
          const testSuccessful = await testMobilePermissions();
          
          if (testSuccessful) {
            setPermissionState("granted");
            setIsSystemBlocked(false);
            setHasTestedPermissions(true);
          } else if (!hasTestedPermissions) {
            // If we can't schedule and haven't tested permissions yet, try requesting them
            console.log("Automatically requesting permissions since test failed");
            requestPermission();
            setHasTestedPermissions(true);
          } else {
            setIsSystemBlocked(true);
          }
        } else if (!hasTestedPermissions) {
          // If permissions are denied and we haven't tested yet, try requesting them
          console.log("Permissions denied, but trying to request anyway");
          requestPermission();
          setHasTestedPermissions(true);
        }
      } else {
        // Web fallback
        const { isSupported, permissionState, isBlocked } = checkWebPermissions();
        setIsNotificationsSupported(isSupported);
        setPermissionState(permissionState);
        setIsSystemBlocked(isBlocked);
      }
    } catch (error) {
      console.error("Error checking notification permissions:", error);
    }
  };

  const requestPermission = async () => {
    console.log("Requesting notification permission...");
    
    try {
      let granted = false;
      
      if (isPlatform('capacitor')) {
        granted = await requestMobilePermission();
      } else {
        granted = await requestWebPermission();
      }
      
      // Update state based on result
      setPermissionState(granted ? "granted" : "denied");
      setIsSystemBlocked(!granted);
      
      if (!granted) {
        // Show guidance toast
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your device settings to receive reminders.",
          duration: 5000,
        });
      }
      
      return granted;
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
  ): Promise<boolean> => {
    try {
      // Check permissions again before scheduling
      await checkPermissions();
      
      // Use appropriate API based on platform
      if (isPlatform('capacitor')) {
        // Convert timestamp to Date object for mobile notifications
        const dateObject = new Date(timeInMillis);
        const success = await scheduleMobileNotification(id, title, body, dateObject);
        
        if (success) {
          // If we get here, permissions must be granted
          setPermissionState("granted");
          setIsSystemBlocked(false);
        }
        
        return success;
      } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Use service worker for web push notifications if available
        const success = await scheduleServiceWorkerNotification(title, body, timeInMillis);
        return success;
      } else if ('Notification' in window && permissionState === 'granted') {
        // Standard web Notification API fallback
        const success = scheduleWebNotification(title, body, timeInMillis);
        return success;
      }
      
      console.log("Cannot schedule notification - permission not granted or API not available");
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
    console.log("Sending test notification...");
    
    // Force check permissions first
    await checkPermissions();
    
    // If permission is not granted, try to request it
    if (permissionState !== "granted") {
      console.log("Permission not granted, requesting...");
      const granted = await requestPermission();
      if (!granted) {
        console.log("Permission request denied");
        return false;
      }
    }
    
    // Send an immediate notification for testing
    try {
      let success = false;
      
      if (isPlatform('capacitor')) {
        success = await sendMobileTestNotification();
      } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        success = await sendServiceWorkerTestNotification();
      } else if ('Notification' in window && permissionState === 'granted') {
        success = sendWebTestNotification();
      } else {
        throw new Error("No notification method available on this device/browser");
      }
      
      if (success) {
        // If we get here, permissions must be granted
        setPermissionState("granted");
        setIsSystemBlocked(false);
        
        toast({
          title: "Test notification sent",
          description: "You should receive a notification in a moment",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Could not send test notification: " + (error.message || "Unknown error"),
        variant: "destructive",
      });
    }
    
    return false;
  };

  return {
    isNotificationsSupported,
    permissionState,
    isSystemBlocked,
    requestPermission,
    checkPermissions,
    scheduleNotification,
    sendTestNotification,
    getNotificationInstructions
  };
};
