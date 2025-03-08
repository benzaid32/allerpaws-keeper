
import { isPlatform } from "@/lib/utils";
import { LocalNotifications } from "@capacitor/local-notifications";
import { CombinedPermissionState } from "@/lib/notification-types";

/**
 * Check if notification permissions are granted on mobile
 * @returns Object with permission state and system blocked status
 */
export const checkMobilePermissions = async (): Promise<{ 
  permissionState: CombinedPermissionState; 
  isBlocked: boolean 
}> => {
  console.log("Checking mobile notification permissions");
  
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile permission check");
      return { 
        permissionState: "default", 
        isBlocked: false 
      };
    }
    
    const permissionStatus = await LocalNotifications.checkPermissions();
    
    if (permissionStatus.display === "granted") {
      console.log("Mobile notification permission is granted");
      return { 
        permissionState: "granted", 
        isBlocked: false 
      };
    } else if (permissionStatus.display === "denied") {
      console.log("Mobile notification permission is denied");
      return { 
        permissionState: "denied", 
        isBlocked: true 
      };
    } else {
      console.log("Mobile notification permission is prompt/default");
      return { 
        permissionState: "default", 
        isBlocked: false 
      };
    }
  } catch (error) {
    console.error("Error checking mobile notification permissions:", error);
    return { 
      permissionState: "default", 
      isBlocked: false 
    };
  }
};

/**
 * Test if notifications are working by scheduling and canceling a silent notification
 * @returns True if test passes, false otherwise
 */
export const testMobilePermissions = async (): Promise<boolean> => {
  console.log("Testing mobile notification permissions");
  
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile permission test");
      return false;
    }
    
    const testId = Math.floor(Math.random() * 1000000);
    
    // Try to schedule a silent notification as a test
    await LocalNotifications.schedule({
      notifications: [
        {
          id: testId,
          title: "Test",
          body: "This is a silent test notification",
          schedule: { at: new Date(Date.now() + 1000) },
          sound: null,
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: '#488AFF'
        }
      ]
    });
    
    // If we got here without error, cancel the test notification
    await LocalNotifications.cancel({ notifications: [{ id: testId }] });
    console.log("Mobile notification test passed successfully");
    return true;
  } catch (error) {
    console.error("Mobile notification test failed:", error);
    return false;
  }
};

/**
 * Request permission for local notifications on mobile devices
 * @returns True if permission granted, false otherwise
 */
export const requestMobilePermission = async (): Promise<boolean> => {
  console.log("Requesting mobile notification permission");
  
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile permission request");
      return false;
    }
    
    const result = await LocalNotifications.requestPermissions();
    
    if (result.display === "granted") {
      console.log("Mobile notification permission granted");
      return true;
    } else {
      console.log("Mobile notification permission denied or prompt");
      return false;
    }
  } catch (error) {
    console.error("Error requesting mobile notification permission:", error);
    return false;
  }
};

/**
 * Schedule a local notification
 * @param id - Unique ID for the notification
 * @param title - Title of the notification
 * @param body - Body of the notification
 * @param at - Date and time to display the notification
 * @returns True if notification was scheduled successfully
 */
export const scheduleMobileNotification = async (
  id: number,
  title: string,
  body: string,
  at: Date
): Promise<boolean> => {
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile notification schedule");
      return false;
    }
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: id,
          title: title,
          body: body,
          schedule: { at: at },
          sound: null,
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: '#488AFF'
        }
      ]
    });
    
    console.log(`Mobile notification scheduled with id: ${id}, title: ${title}, body: ${body}, at: ${at}`);
    return true;
  } catch (error) {
    console.error("Error scheduling mobile notification:", error);
    return false;
  }
};

/**
 * Send a test notification immediately
 * @returns True if notification was sent successfully
 */
export const sendMobileTestNotification = async (): Promise<boolean> => {
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile test notification");
      return false;
    }
    
    const testId = Math.floor(Math.random() * 1000000);
    
    await LocalNotifications.schedule({
      notifications: [
        {
          id: testId,
          title: "Test Notification",
          body: "This is a test notification from AllerPaws Keeper",
          schedule: { at: new Date(Date.now() + 500) },
          // Include sound for the test notification
          smallIcon: "ic_stat_icon_config_sample",
          iconColor: '#488AFF'
        }
      ]
    });
    
    console.log("Mobile test notification sent");
    return true;
  } catch (error) {
    console.error("Error sending mobile test notification:", error);
    return false;
  }
};

/**
 * Cancel a scheduled local notification
 * @param id - ID of the notification to cancel
 */
export const cancelMobileNotification = async (id: number): Promise<void> => {
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile notification cancel");
      return;
    }
    
    await LocalNotifications.cancel({
      notifications: [{ id: id }]
    });
    
    console.log(`Mobile notification cancelled with id: ${id}`);
  } catch (error) {
    console.error("Error cancelling mobile notification:", error);
  }
};

/**
 * Cancel all scheduled local notifications
 */
export const cancelAllMobileNotifications = async (): Promise<void> => {
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile notification cancel all");
      return;
    }
    
    // Use cancel with an empty notification list to cancel all notifications
    // The API doesn't have a cancelAll method
    await LocalNotifications.cancel();
    
    console.log("All mobile notifications cancelled");
  } catch (error) {
    console.error("Error cancelling all mobile notifications:", error);
  }
};

/**
 * Check if notification permissions are granted
 */
export const checkMobileNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (!isPlatform('capacitor')) {
      return false;
    }
    
    const permissionStatus = await LocalNotifications.checkPermissions();
    
    if (permissionStatus.display === "granted") {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking mobile notification permissions:", error);
    return false;
  }
};
