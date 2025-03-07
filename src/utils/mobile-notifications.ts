
import { LocalNotifications } from '@capacitor/local-notifications';
import { CombinedPermissionState } from '@/lib/notification-types';

/**
 * Check mobile notification permissions
 */
export const checkMobilePermissions = async (): Promise<{
  permissionState: CombinedPermissionState;
  isBlocked: boolean;
}> => {
  try {
    const { display } = await LocalNotifications.checkPermissions();
    console.log("Capacitor notification permission state:", display);

    // Only consider notifications blocked if explicitly 'denied'
    return {
      permissionState: display as CombinedPermissionState,
      isBlocked: display === 'denied'
    };
  } catch (error) {
    console.error("Error checking mobile notification permissions:", error);
    return {
      permissionState: "denied",
      isBlocked: true
    };
  }
};

/**
 * Test mobile notification permissions by scheduling a silent notification
 */
export const testMobilePermissions = async (): Promise<boolean> => {
  try {
    // Create a silent notification that won't actually show
    const testId = Math.floor(Math.random() * 10000);
    await LocalNotifications.schedule({
      notifications: [{
        id: testId,
        title: "Permission Test",
        body: "Testing notification permissions",
        schedule: { at: new Date(Date.now() + 3600000) }, // Far in the future
        sound: null,
        smallIcon: "ic_stat_icon_config_sample",
        iconColor: '#488AFF',
        // Add vibration explicitly
        extra: {
          vibrate: true
        }
      }]
    });
    
    // If we get here, notifications are allowed
    console.log("Notification permission test successful - permissions are granted");
    
    // Cancel the test notification
    await LocalNotifications.cancel({ notifications: [{ id: testId }] });
    return true;
  } catch (error) {
    console.error("Error testing notification permissions:", error);
    return false;
  }
};

/**
 * Request permission for mobile notifications
 */
export const requestMobilePermission = async (): Promise<boolean> => {
  try {
    console.log("Requesting Capacitor notification permissions...");
    const { display } = await LocalNotifications.requestPermissions();
    console.log("Permission request result:", display);
    
    // If not explicitly denied, try to schedule a test notification
    if (display !== 'denied') {
      return await testMobilePermissions();
    }
    
    return display === 'granted' || display === 'prompt';
  } catch (error) {
    console.error("Error requesting mobile notification permissions:", error);
    return false;
  }
};

/**
 * Schedule a notification on mobile
 */
export const scheduleMobileNotification = async (
  id: number, 
  title: string, 
  body: string, 
  timeInMillis: number
): Promise<boolean> => {
  try {
    console.log("Scheduling notification on Capacitor:", { id, title, body, time: new Date(timeInMillis) });
    
    // Schedule the notification with vibration
    await LocalNotifications.schedule({
      notifications: [{
        id,
        title,
        body,
        schedule: { at: new Date(timeInMillis) },
        sound: 'beep.wav',
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#488AFF',
        // Ensure vibration is enabled for notifications
        extra: {
          vibrate: true,
          importance: "high",
          visibility: "public"
        }
      }]
    });
    
    console.log("Notification scheduled successfully");
    return true;
  } catch (error) {
    console.error("Error scheduling mobile notification:", error);
    return false;
  }
};

/**
 * Send an immediate test notification on mobile
 */
export const sendMobileTestNotification = async (): Promise<boolean> => {
  try {
    console.log("Sending immediate test notification on Capacitor with vibration");
    
    // Schedule immediate notification with vibration
    await LocalNotifications.schedule({
      notifications: [{
        id: 999,
        title: "Test Notification",
        body: "This is a test notification from Allerpaws Keeper!",
        // Schedule for 1 second from now to ensure it fires
        schedule: { at: new Date(Date.now() + 1000) },
        sound: 'beep.wav',
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#488AFF',
        extra: {
          vibrate: true,
          importance: "high",
          visibility: "public"
        }
      }]
    });
    
    console.log("Test notification scheduled");
    return true;
  } catch (error) {
    console.error("Error sending mobile test notification:", error);
    return false;
  }
};
