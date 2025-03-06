
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clipboard, Info, ArrowRight, ListChecks } from "lucide-react";
import { motion } from "framer-motion";

const ELIMINATION_PHASES = [
  {
    id: "1",
    name: "Elimination Phase",
    description: "Remove common allergens from your pet's diet",
    duration: "4-6 weeks",
    tips: [
      "Feed your pet a simple diet with novel protein",
      "Remove all treats and supplements temporarily",
      "Keep a detailed food diary",
      "Monitor symptoms closely"
    ],
    recommendedFoods: [
      "Hydrolyzed protein diets",
      "Limited ingredient foods",
      "Novel protein sources (venison, duck, rabbit)"
    ]
  },
  {
    id: "2",
    name: "Stabilization Phase",
    description: "Continue with successful diet to ensure symptoms resolve",
    duration: "2-4 weeks",
    tips: [
      "Continue with the elimination diet",
      "Look for complete symptom resolution",
      "Maintain consistent feeding",
      "Start planning for challenges"
    ],
    recommendedFoods: [
      "Continue with successful elimination diet",
      "Maintain consistent protein source",
      "Keep treats limited to same protein source"
    ]
  },
  {
    id: "3",
    name: "Challenge Phase",
    description: "Carefully reintroduce potential allergens",
    duration: "6-8 weeks",
    tips: [
      "Introduce one new ingredient at a time",
      "Wait 1-2 weeks between new foods",
      "Document any reactions promptly",
      "Stop if symptoms reappear"
    ],
    recommendedFoods: [
      "Same base diet plus test ingredient",
      "Single-ingredient treats for testing",
      "Carefully selected commercial foods"
    ]
  },
  {
    id: "4",
    name: "Maintenance Phase",
    description: "Long-term diet planning based on results",
    duration: "Ongoing",
    tips: [
      "Create a personalized safe food list",
      "Establish a long-term feeding plan",
      "Set up regular vet check-ups",
      "Maintain a symptom journal"
    ],
    recommendedFoods: [
      "Customized diet avoiding trigger ingredients",
      "Balanced commercial foods without allergens",
      "Rotation diet if tolerated"
    ]
  }
];

const EliminationDiet = () => {
  const navigate = useNavigate();
  const [activePhaseId, setActivePhaseId] = useState("1");
  
  const activePhase = ELIMINATION_PHASES.find(phase => phase.id === activePhaseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1594149937478-a8c7a34d9d4a?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      
      <div className="container relative pb-20 pt-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">Elimination Diet Guide</h1>
        </div>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 text-muted-foreground"
        >
          <p>A step-by-step guide to identify your pet's food allergies through dietary management</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-2 mb-6 overflow-x-auto px-1 py-2 no-scrollbar">
          {ELIMINATION_PHASES.map((phase) => (
            <motion.div
              key={phase.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActivePhaseId(phase.id)}
              className={`cursor-pointer rounded-lg p-3 transition-all ${
                activePhaseId === phase.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-muted/50 hover:bg-muted/80"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-sm truncate">{phase.name}</div>
                <div className="text-xs mt-1 opacity-80">{phase.duration}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {activePhase && (
          <motion.div
            key={activePhase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-md bg-card/80 backdrop-blur-sm mb-4">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{activePhase.name}</CardTitle>
                  <Badge variant="outline">{activePhase.duration}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{activePhase.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <ListChecks className="h-4 w-4 mr-2 text-primary" />
                      Tips for this phase
                    </h3>
                    <ul className="space-y-2">
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
                  
                  <div>
                    <h3 className="text-sm font-medium flex items-center mb-2">
                      <Clipboard className="h-4 w-4 mr-2 text-primary" />
                      Recommended Foods
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activePhase.recommendedFoods.map((food, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge 
                            className="bg-primary/10 hover:bg-primary/20 text-primary-foreground" 
                            variant="secondary"
                          >
                            {food}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
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
            </div>
          </motion.div>
        )}
        
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
      </div>
      <BottomNavigation />
    </div>
  );
};

export default EliminationDiet;
