
import React, { useEffect } from 'react';

interface NotificationPermissionManagerProps {
  children: React.ReactNode;
}

const NotificationPermissionManager: React.FC<NotificationPermissionManagerProps> = ({ children }) => {
  // Request notification permissions early
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        // For web notifications
        if ('Notification' in window) {
          // Prepare service worker for notifications
          if ('serviceWorker' in navigator) {
            try {
              // Ensure service worker is ready for notifications
              await navigator.serviceWorker.ready;
              console.log("Service worker ready for notifications");
            } catch (error) {
              console.error("Error preparing service worker for notifications:", error);
            }
          }
        }
      } catch (error) {
        console.error("App: Error requesting notification permissions:", error);
      }
    };
    
    requestNotificationPermissions();
  }, []);
  
  return <>{children}</>;
};

export default NotificationPermissionManager;
