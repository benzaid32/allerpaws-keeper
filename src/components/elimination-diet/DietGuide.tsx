
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import MobileCard from "@/components/ui/mobile-card";
import { ListChecks, Clipboard, DogBowl } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EliminationPhase } from "@/lib/types";
import { motion } from "framer-motion";

interface DietGuideProps {
  activePhaseId: string;
  setActivePhaseId: (id: string) => void;
  startDate: string | null;
  startEliminationDiet: () => void;
  phases: EliminationPhase[];
}

const DietGuide: React.FC<DietGuideProps> = ({
  activePhaseId,
  setActivePhaseId,
  startDate,
  startEliminationDiet,
  phases,
}) => {
  const activePhase = phases.find(phase => phase.id === activePhaseId);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Before AllerPaws Hero Section */}
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src="/lovable-uploads/3f152bae-38a8-483c-ab51-86be82a183ac.png" 
              alt="Before using AllerPaws" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-bold mb-1">Before AllerPaws</h2>
              <p className="text-white/90 text-sm">
                Frustration with complicated elimination diets and uncertain results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <h3 className="text-xl font-bold text-primary">Transform Your Pet's Diet</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Our step-by-step elimination diet identifies food allergies with confidence
        </p>
      </div>
      
      {/* Phase Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {phases.map((phase) => (
          <motion.div
            key={phase.id}
            onClick={() => setActivePhaseId(phase.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          </motion.div>
        ))}
      </div>

      {/* Phase Details */}
      {activePhase && (
        <MobileCard 
          className="mb-4"
          title={activePhase.name}
          subtitle={activePhase.description}
          rightContent={
            <Badge variant="outline" className="bg-primary/10 text-primary">{activePhase.duration} days</Badge>
          }
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <ListChecks className="h-4 w-4 mr-2 text-primary" />
                Tips for this phase
              </h3>
              <ul className="space-y-2.5">
                {activePhase.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs text-primary font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {activePhase.recommendedFoods && (
              <div>
                <h3 className="text-sm font-medium flex items-center mb-2">
                  <DogBowl className="h-4 w-4 mr-2 text-primary" />
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
            )}
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
            const currentIndex = phases.findIndex(phase => phase.id === activePhaseId);
            if (currentIndex > 0) {
              setActivePhaseId(phases[currentIndex - 1].id);
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
            const currentIndex = phases.findIndex(phase => phase.id === activePhaseId);
            if (currentIndex < phases.length - 1) {
              setActivePhaseId(phases[currentIndex + 1].id);
            }
          }}
          disabled={activePhaseId === "4"}
        >
          Next Phase
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {!startDate && (
        <div className="flex flex-col space-y-4 mt-8">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md" 
            onClick={startEliminationDiet}
          >
            Start Elimination Diet
          </Button>
          
          <Button
            variant="outline"
            className="w-full" 
            onClick={() => navigate("/food-diary")}
          >
            View Food Diary
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DietGuide;
