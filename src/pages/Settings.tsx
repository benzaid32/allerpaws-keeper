
import React, { useState } from "react";
import { Bell, Download, LogOut, ChevronRight, BellOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNavigation from "@/components/BottomNavigation";
import { useSettings } from "@/hooks/use-settings";
import { useNotifications } from "@/hooks/use-notifications";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reminderSettings, loading, toggleReminderSetting, exportData } = useSettings();
  const [exporting, setExporting] = useState(false);
  const { 
    isNotificationsSupported, 
    permissionState, 
    requestPermission, 
    sendTestNotification,
    notificationSettings
  } = useNotifications();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (type: "progress" | "food") => {
    setExporting(true);
    try {
      await exportData(type);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg">Notification Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isNotificationsSupported ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for reminders</p>
                </div>
                <Switch 
                  checked={permissionState === "granted"} 
                  onCheckedChange={() => {
                    if (permissionState !== "granted") {
                      requestPermission();
                    } else {
                      toast({
                        title: "Cannot disable notifications",
                        description: "To disable notifications, use your browser settings",
                        variant: "default",
                      });
                    }
                  }}
                />
              </div>

              {permissionState === "granted" && (
                <Button variant="outline" size="sm" onClick={sendTestNotification} className="w-full">
                  Send Test Notification
                </Button>
              )}

              {permissionState !== "granted" && (
                <Alert variant={permissionState === "denied" ? "destructive" : "default"}>
                  <AlertDescription>
                    {permissionState === "denied" 
                      ? "Notifications are blocked. Please enable them in your browser settings."
                      : "Enable notifications to get reminders even when the app is closed."}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="py-2 text-center text-muted-foreground">
              <BellOff className="h-5 w-5 mx-auto mb-2" />
              <p>Your browser doesn't support notifications</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg">Reminder Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="py-4 text-center text-muted-foreground">Loading settings...</div>
            ) : reminderSettings.length > 0 ? (
              reminderSettings.map(setting => (
                <div key={setting.id} className="flex justify-between items-center p-2 border-b">
                  <span>{setting.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-primary">{setting.time}</div>
                    <Switch 
                      checked={setting.active} 
                      onCheckedChange={(checked) => toggleReminderSetting(setting.id, checked)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-muted-foreground">No reminder settings found</div>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/reminders")}
            >
              <span className="flex items-center justify-between w-full">
                Manage Reminders
                <ChevronRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            <CardTitle className="text-lg">Export Data</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExport("progress")}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export Progress Report"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExport("food")}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export Food Diary"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="text-center mb-4">
              <p className="font-medium">{user?.user_metadata?.full_name || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
              Manage Pets
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
