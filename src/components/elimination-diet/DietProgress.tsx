
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  CheckCircle,
  Clock,
  CalendarDays,
  RefreshCw
} from "lucide-react";
import MobileCard from "@/components/ui/mobile-card";
import FeaturedImage from "@/components/ui/featured-image";
import { EliminationPhase } from "@/lib/types";

interface DietProgressProps {
  startDate: string | null;
  totalDays: number;
  currentPhase: number;
  daysInCurrentPhase: number;
  resetEliminationDiet: () => void;
  setShowGuide: (show: boolean) => void;
  setShowProgress: (show: boolean) => void;
  phases: EliminationPhase[];
}

const DietProgress: React.FC<DietProgressProps> = ({
  startDate,
  totalDays,
  currentPhase,
  daysInCurrentPhase,
  resetEliminationDiet,
  setShowGuide,
  setShowProgress,
  phases
}) => {
  const navigate = useNavigate();

  // Format a date for display
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate the total progress through all phases
  const calculateTotalProgress = () => {
    const totalDuration = phases.reduce((acc, phase) => acc + Number(phase.duration), 0);
    const phasesCompletedDuration = phases.slice(0, currentPhase).reduce((acc, phase) => acc + Number(phase.duration), 0);
    const progressInCurrentPhase = daysInCurrentPhase;
    const totalProgress = ((phasesCompletedDuration + progressInCurrentPhase) / totalDuration) * 100;
    return Math.min(totalProgress, 100);
  };

  // Calculate progress in the current phase
  const calculatePhaseProgress = () => {
    const currentPhaseDuration = Number(phases[currentPhase]?.duration || 0);
    return Math.min((daysInCurrentPhase / currentPhaseDuration) * 100, 100);
  };

  return (
    <>
      {/* Progress Overview */}
      <MobileCard 
        className="mb-4"
        title="Diet Progress"
        subtitle={`Started on ${startDate ? formatDateDisplay(startDate) : ''} (${totalDays} days ago)`}
        icon={<CalendarDays className="h-5 w-5 text-primary" />}
      >
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">
                Phase {currentPhase + 1}/{phases.length}
              </span>
            </div>
            <Progress value={calculateTotalProgress()} className="h-2" />
          </div>
          
          {/* Current Phase Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Phase</span>
              <span className="font-medium">
                Day {daysInCurrentPhase}/{phases[currentPhase]?.duration}
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
        title={phases[currentPhase]?.name || ''}
        subtitle={phases[currentPhase]?.description || ''}
      >
        <div className="space-y-4">
          <Badge className="bg-primary text-primary-foreground mb-2">Current Phase</Badge>
          
          <div className="bg-background rounded-lg p-3 border">
            <h3 className="text-sm font-medium mb-2">Key Tips</h3>
            <ul className="space-y-2">
              {phases[currentPhase]?.tips.map((tip, index) => (
                <li key={index} className="flex text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
            <span>{phases[currentPhase]?.duration} days total duration</span>
          </div>
        </div>
      </MobileCard>

      {/* Upcoming Phases */}
      {phases.slice(currentPhase + 1).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Upcoming Phases</h2>
          
          {phases.slice(currentPhase + 1).map((phase) => (
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
      
      {currentPhase >= phases.length - 1 && (
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
  );
};

export default DietProgress;
