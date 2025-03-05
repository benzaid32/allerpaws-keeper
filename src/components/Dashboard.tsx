
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import PetProfile from "./PetProfile";
import { Pet, SymptomEntry, FoodEntry } from "@/lib/types";
import { getLocalStorage } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ELIMINATION_PHASES } from "@/lib/constants";
import { Plus, BarChart2, CalendarClock, ArrowRight, Calendar, ClipboardList, Utensils } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pet, setPet] = useState<Pet | null>(null);
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [eliminationStartDate, setEliminationStartDate] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch data from local storage on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if onboarding is complete
        const onboardingComplete = getLocalStorage("onboardingComplete", false);
        if (!onboardingComplete) {
          navigate("/onboarding");
          return;
        }

        // Load pet data
        const petData = getLocalStorage<Pet | null>("pet", null);
        setPet(petData);

        // Load symptom entries
        const symptomData = getLocalStorage<SymptomEntry[]>("symptomEntries", []);
        setSymptomEntries(symptomData);

        // Load food entries
        const foodData = getLocalStorage<FoodEntry[]>("foodEntries", []);
        setFoodEntries(foodData);

        // Load elimination diet start date
        const startDate = getLocalStorage<string | null>("eliminationStartDate", null);
        setEliminationStartDate(startDate);

        // Determine current phase
        if (startDate) {
          const start = new Date(startDate);
          const now = new Date();
          const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          
          let phase = 0;
          let daysAccumulated = 0;
          
          for (let i = 0; i < ELIMINATION_PHASES.length; i++) {
            daysAccumulated += ELIMINATION_PHASES[i].duration;
            if (daysPassed < daysAccumulated) {
              phase = i;
              break;
            }
          }
          
          setCurrentPhase(phase);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error loading data",
          description: "There was an error loading your pet's data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };

    fetchData();
  }, [navigate, toast]);

  // Handle starting the elimination diet
  const startEliminationDiet = () => {
    const today = new Date().toISOString();
    setEliminationStartDate(today);
    setCurrentPhase(0);
    localStorage.setItem("eliminationStartDate", today);
    
    toast({
      title: "Elimination Diet Started",
      description: "Your elimination diet plan has been initialized",
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 pb-8 pt-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Pet Profile Card */}
      {pet && (
        <PetProfile
          pet={pet}
          onEdit={() => {
            toast({
              title: "Coming Soon",
              description: "Pet profile editing will be available in a future update.",
            });
          }}
          className="animate-scale-in"
        />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 border-dashed justify-start px-4"
          onClick={() => navigate("/symptoms")}
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Log Symptoms</span>
            </div>
            <span className="text-xs text-muted-foreground">Track today's issues</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto py-4 border-dashed justify-start px-4"
          onClick={() => navigate("/food")}
        >
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <Utensils className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Log Meals</span>
            </div>
            <span className="text-xs text-muted-foreground">Record what they ate</span>
          </div>
        </Button>
      </div>

      {/* Elimination Diet Card */}
      <Card className="animate-scale-in">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CalendarClock className="mr-2 h-5 w-5 text-primary" />
            Elimination Diet
          </CardTitle>
          <CardDescription>
            {eliminationStartDate
              ? `Currently in ${ELIMINATION_PHASES[currentPhase].name} phase`
              : "Start a guided elimination diet plan"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          {eliminationStartDate ? (
            <div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{currentPhase + 1}/{ELIMINATION_PHASES.length} phases</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary rounded-full h-2.5 transition-all duration-500"
                    style={{
                      width: `${((currentPhase + 1) / ELIMINATION_PHASES.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <h3 className="font-medium">{ELIMINATION_PHASES[currentPhase].name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ELIMINATION_PHASES[currentPhase].description}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                An elimination diet helps identify food allergies by temporarily restricting and then systematically reintroducing potential allergens.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>8-12 week guided process</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Step-by-step instructions</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <span>Track progress and symptoms</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button
            variant={eliminationStartDate ? "outline" : "default"}
            className="w-full"
            onClick={() => {
              if (eliminationStartDate) {
                navigate("/diet");
              } else {
                startEliminationDiet();
              }
            }}
          >
            {eliminationStartDate ? (
              <>
                View Diet Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Start Elimination Diet
                <Plus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {symptomEntries.length + foodEntries.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total log entries recorded
            </p>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart2 className="mr-2 h-4 w-4 text-primary" />
              Symptom Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "text-2xl font-bold",
              symptomEntries.length > 0 ? "text-warning" : "text-muted-foreground"
            )}>
              {symptomEntries.length > 0 ? "Monitoring" : "No Data"}
            </div>
            <p className="text-xs text-muted-foreground">
              {symptomEntries.length > 0
                ? "Recent symptom activity detected"
                : "Start logging symptoms"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
