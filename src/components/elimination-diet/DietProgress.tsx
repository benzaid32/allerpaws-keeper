
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
  RefreshCw,
  ChevronRight,
  Utensils
} from "lucide-react";
import MobileCard from "@/components/ui/mobile-card";
import { Card, CardContent } from "@/components/ui/card";
import { EliminationPhase } from "@/lib/types";
import { motion } from "framer-motion";

interface DietProgressProps {
  startDate: string | null;
  totalDays: number;
  currentPhase: number;
  daysInCurrentPhase: number;
  resetEliminationDiet: () => void;
  phases: EliminationPhase[];
}

const DietProgress: React.FC<DietProgressProps> = ({
  startDate,
  totalDays,
  currentPhase,
  daysInCurrentPhase,
  resetEliminationDiet,
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
    <div className="space-y-6">
      {/* After AllerPaws Hero Section */}
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src="/lovable-uploads/68ef26e3-9523-4fc3-986f-7f4689a30bdb.png" 
              alt="After using AllerPaws" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-bold mb-1">After AllerPaws</h2>
              <p className="text-white/90 text-sm">
                Simple, effective pet care with clear results and happy pets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <MobileCard 
        className="mb-4 border-primary/20 shadow-md"
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
            <Progress value={calculateTotalProgress()} className="h-2.5 bg-primary/10" />
            
            {/* Progress percentage */}
            <div className="text-right text-xs text-muted-foreground">
              {Math.round(calculateTotalProgress())}% complete
            </div>
          </div>
          
          {/* Current Phase Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Phase</span>
              <span className="font-medium">
                Day {daysInCurrentPhase}/{phases[currentPhase]?.duration}
              </span>
            </div>
            <Progress value={calculatePhaseProgress()} className="h-2.5 bg-primary/10" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="sm" onClick={resetEliminationDiet} className="text-red-500 border-red-200 hover:bg-red-50">
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Reset Plan
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/food-diary")}
              className="border-primary/30 text-primary"
            >
              Food Diary
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </MobileCard>

      {/* Current Phase Card */}
      <MobileCard 
        className="mb-4 bg-primary/5 border-primary/20 shadow-sm"
        title={phases[currentPhase]?.name || ''}
        subtitle={phases[currentPhase]?.description || ''}
      >
        <div className="space-y-4">
          <Badge className="bg-primary text-primary-foreground mb-2">Current Phase</Badge>
          
          <div className="bg-background rounded-lg p-3 border shadow-sm">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Utensils className="h-4 w-4 mr-1.5 text-primary" />
              Key Tips
            </h3>
            <ul className="space-y-2.5">
              {phases[currentPhase]?.tips.map((tip, index) => (
                <motion.li 
                  key={index} 
                  className="flex text-sm"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-sm p-2">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{phases[currentPhase]?.duration} days total</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary text-xs p-1 h-auto"
              onClick={() => navigate("/food-database")}
            >
              Find Safe Foods
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </MobileCard>

      {/* Next Up Section */}
      {currentPhase < phases.length - 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center">
            <span className="mr-2">Coming Up Next</span>
            <div className="h-px flex-grow bg-primary/20"></div>
          </h2>
          
          <MobileCard 
            key={phases[currentPhase + 1].id}
            title={phases[currentPhase + 1].name}
            subtitle={phases[currentPhase + 1].description}
            className="mb-2 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{phases[currentPhase + 1].duration} days</span>
              </div>
              
              <Badge variant="outline" className="bg-primary/5">
                Up Next
              </Badge>
            </div>
          </MobileCard>
        </div>
      )}
      
      {/* Future Phases (if more than one left) */}
      {phases.slice(currentPhase + 2).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold flex items-center">
            <span className="mr-2">Future Phases</span>
            <div className="h-px flex-grow bg-primary/20"></div>
          </h2>
          
          {phases.slice(currentPhase + 2).map((phase) => (
            <MobileCard 
              key={phase.id}
              title={phase.name}
              subtitle={phase.description}
              className="mb-2 opacity-80 hover:opacity-100 transition-opacity"
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
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-green-700">Congratulations!</h3>
                <p className="text-sm text-green-700/80">
                  You've completed all phases of the elimination diet. Continue monitoring your pet's diet and symptoms to maintain their health.
                </p>
                <Button 
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                  onClick={() => navigate("/food-diary")}
                >
                  Continue Food Tracking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/symptom-diary")}
        >
          Track Symptoms
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-primary/30 text-primary"
          onClick={() => navigate("/food-database")}
        >
          Browse Food Database
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DietProgress;
