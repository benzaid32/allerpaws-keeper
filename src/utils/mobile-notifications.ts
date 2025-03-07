import { isPlatform } from "@/lib/utils";
import { LocalNotifications } from "@capacitor/local-notifications";

/**
 * Request permission for local notifications on mobile devices
 */
export const requestMobileNotificationPermission = async (): Promise<"granted" | "denied" | "prompt"> => {
  console.log("Requesting mobile notification permission");
  
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile permission request");
      return "prompt";
    }
    
    const result = await LocalNotifications.requestPermissions();
    
    // Map the Capacitor permission result to our standard format
    if (result.display === "granted") {
      console.log("Mobile notification permission granted");
      return "granted";
    } else if (result.display === "denied") {
      console.log("Mobile notification permission denied");
      return "denied";
    } else {
      console.log("Mobile notification permission prompt");
      return "prompt";
    }
  } catch (error) {
    console.error("Error requesting mobile notification permission:", error);
    return "prompt"; // Default to prompt on error
  }
};

/**
 * Schedule a local notification
 * @param id - Unique ID for the notification
 * @param title - Title of the notification
 * @param body - Body of the notification
 * @param at - Date and time to display the notification
 */
export const scheduleMobileNotification = async (
  id: number,
  title: string,
  body: string,
  at: Date
): Promise<void> => {
  try {
    if (!isPlatform('capacitor')) {
      console.log("Not on Capacitor platform, skipping mobile notification schedule");
      return;
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
  } catch (error) {
    console.error("Error scheduling mobile notification:", error);
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
    
    await LocalNotifications.cancelAll();
    
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
