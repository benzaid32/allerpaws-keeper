
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/use-settings";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useNotifications } from "@/hooks/use-notifications";
import MobileLayout from "@/components/layout/MobileLayout";

// Import component cards
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import ThemeCard from "@/components/settings/ThemeCard";
import PetManagementCard from "@/components/settings/PetManagementCard";
import NotificationsCard from "@/components/settings/NotificationsCard";
import AccountCard from "@/components/settings/AccountCard";

const Settings = () => {
  const { signOut } = useAuth();
  const { theme, notifications, updateTheme, updateNotifications } = useSettings();
  const { subscription, isLoading } = useSubscriptionContext();
  const { 
    sendTestNotification, 
    permissionState, 
    requestPermission, 
    isSystemBlocked,
    getNotificationInstructions,
    checkPermissions
  } = useNotifications();
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Check notification permissions when component mounts
  useEffect(() => {
    const checkNotificationPermissions = async () => {
      console.log("Settings: Checking notification permissions on mount");
      await checkPermissions();
      setPermissionChecked(true);
    };
    
    checkNotificationPermissions();
  }, [checkPermissions]);

  // Add additional logging to debug
  console.log("Settings page - subscription data:", subscription);
  console.log("Settings page - isLoading:", isLoading);
  console.log("Settings page - notification permission state:", permissionState);
  console.log("Settings page - notification system blocked:", isSystemBlocked);

  const handleSignOut = async () => {
    try {
      console.log("Settings page: Initiating sign out process");
      await signOut();
      // The page will be redirected by the signOut function in AuthContext
    } catch (error) {
      console.error("Settings page: Error during sign out:", error);
    }
  };

  return (
    <MobileLayout title="Settings">
      <div className="space-y-5">
        {/* Subscription Card */}
        <SubscriptionCard
          subscription={subscription}
          isLoading={isLoading}
        />

        {/* Theme Settings Card */}
        <ThemeCard
          theme={theme}
          updateTheme={updateTheme}
        />

        {/* Pet Management Card */}
        <PetManagementCard />

        {/* Notifications Card */}
        <NotificationsCard
          notifications={notifications}
          updateNotifications={updateNotifications}
          permissionState={permissionState}
          requestPermission={requestPermission}
          sendTestNotification={sendTestNotification}
          checkPermissions={checkPermissions}
          getNotificationInstructions={getNotificationInstructions}
        />

        {/* Account Card */}
        <AccountCard onSignOut={handleSignOut} />
      </div>
    </MobileLayout>
  );
};

export default Settings;
