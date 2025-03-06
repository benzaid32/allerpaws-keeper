import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Bell, Calendar } from "lucide-react";
import Onboarding from "@/components/Onboarding";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import { useHomeData } from "@/hooks/use-home-data";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  const { recentLogs, reminders, loading } = useHomeData();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowOnboarding(true);
    }
  };

  const handleQuickLog = () => {
    navigate("/symptom-diary/new");
    toast({
      title: "Quick Log",
      description: "Opening the symptom log form",
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md px-4 py-8">
          {showOnboarding ? (
            <Onboarding />
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-primary mb-2">AllerPaws</h1>
              <p className="text-muted-foreground mb-8">Track and manage your pet's food allergies</p>
              
              <div className="space-y-4">
                <Button onClick={handleGetStarted} className="w-full">
                  Get Started
                </Button>
                <Button onClick={() => navigate("/auth")} variant="outline" className="w-full">
                  Sign In
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Hello, {user.user_metadata.full_name || "Pet Parent"}!</h1>
        <p className="text-muted-foreground">Track and manage your pet's food allergies</p>
      </div>

      {/* Quick Log Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button onClick={handleQuickLog} size="lg" className="rounded-full h-14 w-14 p-0">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Recent Logs Section */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Recent Logs</CardTitle>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/symptom-diary")}>
              <Calendar className="h-4 w-4 mr-1" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="border-b pb-2 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{log.petName}</p>
                      <p className="text-sm text-muted-foreground">{log.date}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {log.symptoms.map((symptom, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No recent logs yet</p>
              <Button variant="link" onClick={handleQuickLog}>Add your first log</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Reminders Section */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Active Reminders</CardTitle>
            <Button variant="ghost" size="sm" className="h-8" onClick={() => navigate("/reminders")}>
              <Bell className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  </div>
                  <div className="text-primary font-medium">{reminder.time}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No active reminders</p>
              <Button variant="link" onClick={() => navigate("/reminders")}>Set up reminders</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
