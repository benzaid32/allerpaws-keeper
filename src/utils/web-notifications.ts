
import { CombinedPermissionState, ExtendedNotificationOptions } from '@/lib/notification-types';

/**
 * Check web notification permissions
 */
export const checkWebPermissions = (): {
  isSupported: boolean;
  permissionState: CombinedPermissionState;
  isBlocked: boolean;
} => {
  const isSupported = 'Notification' in window;
  
  if (isSupported) {
    console.log("Web notification permission state:", Notification.permission);
    
    return {
      isSupported,
      permissionState: Notification.permission as CombinedPermissionState,
      isBlocked: Notification.permission === 'denied'
    };
  }
  
  return {
    isSupported: false,
    permissionState: "default",
    isBlocked: false
  };
};

/**
 * Request permission for web notifications
 */
export const requestWebPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    console.log("Requesting web notification permissions...");
    const permission = await Notification.requestPermission();
    console.log("Web permission request result:", permission);
    
    return permission === 'granted';
  }
  return false;
};

/**
 * Schedule a notification via service worker
 */
export const scheduleServiceWorkerNotification = async (
  title: string,
  body: string,
  timeInMillis: number
): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.showNotification) {
      const timeUntilNotification = timeInMillis - Date.now();
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          // Use vibrate array pattern: [vibrate, pause, vibrate]
          const options: ExtendedNotificationOptions = {
            body,
            icon: '/favicon.ico',
            // This is the correct way to specify vibration pattern
            vibrate: [300, 100, 300]
          };
          
          registration.showNotification(title, options);
          console.log("Web notification displayed using service worker");
        }, timeUntilNotification);
      }
      return true;
    }
  } catch (error) {
    console.error("Service worker notification error:", error);
  }
  return false;
};

/**
 * Schedule a standard web notification (fallback)
 */
export const scheduleWebNotification = (
  title: string,
  body: string,
  timeInMillis: number
): boolean => {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log("Scheduling web notification:", { title, body, time: new Date(timeInMillis) });
      
      const timeUntilNotification = timeInMillis - Date.now();
      if (timeUntilNotification > 0) {
        setTimeout(() => {
          try {
            // Create the notification without the vibrate property
            const notification = new Notification(title, {
              body,
              icon: '/favicon.ico'
            });
            
            // Try to vibrate using the Vibration API separately
            if ('vibrate' in navigator) {
              navigator.vibrate([300, 100, 300]);
            }
            
            console.log("Web notification displayed");
          } catch (error) {
            console.error("Error creating web notification:", error);
          }
        }, timeUntilNotification);
      }
      return true;
    }
  } catch (error) {
    console.error("Error scheduling web notification:", error);
  }
  return false;
};

/**
 * Send an immediate test notification via service worker
 */
export const sendServiceWorkerTestNotification = async (): Promise<boolean> => {
  try {
    console.log("Trying to use service worker for test notification");
    const registration = await navigator.serviceWorker.ready;
    if (registration.showNotification) {
      // Cast to any to bypass TypeScript checking for vibrate property
      const options: ExtendedNotificationOptions = {
        body: "This is a test notification from Allerpaws Keeper!",
        icon: '/favicon.ico',
        // This is the correct way to specify vibration pattern
        vibrate: [300, 100, 300]
      };
      
      await registration.showNotification("Test Notification", options);
      console.log("Test notification sent via service worker");
      return true;
    }
  } catch (error) {
    console.error("Service worker notification error:", error);
  }
  return false;
};

/**
 * Send an immediate standard web notification (fallback)
 */
export const sendWebTestNotification = (): boolean => {
  try {
    console.log("Using standard Web Notification API");
    
    // Create the notification without the vibrate property
    const notification = new Notification("Test Notification", {
      body: "This is a test notification from Allerpaws Keeper!",
      icon: '/favicon.ico'
    });
    
    // Use the Vibration API separately
    if ('vibrate' in navigator) {
      navigator.vibrate([300, 100, 300]);
    }
    
    return true;
  } catch (error) {
    console.error("Error creating web notification:", error);
    return false;
  }
};
