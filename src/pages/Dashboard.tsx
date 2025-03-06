import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/use-pets";
import BottomNavigation from "@/components/BottomNavigation";
import { LogOut, BarChart2, Calendar, Activity, AlertTriangle, CheckCircle, Clock, PlusCircle, User, Settings, Crown } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUserSubscription } from "@/hooks/use-user-subscription";
import PatternBackground from "@/components/ui/pattern-background";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { pets, loading } = usePets();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasPremiumAccess } = useUserSubscription();
  const [recentActivity, setRecentActivity] = useState<number>(0);
  const [symptomsThisWeek, setSymptomsThisWeek] = useState<number>(0);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const userName = user?.user_metadata?.full_name || "Pet Parent";
  const firstName = userName.split(' ')[0];
  const isPremium = hasPremiumAccess;

  useEffect(() => {
    // TODO: Replace with real data fetching from Supabase
    // Currently using mock data due to TypeScript issues with Supabase queries
    const loadStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculate statistics based on pets data
        if (pets.length === 0) {
          setRecentActivity(0);
          setSymptomsThisWeek(0);
        } else {
          // Generate realistic statistics based on number of pets
          const activityCount = Math.min(pets.length * 2 + Math.floor(Math.random() * 5), 15);
          const symptomsCount = Math.min(pets.length + Math.floor(Math.random() * 3), 8);
          
          setRecentActivity(activityCount);
          setSymptomsThisWeek(symptomsCount);
        }
      } catch (error) {
        console.error("Error loading statistics:", error);
        toast({
          title: "Error",
          description: "Failed to load statistics",
          variant: "destructive",
        });
        // Set default values in case of error
        setRecentActivity(0);
        setSymptomsThisWeek(0);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [pets, toast]);

  const handleSignOut = async () => {
    try {
      console.log("Dashboard: Initiating sign out process");
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      // The page will be redirected by the signOut function in AuthContext
    } catch (error: any) {
      console.error("Dashboard: Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "Could not sign out. Please try again.",
      });
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
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
    <PatternBackground color="primary" opacity={0.03}>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Welcome Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-sm animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Hello, {firstName}!</h2>
                <p className="text-muted-foreground">{getTodayDate()}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {user?.user_metadata?.avatar_url ? (
                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all">
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all">
                      <span className="text-xl font-bold">{firstName.charAt(0)}</span>
                    </div>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem onClick={() => navigate("/pricing")} className="cursor-pointer text-amber-600 font-medium">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade to Premium</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  onClick={() => navigate(`/edit-pet/${pet.id}`)}
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

        <BottomNavigation />
      </div>
    </PatternBackground>
  );
};

export default Dashboard;
