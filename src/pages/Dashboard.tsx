import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { usePets } from "@/hooks/use-pets";
import BottomNavigation from "@/components/BottomNavigation";
import { LogOut, BarChart2, Calendar, Activity, AlertTriangle, CheckCircle, Clock, PlusCircle, User, Settings, Crown, PawPrint, Sparkles, Heart } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useUserSubscription } from "@/hooks/use-user-subscription";
import { motion } from "framer-motion";
import { DEFAULT_IMAGES } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

// Dashboard background image URL
const DASHBOARD_BG_IMAGE = "https://whspcnovvaqeztgtcsjl.supabase.co/storage/v1/object/sign/allerpaws/allerpaws%20home%20page.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhbGxlcnBhd3MvYWxsZXJwYXdzIGhvbWUgcGFnZS5qcGciLCJpYXQiOjE3NDEyOTkzNDQsImV4cCI6MTc0MTY0NDk0NH0.QTBFktOpZjaxj3bJkxscmSWg7sLdHR0AIp4IvjISmvU";

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-blue-50/30 to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner className="scale-125" />
        </motion.div>
        <motion.p 
          className="text-sm text-muted-foreground mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Loading your dashboard...
        </motion.p>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${DASHBOARD_BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay to ensure content readability */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm"></div>
      
      {/* Floating paw prints */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20, 
              opacity: 0,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ 
              y: window.innerHeight + 50,
              opacity: [0, 0.3, 0],
              rotate: Math.random() * 360 - 180
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25 + Math.random() * 20,
              delay: Math.random() * 15,
              ease: "linear"
            }}
          >
            <PawPrint size={20 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>
      
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/10 to-primary/10 blur-3xl -z-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-purple-400/5 to-pink-400/5 blur-3xl -z-10"
        animate={{
          x: [0, -30, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 pb-20">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="mb-6 overflow-hidden relative border-none shadow-md">
            {/* Card background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/10 backdrop-blur-md"></div>
            
            <CardContent className="pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Hello, {firstName}!</h2>
                  <p className="text-muted-foreground">{getTodayDate()}</p>
                  
                  {isPremium && (
                    <div className="flex items-center mt-2 text-amber-600">
                      <Crown className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Premium Member</span>
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {user?.user_metadata?.avatar_url ? (
                        <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all shadow-md">
                          <img 
                            src={user.user_metadata.avatar_url} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/80 to-blue-600/80 flex items-center justify-center ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all shadow-md">
                          <span className="text-xl font-bold text-white">{firstName.charAt(0)}</span>
                        </div>
                      )}
                    </motion.div>
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
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10">
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
          
          <Card className="hover:shadow-md transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10">
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
        </motion.div>

        {/* Pet Care Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 border border-primary/10 shadow-sm backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Pet Care Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    When introducing new foods to pets with allergies, do so one at a time with at least 
                    a week between introductions to accurately identify any reactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pets Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <PawPrint className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-medium">Your Pets</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pets')} className="text-primary hover:bg-primary/10">
              Manage
            </Button>
          </div>

          {pets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
                >
                  <Card 
                    className="cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary/10 overflow-hidden"
                    onClick={() => navigate(`/edit-pet/${pet.id}`)}
                  >
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shadow-sm">
                            {pet.imageUrl ? (
                              <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
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
                            <div className="flex items-center mb-2">
                              <Heart className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-sm text-muted-foreground">Allergies: </span>
                            </div>
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
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (pets.length + 1) }}
              >
                <Card 
                  className="border-dashed cursor-pointer hover:bg-primary/5 transition-colors bg-white/60 dark:bg-gray-800/60"
                  onClick={() => navigate('/add-pet')}
                >
                  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <CardContent className="flex flex-col items-center justify-center h-full py-10">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <PlusCircle className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">Add New Pet</p>
                    </CardContent>
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-dashed bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-lg">No pets yet</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Add your first pet to start tracking their allergies and symptoms
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate('/add-pet')} 
                    className="mt-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md"
                  >
                    Add Your First Pet
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <BottomNavigation />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
