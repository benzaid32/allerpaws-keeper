
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/use-pets";
import BottomNavigation from "@/components/BottomNavigation";
import { LogOut, BarChart2, Calendar, Activity, AlertTriangle, CheckCircle, Clock, PlusCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const EnhancedDashboard = () => {
  const { user, signOut } = useAuth();
  const { pets, loading } = usePets();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentActivity, setRecentActivity] = useState<number>(0);
  const [symptomsThisWeek, setSymptomsThisWeek] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading statistics data
    const loadStats = async () => {
      try {
        // In a real application, you would fetch this data from the backend
        // This is just a simulation for the UI
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set some example statistics
        setRecentActivity(Math.floor(Math.random() * 15) + 3);
        setSymptomsThisWeek(Math.floor(Math.random() * 5));
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, []);

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

  const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (loading || isLoadingStats) {
    return (
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <LoadingSpinner />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Welcome Card */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-sm animate-fade-in">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hello, {user?.user_metadata?.full_name || "Pet Parent"}!</h2>
              <p className="text-muted-foreground">{getTodayDate()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar" className="h-10 w-10 rounded-full" />
              ) : (
                <span className="text-xl font-bold">{user?.user_metadata?.full_name?.charAt(0) || "A"}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6 animate-scale-in">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity}</div>
            <p className="text-xs text-muted-foreground">
              Entries in the last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart2 className="mr-2 h-4 w-4 text-primary" />
              Symptom Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {symptomsThisWeek > 0 ? (
                <>
                  {symptomsThisWeek}
                  <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" />
                </>
              ) : (
                <>
                  All Good
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {symptomsThisWeek > 0 
                ? "Symptoms recorded this week" 
                : "No symptoms this week"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pets Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your Pets</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pets')} className="text-primary">
            Manage
          </Button>
        </div>

        {pets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {pets.map((pet) => (
              <Card 
                key={pet.id} 
                className="cursor-pointer hover-scale hover:border-primary/50"
                onClick={() => navigate(`/pet/${pet.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      {pet.imageUrl ? (
                        <img src={pet.imageUrl} alt={pet.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold">{pet.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{pet.species}</p>
                    </div>
                  </div>
                  
                  {pet.knownAllergies && pet.knownAllergies.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground block mb-2">Allergies: </span>
                      <div className="flex flex-wrap gap-1">
                        {pet.knownAllergies.slice(0, 3).map((allergy, idx) => (
                          <span key={idx} className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1">
                            {allergy}
                          </span>
                        ))}
                        {pet.knownAllergies.length > 3 && (
                          <span className="text-xs bg-muted rounded-full px-2 py-1">
                            +{pet.knownAllergies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Card 
              className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/add-pet')}
            >
              <CardContent className="flex flex-col items-center justify-center h-full py-10">
                <PlusCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium">Add New Pet</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium text-lg">No pets yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Add your first pet to start tracking their allergies and symptoms
                </p>
              </div>
              <Button onClick={() => navigate('/add-pet')} className="mt-2">
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Access */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
            onClick={() => navigate('/symptom-diary')}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-4">
              <Activity className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-medium">Symptom Diary</h4>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
            onClick={() => navigate('/food-database')}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-4">
              <AlertTriangle className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-medium">Food Allergies</h4>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
            onClick={() => navigate('/elimination-diet')}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-4">
              <Calendar className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-medium">Diet Plan</h4>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50"
            onClick={() => navigate('/reminders')}
          >
            <CardContent className="flex flex-col items-center justify-center text-center p-4">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-medium">Reminders</h4>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default EnhancedDashboard;
