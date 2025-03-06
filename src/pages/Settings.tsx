
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/use-settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, PawPrint, Bell } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { notificationSettings, toggleNotifications } = useSettings();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Pet Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pet Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Add, edit, or manage your pets</p>
            <Button 
              onClick={() => navigate("/pets")} 
              className="w-full"
              variant="outline"
            >
              <PawPrint className="mr-2 h-4 w-4" />
              Manage Pets
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
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
                checked={notificationSettings.enabled}
                onCheckedChange={toggleNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
