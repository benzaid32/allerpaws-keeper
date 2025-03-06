import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/use-settings";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BottomNavigation from "@/components/BottomNavigation";
import CurrentPlan from "@/components/subscription/CurrentPlan";
import { ArrowLeft, PawPrint, Bell, Sun, Moon, Crown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, notifications, updateTheme, updateNotifications } = useSettings();
  const { subscription, isLoading } = useSubscriptionContext();

  // Add additional logging to debug subscription data
  console.log("Settings page - subscription data:", subscription);
  console.log("Settings page - isLoading:", isLoading);

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
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Crown className="mr-2 h-5 w-5" />
              Your Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Theme Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Display</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

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
                checked={notifications}
                onCheckedChange={updateNotifications}
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
