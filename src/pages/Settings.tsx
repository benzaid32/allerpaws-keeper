import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/use-settings";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useNotifications } from "@/hooks/use-notifications";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileCard from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CurrentPlan from "@/components/subscription/CurrentPlan";
import { 
  ArrowLeft, 
  PawPrint, 
  Bell, 
  Sun, 
  Moon, 
  Crown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  LogOut,
  User
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Settings = () => {
  const navigate = useNavigate();
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
  const [testSent, setTestSent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
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

  // Add additional logging to debug subscription data
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

  const handleTestNotification = async () => {
    // Force check permissions first
    console.log("Settings: Testing notifications - checking permissions");
    await checkPermissions();
    
    // If permission is not granted, request it first
    if (permissionState !== "granted") {
      console.log("Settings: Permission not granted, requesting...");
      const granted = await requestPermission();
      
      if (!granted) {
        console.log("Settings: Permission request denied");
        setShowInstructions(true);
        return; // Permission denied, can't send test notification
      }
    }
    
    // Send test notification
    console.log("Settings: Sending test notification");
    const success = await sendTestNotification();
    setTestSent(success);
    
    if (success) {
      console.log("Settings: Test notification sent successfully");
    } else {
      console.log("Settings: Failed to send test notification");
      setShowInstructions(true);
    }
  };

  // Get platform-specific instructions
  const instructions = getNotificationInstructions();

  // Handle notification toggle
  const handleNotificationToggle = async (enabled: boolean) => {
    // If enabling notifications, check/request permissions
    if (enabled) {
      console.log("Settings: Enabling notifications - checking permissions");
      await checkPermissions();
      
      if (permissionState !== "granted") {
        console.log("Settings: Permission not granted, requesting...");
        const granted = await requestPermission();
        if (!granted) {
          console.log("Settings: Permission request denied");
          setShowInstructions(true);
          // Don't enable notifications if permission not granted
          return;
        }
      }
    }
    
    // Update the setting
    console.log("Settings: Updating notification setting to", enabled);
    updateNotifications(enabled);
  };

  return (
    <MobileLayout title="Settings">
      <div className="space-y-5">
        {/* Subscription Card */}
        <MobileCard
          icon={<Crown className="h-5 w-5 text-primary" />}
          title="Your Subscription"
        >
          <CurrentPlan subscription={subscription} isLoading={isLoading} />
          <div className="mt-4">
            <Button 
              onClick={() => navigate("/pricing")} 
              className="w-full"
              variant="outline"
            >
              View All Plans
            </Button>
          </div>
        </MobileCard>

        {/* Theme Settings Card */}
        <MobileCard
          icon={<Sun className="h-5 w-5 text-primary" />}
          title="Display"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <ToggleGroup 
                type="single" 
                value={theme} 
                onValueChange={(value) => value && updateTheme(value as "light" | "dark")}
                className="justify-start"
              >
                <ToggleGroupItem value="light" aria-label="Light mode">
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Dark mode">
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </MobileCard>

        {/* Pet Management Card */}
        <MobileCard
          icon={<PawPrint className="h-5 w-5 text-primary" />}
          title="Pet Management"
        >
          <p className="text-muted-foreground mb-4">Add, edit, or manage your pets</p>
          <Button 
            onClick={() => navigate("/pets")} 
            className="w-full"
            variant="outline"
          >
            <PawPrint className="mr-2 h-4 w-4" />
            Manage Pets
          </Button>
        </MobileCard>

        {/* Notifications Card */}
        <MobileCard
          icon={<Bell className="h-5 w-5 text-primary" />}
          title="Notifications"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <Label htmlFor="notifications" className="text-base font-normal">
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about your pet's health and reminders
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
          
          {permissionState === "granted" && (
            <Alert className="mt-4 mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-400">Notifications are enabled</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-500">
                You will receive reminders and notifications from AllerPaws.
              </AlertDescription>
            </Alert>
          )}
          
          {permissionState === "denied" && (
            <Alert variant="destructive" className="mt-4 mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Notifications are blocked</AlertTitle>
              <AlertDescription>
                You need to enable notifications in your device settings to receive reminders.
              </AlertDescription>
            </Alert>
          )}
          
          {permissionState === "default" && (
            <Alert className="mt-4 mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Notification permission required</AlertTitle>
              <AlertDescription>
                You'll need to allow notification permissions when prompted to receive reminders.
              </AlertDescription>
            </Alert>
          )}
          
          {showInstructions && (
            <div className="mt-4 mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">{instructions.title}</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm">
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {notifications && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Test if notifications are working correctly on your device
              </p>
              <Button 
                onClick={handleTestNotification} 
                variant="outline" 
                className="w-full"
                size="sm"
              >
                <Bell className="mr-2 h-4 w-4" />
                Send Test Notification
              </Button>
              
              {testSent && (
                <div className="flex items-center mt-3 p-2 bg-primary/10 rounded text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span>Test notification sent! Check your notifications.</span>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                This will send a test notification with sound and vibration in a moment
              </p>
            </div>
          )}
        </MobileCard>

        {/* Account Card */}
        <MobileCard
          icon={<User className="h-5 w-5 text-primary" />}
          title="Account"
        >
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/profile")}
              variant="outline"
              className="w-full"
            >
              Edit Profile
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="destructive" 
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </MobileCard>
      </div>
    </MobileLayout>
  );
};

export default Settings;
