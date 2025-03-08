
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ArrowRight } from "lucide-react";
import MobileCard from "@/components/ui/mobile-card";
import { ListChecks, Clipboard } from "lucide-react";
import FeaturedImage from "@/components/ui/featured-image";
import { EliminationPhase } from "@/lib/types";

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

  return (
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
        {phases.map((phase) => (
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
                {activePhase.recommendedFoods?.map((food, index) => (
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
  );
};

export default DietGuide;
