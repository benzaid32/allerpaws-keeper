
import { isPlatform } from "@/lib/utils";
import { NotificationInstructions } from "@/lib/notification-types";

/**
 * Helper function to provide platform-specific instructions for enabling notifications
 */
export const getNotificationInstructions = (): NotificationInstructions => {
  if (isPlatform('capacitor')) {
    // Mobile instructions
    if (isSystemNotificationsBlocked()) {
      // Check if Android or iOS
      const isAndroid = /android/i.test(navigator.userAgent);
      
      if (isAndroid) {
        return {
          title: "Enable notifications on Android",
          steps: [
            "Open your device Settings",
            "Tap on Apps or Application Manager",
            "Find AllerPaws Keeper",
            "Tap on Notifications",
            "Enable Allow notifications"
          ]
        };
      } else {
        // iOS instructions
        return {
          title: "Enable notifications on iOS",
          steps: [
            "Open your device Settings",
            "Scroll down and tap on AllerPaws",
            "Tap on Notifications",
            "Toggle Allow Notifications to ON"
          ]
        };
      }
    }
  } else {
    // Browser instructions
    if (isSystemNotificationsBlocked()) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);
      const isFirefox = /firefox/i.test(navigator.userAgent);
      
      if (isSafari) {
        return {
          title: "Enable notifications in Safari",
          steps: [
            "Open Safari Preferences",
            "Go to Websites tab",
            "Select Notifications",
            "Find AllerPaws and allow notifications"
          ]
        };
      } else if (isChrome) {
        return {
          title: "Enable notifications in Chrome",
          steps: [
            "Click the lock icon in the address bar",
            "Select Site Settings",
            "Find Notifications and change to Allow"
          ]
        };
      } else if (isFirefox) {
        return {
          title: "Enable notifications in Firefox",
          steps: [
            "Click the lock icon in the address bar",
            "Select Connection Secure > More Information",
            "Go to Permissions tab",
            "Find Notifications and remove the block"
          ]
        };
      }
    }
  }
  
  // Default instructions
  return {
    title: "Enable notifications",
    steps: [
      "Check your browser or device settings",
      "Make sure notifications are allowed for AllerPaws"
    ]
  };
};

/**
 * Check if system notifications are blocked by browser/device settings
 */
export const isSystemNotificationsBlocked = (): boolean => {
  if (isPlatform('capacitor')) {
    // For mobile, this would need to be checked via the LocalNotifications plugin
    return false; // Default, will be updated by the hook
  } else if ('Notification' in window) {
    return Notification.permission === 'denied';
  }
  return false;
};

/**
 * Parse time string into hours and minutes
 */
export const parseTime = (timeString: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return { hours, minutes };
};
