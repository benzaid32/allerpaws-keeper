import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Info, 
  ArrowRight, 
  ArrowLeft, 
  ListChecks, 
  Clipboard, 
  CheckCircle,
  Clock,
  CalendarDays,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ELIMINATION_PHASES } from "@/lib/constants";
import { getLocalStorage, setLocalStorage } from "@/lib/helpers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Illustration from "@/components/ui/illustration";
import PatternBackground from "@/components/ui/pattern-background";
import FeaturedImage from "@/components/ui/featured-image";

const EliminationDiet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePhaseId, setActivePhaseId] = useState("1");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [daysInCurrentPhase, setDaysInCurrentPhase] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  
  const activePhase = ELIMINATION_PHASES.find(phase => phase.id === activePhaseId);

  // Load data from local storage
  useEffect(() => {
    try {
      // Load elimination diet start date
      const savedStartDate = getLocalStorage<string | null>("eliminationStartDate", null);
      
      if (savedStartDate) {
        setStartDate(savedStartDate);
        setShowProgress(true);
        
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
        setActivePhaseId((phase + 1).toString());
      }
    } catch (error) {
      console.error("Error loading elimination diet data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset the elimination diet
  const resetEliminationDiet = () => {
    const today = new Date().toISOString();
    setStartDate(today);
    setCurrentPhase(0);
    setTotalDays(0);
    setDaysInCurrentPhase(0);
    setActivePhaseId("1");
    setLocalStorage("eliminationStartDate", today);
    
    toast({
      title: "Elimination Diet Reset",
      description: "Your elimination diet plan has been reset to day one",
    });
  };

  // Start the elimination diet
  const startEliminationDiet = () => {
    const today = new Date().toISOString();
    setStartDate(today);
    setCurrentPhase(0);
    setTotalDays(0);
    setDaysInCurrentPhase(0);
    setActivePhaseId("1");
    setLocalStorage("eliminationStartDate", today);
    setShowProgress(true);
    
    toast({
      title: "Elimination Diet Started",
      description: "Your elimination diet plan has been started",
    });
  };

  // Format a date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate the total progress through all phases
  const calculateTotalProgress = () => {
    const totalDuration = ELIMINATION_PHASES.reduce((acc, phase) => acc + Number(phase.duration), 0);
    const phasesCompletedDuration = ELIMINATION_PHASES.slice(0, currentPhase).reduce((acc, phase) => acc + Number(phase.duration), 0);
    const progressInCurrentPhase = daysInCurrentPhase;
    const totalProgress = ((phasesCompletedDuration + progressInCurrentPhase) / totalDuration) * 100;
    return Math.min(totalProgress, 100);
  };

  // Calculate progress in the current phase
  const calculatePhaseProgress = () => {
    const currentPhaseDuration = Number(ELIMINATION_PHASES[currentPhase].duration);
    return Math.min((daysInCurrentPhase / currentPhaseDuration) * 100, 100);
  };

  if (loading) {
    return (
      <MobileLayout title="Elimination Diet">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title="Elimination Diet" 
      showBackButton={true}
      onBack={() => navigate("/dashboard")}
    >
      <PatternBackground color="primary">
        <div className="space-y-4">
          {/* Toggle between Guide and Progress */}
          <div className="flex rounded-lg overflow-hidden border mb-2">
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                showGuide ? "bg-primary text-primary-foreground" : "bg-muted/30"
              }`}
              onClick={() => {
                setShowGuide(true);
                setShowProgress(false);
              }}
            >
              Guide
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${
                showProgress ? "bg-primary text-primary-foreground" : "bg-muted/30"
              }`}
              onClick={() => {
                setShowGuide(false);
                setShowProgress(true);
              }}
              disabled={!startDate}
            >
              My Progress
            </button>
          </div>

          {showGuide && (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                A step-by-step guide to identify your pet's food allergies through dietary management
              </div>

              {/* Featured Image - Before Starting */}
              <div className="mb-6">
                <FeaturedImage 
                  name="stressedOwner"
                  caption="Frustrated with Pet Allergies?"
                  description="Our elimination diet guide will help you identify the foods causing your pet's discomfort"
                  height={200}
                  animate={true}
                />
              </div>

              {/* Phase Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {ELIMINATION_PHASES.map((phase) => (
                  <div
                    key={phase.id}
                    onClick={() => setActivePhaseId(phase.id)}
                    className={`cursor-pointer rounded-lg p-3 transition-all ${
                      activePhaseId === phase.id 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-muted/50 hover:bg-muted/80"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm truncate">{phase.name}</div>
                      <div className="text-xs mt-1 opacity-80">{phase.duration} days</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phase Details */}
              {activePhase && (
                <MobileCard 
                  className="mb-4"
                  title={activePhase.name}
                  subtitle={activePhase.description}
                  rightContent={
                    <Badge variant="outline">{activePhase.duration} days</Badge>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium flex items-center mb-2">
                        <ListChecks className="h-4 w-4 mr-2 text-primary" />
                        Tips for this phase
                      </h3>
                      <ul className="space-y-2">
                        {activePhase.tips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start"
                          >
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              <span className="text-xs text-primary font-medium">{index + 1}</span>
                            </div>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium flex items-center mb-2">
                        <Clipboard className="h-4 w-4 mr-2 text-primary" />
                        Recommended Foods
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activePhase.recommendedFoods.map((food, index) => (
                          <Badge 
                            key={index}
                            className="bg-primary/10 hover:bg-primary/20 text-foreground" 
                            variant="secondary"
                          >
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </MobileCard>
              )}
              
              <MobileCard className="bg-primary/5 border-primary/10">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Important Note</h3>
                    <p className="text-sm text-muted-foreground">
                      Always consult with your veterinarian before starting an elimination diet. 
                      This guide is for informational purposes only and may need to be adjusted 
                      for your pet's specific health needs.
                    </p>
                  </div>
                </div>
              </MobileCard>
              
              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIndex = ELIMINATION_PHASES.findIndex(phase => phase.id === activePhaseId);
                    if (currentIndex > 0) {
                      setActivePhaseId(ELIMINATION_PHASES[currentIndex - 1].id);
                    }
                  }}
                  disabled={activePhaseId === "1"}
                >
                  Previous Phase
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentIndex = ELIMINATION_PHASES.findIndex(phase => phase.id === activePhaseId);
                    if (currentIndex < ELIMINATION_PHASES.length - 1) {
                      setActivePhaseId(ELIMINATION_PHASES[currentIndex + 1].id);
                    }
                  }}
                  disabled={activePhaseId === "4"}
                >
                  Next Phase
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {!startDate && (
                <div className="mt-8">
                  <Button 
                    className="w-full" 
                    onClick={startEliminationDiet}
                  >
                    Start Elimination Diet
                  </Button>
                </div>
              )}
            </>
          )}

          {showProgress && startDate && (
            <>
              {/* Progress Overview */}
              <MobileCard 
                className="mb-4"
                title="Diet Progress"
                subtitle={`Started on ${formatDateDisplay(startDate)} (${totalDays} days ago)`}
                icon={<CalendarDays className="h-5 w-5 text-primary" />}
              >
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

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetEliminationDiet}>
                      <RefreshCw className="mr-2 h-3.5 w-3.5" />
                      Reset Plan
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate("/food-diary")}
                    >
                      Log Food
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </MobileCard>

              {/* Before and After Comparison */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Your Journey</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FeaturedImage 
                      name="stressedOwner"
                      height={140}
                      rounded={true}
                      animate={false}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <FeaturedImage 
                      name="happyDogOwner"
                      height={140}
                      rounded={true}
                      animate={false}
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Goal
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Stay consistent with your elimination diet to help your pet feel better!
                </p>
              </div>

              {/* Current Phase Card */}
              <MobileCard 
                className="mb-4 bg-primary/5"
                title={ELIMINATION_PHASES[currentPhase].name}
                subtitle={ELIMINATION_PHASES[currentPhase].description}
              >
                <div className="space-y-4">
                  <Badge className="bg-primary text-primary-foreground mb-2">Current Phase</Badge>
                  
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

                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{ELIMINATION_PHASES[currentPhase].duration} days total duration</span>
                  </div>
                </div>
              </MobileCard>

              {/* Upcoming Phases */}
              {ELIMINATION_PHASES.slice(currentPhase + 1).length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-medium">Upcoming Phases</h2>
                  
                  {ELIMINATION_PHASES.slice(currentPhase + 1).map((phase, index) => (
                    <MobileCard 
                      key={phase.id}
                      title={phase.name}
                      subtitle={phase.description}
                      className="mb-2"
                    >
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{phase.duration} days</span>
                      </div>
                    </MobileCard>
                  ))}
                </div>
              )}
              
              {currentPhase >= ELIMINATION_PHASES.length - 1 && (
                <MobileCard className="bg-accent/50 border-accent">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Congratulations!</h3>
                      <p className="text-sm text-muted-foreground">
                        You've completed all phases of the elimination diet. Continue monitoring your pet's diet and symptoms to maintain their health.
                      </p>
                    </div>
                  </div>
                </MobileCard>
              )}

              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowGuide(true);
                    setShowProgress(false);
                  }}
                >
                  View Diet Guide
                </Button>
              </div>
            </>
          )}
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default EliminationDiet;
