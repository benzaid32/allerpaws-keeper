
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ELIMINATION_PHASES } from "@/lib/constants";
import { getLocalStorage, setLocalStorage } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ArrowLeft, CalendarDays, CheckCircle, LucideIcon, ArrowRight, AlertTriangle, Clock, PlayCircle, PauseCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EliminationDiet: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [daysInCurrentPhase, setDaysInCurrentPhase] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Load data from local storage
  useEffect(() => {
    try {
      // Load elimination diet start date
      const savedStartDate = getLocalStorage<string | null>("eliminationStartDate", null);
      
      if (!savedStartDate) {
        toast({
          title: "Not started",
          description: "You haven't started an elimination diet yet",
        });
        navigate("/dashboard");
        return;
      }
      
      setStartDate(savedStartDate);
      
      // Calculate days passed and current phase
      const start = new Date(savedStartDate);
      const now = new Date();
      const totalDaysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTotalDays(totalDaysPassed);
      
      // Determine current phase
      let phase = 0;
      let daysAccumulated = 0;
      let daysInPhase = 0;
      
      for (let i = 0; i < ELIMINATION_PHASES.length; i++) {
        const phaseDuration = ELIMINATION_PHASES[i].duration;
        daysAccumulated += phaseDuration;
        
        if (totalDaysPassed < daysAccumulated) {
          phase = i;
          daysInPhase = phaseDuration - (daysAccumulated - totalDaysPassed);
          break;
        }
      }
      
      setCurrentPhase(phase);
      setDaysInCurrentPhase(daysInPhase);
      setMounted(true);
    } catch (error) {
      console.error("Error loading elimination diet data:", error);
      toast({
        title: "Error loading data",
        description: "There was an error loading your elimination diet data",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Reset the elimination diet
  const resetEliminationDiet = () => {
    const today = new Date().toISOString();
    setStartDate(today);
    setCurrentPhase(0);
    setTotalDays(0);
    setDaysInCurrentPhase(0);
    setLocalStorage("eliminationStartDate", today);
    
    toast({
      title: "Elimination Diet Reset",
      description: "Your elimination diet plan has been reset to day one",
    });
  };

  // Format a date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate the total progress through all phases
  const calculateTotalProgress = () => {
    const totalDuration = ELIMINATION_PHASES.reduce((acc, phase) => acc + phase.duration, 0);
    const phasesCompletedDuration = ELIMINATION_PHASES.slice(0, currentPhase).reduce((acc, phase) => acc + phase.duration, 0);
    const progressInCurrentPhase = daysInCurrentPhase;
    const totalProgress = ((phasesCompletedDuration + progressInCurrentPhase) / totalDuration) * 100;
    return Math.min(totalProgress, 100);
  };

  // Calculate progress in the current phase
  const calculatePhaseProgress = () => {
    const currentPhaseDuration = ELIMINATION_PHASES[currentPhase].duration;
    return Math.min((daysInCurrentPhase / currentPhaseDuration) * 100, 100);
  };

  if (!mounted || !startDate) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Elimination Diet</h1>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-primary" />
            Diet Progress
          </CardTitle>
          <CardDescription>
            Started on {formatDateDisplay(startDate)} ({totalDays} days ago)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">
                  Phase {currentPhase + 1}/{ELIMINATION_PHASES.length}
                </span>
              </div>
              <Progress value={calculateTotalProgress()} className="h-2" />
            </div>
            
            {/* Current Phase Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Phase</span>
                <span className="font-medium">
                  Day {daysInCurrentPhase}/{ELIMINATION_PHASES[currentPhase].duration}
                </span>
              </div>
              <Progress value={calculatePhaseProgress()} className="h-2" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="outline" size="sm" onClick={resetEliminationDiet}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Reset Plan
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => navigate("/food")}>
            Log Food
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>

      {/* Current Phase Card */}
      <Card className="bg-primary/5 animate-scale-in">
        <CardHeader>
          <Badge className="w-fit mb-2 bg-primary text-primary-foreground">Current Phase</Badge>
          <CardTitle>{ELIMINATION_PHASES[currentPhase].name}</CardTitle>
          <CardDescription>{ELIMINATION_PHASES[currentPhase].description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="bg-background rounded-lg p-3 border">
              <h3 className="text-sm font-medium mb-2">Key Tips</h3>
              <ul className="space-y-2">
                {ELIMINATION_PHASES[currentPhase].tips.map((tip, index) => (
                  <li key={index} className="flex text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Phases */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Upcoming Phases</h2>
        
        {ELIMINATION_PHASES.slice(currentPhase + 1).map((phase, index) => (
          <Card key={phase.id} className="animate-scale-in">
            <CardHeader className="pb-2">
              <CardTitle>{phase.name}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{phase.duration} days</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {currentPhase >= ELIMINATION_PHASES.length - 1 && (
          <div className="bg-accent/50 p-4 rounded-lg border animate-scale-in">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-primary mr-2" />
              <div>
                <h3 className="font-medium">Congratulations!</h3>
                <p className="text-sm text-muted-foreground">
                  You've completed all phases of the elimination diet. Continue monitoring your pet's diet and symptoms to maintain their health.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EliminationDiet;
