
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/use-settings";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import ManageSubscription from "@/components/subscription/ManageSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  LogOut, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  UserCircle, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Smartphone,
  Share2,
  Info
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, notifications, updateTheme, updateNotifications } = useSettings();
  const { subscription, loading: subLoading, cancelSubscription, resumeSubscription } = useSubscription();
  const { toast } = useToast();
  const [isThemeToggling, setIsThemeToggling] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleThemeToggle = () => {
    setIsThemeToggling(true);
    setTimeout(() => {
      updateTheme(theme === "light" ? "dark" : "light");
      setIsThemeToggling(false);
    }, 300);
  };

  const handleNotificationsToggle = () => {
    updateNotifications(!notifications);
    
    toast({
      title: notifications ? "Notifications disabled" : "Notifications enabled",
      description: notifications 
        ? "You won't receive app notifications" 
        : "You'll receive important updates and reminders",
    });
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      
      <div className="container relative pb-20 pt-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* Profile Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UserCircle className="h-5 w-5 mr-2 text-primary" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  {user?.user_metadata?.avatar_url ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <span className="text-primary font-semibold text-xl">
                        {user?.user_metadata?.full_name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-lg">
                      {user?.user_metadata?.full_name || "User"}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/profile")}>
                  Edit Profile
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-primary" />
                    ) : (
                      <Sun className="h-5 w-5 text-primary" />
                    )}
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                  </div>
                  <div className={isThemeToggling ? "animate-pulse" : ""}>
                    <Switch
                      id="theme-toggle"
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-toggle">Enable Notifications</Label>
                  <Switch
                    id="notifications-toggle"
                    checked={notifications}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate("/reminders")}
                >
                  Manage Reminders
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscription Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ManageSubscription 
                    subscription={subscription} 
                    isLoading={subLoading}
                    onCancel={cancelSubscription}
                    onResume={resumeSubscription}
                    onUpgrade={() => navigate('/pricing')}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between" onClick={() => window.open("https://allerpaws.example.com/help", "_blank")}>
                  Help Center
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => window.open("mailto:support@allerpaws.example.com")}>
                  Contact Support
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => window.open("https://allerpaws.example.com/privacy", "_blank")}>
                  Privacy Policy
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Info Section */}
          <motion.div variants={cardVariants}>
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-2">
                  <p className="font-medium">AllerPaws</p>
                  <p className="text-sm text-muted-foreground">Version 1.0.0</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sign Out Button */}
          <motion.div variants={cardVariants}>
            <Button 
              variant="outline" 
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Settings;
