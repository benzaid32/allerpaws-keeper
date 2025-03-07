
// Define our own type that combines both web and Capacitor permission states
export type CombinedPermissionState = "denied" | "granted" | "default" | "prompt";

// Create a custom interface that extends NotificationOptions with vibrate
export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

// Platform-specific notification instructions
export interface NotificationInstructions {
  title: string;
  steps: string[];
}
