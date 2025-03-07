
import { useState, useEffect } from "react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { useToast } from "./use-toast";
import { isPlatform } from "@/lib/utils";

// Define our own type that combines both web and Capacitor permission states
type CombinedPermissionState = "denied" | "granted" | "default" | "prompt";

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
        const { display } = await LocalNotifications.checkPermissions();
        console.log("Capacitor notification permission state:", display);
        
        // Important: On some devices, 'prompt' might be returned even when notifications are allowed
        // Only consider notifications blocked if explicitly 'denied'
        setPermissionState(display as CombinedPermissionState);
        setIsSystemBlocked(display === 'denied');
        
        // Try to schedule a silent notification to verify permissions
        if (display !== 'denied') {
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
            setPermissionState("granted");
            setIsSystemBlocked(false);
            setHasTestedPermissions(true);
            
            // Cancel the test notification
            await LocalNotifications.cancel({ notifications: [{ id: testId }] });
          } catch (error) {
            console.error("Error testing notification permissions:", error);
            // If we can't schedule, permissions might be blocked
            if (display !== 'granted') {
              setIsSystemBlocked(true);
              
              // If we haven't tested permissions yet, try requesting them
              if (!hasTestedPermissions) {
                console.log("Automatically requesting permissions since test failed");
                requestPermission();
                setHasTestedPermissions(true);
              }
            }
          }
        } else if (!hasTestedPermissions) {
          // If permissions are denied and we haven't tested yet, try requesting them
          console.log("Permissions denied, but trying to request anyway");
          requestPermission();
          setHasTestedPermissions(true);
        }
      } else {
        // Web fallback
        setIsNotificationsSupported('Notification' in window);
        
        if ('Notification' in window) {
          console.log("Web notification permission state:", Notification.permission);
          
          setPermissionState(Notification.permission as CombinedPermissionState);
          
          // Only set as blocked if explicitly denied
          setIsSystemBlocked(Notification.permission === 'denied');
        }
      }
    } catch (error) {
      console.error("Error checking notification permissions:", error);
    }
  };

  const requestPermission = async () => {
    console.log("Requesting notification permission...");
    
    try {
      if (isPlatform('capacitor')) {
        // Request permissions directly
        console.log("Requesting Capacitor notification permissions...");
        const { display } = await LocalNotifications.requestPermissions();
        console.log("Permission request result:", display);
        
        // Important: On some devices, the result might not be accurate
        // We'll do an additional check by trying to schedule a notification
        let actuallyGranted = display === 'granted';
        let actuallyBlocked = display === 'denied';
        
        // If not explicitly denied, try to schedule a test notification
        if (display !== 'denied') {
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
                iconColor: '#488AFF'
              }]
            });
            
            // If we get here, notifications are allowed
            console.log("Notification permission test successful - permissions are granted");
            actuallyGranted = true;
            actuallyBlocked = false;
            
            // Cancel the test notification
            await LocalNotifications.cancel({ notifications: [{ id: testId }] });
          } catch (error) {
            console.error("Error testing notification permissions:", error);
            // If we can't schedule, permissions are likely blocked
            actuallyGranted = false;
            actuallyBlocked = true;
          }
        }
        
        // Update state based on our actual test
        setPermissionState(actuallyGranted ? "granted" : (actuallyBlocked ? "denied" : "default"));
        setIsSystemBlocked(actuallyBlocked);
        
        if (actuallyBlocked) {
          // Show guidance toast for mobile users
          toast({
            title: "Notifications Blocked",
            description: "Please enable notifications in your device settings to receive reminders.",
            duration: 5000,
          });
        }
        
        return actuallyGranted;
      } else {
        // Web fallback
        if ('Notification' in window) {
          console.log("Requesting web notification permissions...");
          const permission = await Notification.requestPermission();
          console.log("Web permission request result:", permission);
          
          setPermissionState(permission as CombinedPermissionState);
          
          // Update blocked state
          const isBlocked = permission === 'denied';
          setIsSystemBlocked(isBlocked);
          
          if (isBlocked) {
            // Show guidance toast for browser users
            toast({
              title: "Notifications Blocked",
              description: "Please enable notifications in your browser settings to receive reminders.",
              duration: 5000,
            });
          }
          
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
      // Check permissions again before scheduling
      await checkPermissions();
      
      // Fix: Use appropriate API based on platform
      if (isPlatform('capacitor')) {
        // For Capacitor, we use the LocalNotifications plugin
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
        
        // If we get here, permissions must be granted
        setPermissionState("granted");
        setIsSystemBlocked(false);
        
        return true;
      } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Use service worker for web push notifications if available
        console.log("Using service worker for notifications");
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            const timeUntilNotification = timeInMillis - Date.now();
            if (timeUntilNotification > 0) {
              setTimeout(() => {
                registration.showNotification(title, {
                  body,
                  icon: '/favicon.ico',
                  vibrate: [300, 100, 300]
                });
                console.log("Web notification displayed using service worker");
              }, timeUntilNotification);
            }
            return true;
          }
        } catch (error) {
          console.error("Service worker notification error:", error);
          // Fall back to standard Notification API
        }
      }
      
      // Standard web Notification API fallback
      if (permissionState === 'granted' && 'Notification' in window) {
        console.log("Scheduling web notification:", { title, body, time: new Date(timeInMillis) });
        
        const timeUntilNotification = timeInMillis - Date.now();
        if (timeUntilNotification > 0) {
          setTimeout(() => {
            try {
              // Create the notification with appropriate options for web
              const notification = new Notification(title, {
                body,
                icon: '/favicon.ico'
              });
              
              // Try to vibrate using the Vibration API if available
              if ('vibrate' in navigator) {
                navigator.vibrate([300, 100, 300]);
              }
              
              console.log("Web notification displayed");
            } catch (error) {
              console.error("Error creating web notification:", error);
              toast({
                title: "Notification Error",
                description: "Could not display notification. Try refreshing the page.",
                variant: "destructive",
              });
            }
          }, timeUntilNotification);
        }
        return true;
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
      // Fix: Use appropriate API based on platform
      if (isPlatform('capacitor')) {
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
        
        // If we get here, permissions must be granted
        setPermissionState("granted");
        setIsSystemBlocked(false);
        
        toast({
          title: "Test notification sent",
          description: "You should receive a notification in a moment",
        });
        
        return true;
      } else if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Try service worker API for web
        console.log("Trying to use service worker for test notification");
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration.showNotification) {
            await registration.showNotification("Test Notification", {
              body: "This is a test notification from Allerpaws Keeper!",
              icon: '/favicon.ico',
              vibrate: [300, 100, 300]
            });
            
            console.log("Test notification sent via service worker");
            
            toast({
              title: "Test notification sent",
              description: "You should see a notification now",
            });
            
            return true;
          }
        } catch (error) {
          console.error("Service worker notification error:", error);
          // Fall back to standard notification
        }
      }
      
      // Standard web notification fallback
      if ('Notification' in window && permissionState === 'granted') {
        console.log("Using standard Web Notification API");
        
        try {
          // Create the notification without the vibrate property
          const notification = new Notification("Test Notification", {
            body: "This is a test notification from Allerpaws Keeper!",
            icon: '/favicon.ico'
          });
          
          // Use the Vibration API separately
          if ('vibrate' in navigator) {
            navigator.vibrate([300, 100, 300]);
          }
          
          toast({
            title: "Test notification sent",
            description: "You should see a notification now",
          });
          
          return true;
        } catch (error) {
          console.error("Error creating web notification:", error);
          throw new Error("Browser notification API error: " + (error.message || "Unknown error"));
        }
      } else {
        console.error("No notification method available");
        throw new Error("No notification method available on this device/browser");
      }
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

  // Helper function to provide platform-specific instructions
  const getNotificationInstructions = () => {
    if (isPlatform('capacitor')) {
      // Mobile instructions
      if (isSystemBlocked) {
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
      if (isSystemBlocked) {
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
