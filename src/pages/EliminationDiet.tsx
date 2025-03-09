
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DietGuide from "@/components/elimination-diet/DietGuide";
import DietProgress from "@/components/elimination-diet/DietProgress";
import { useEliminationDiet } from "@/hooks/use-elimination-diet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const EliminationDiet = () => {
  const navigate = useNavigate();
  const {
    activePhaseId,
    setActivePhaseId,
    startDate,
    currentPhase,
    totalDays,
    daysInCurrentPhase,
    loading,
    resetEliminationDiet,
    startEliminationDiet,
    phases
  } = useEliminationDiet();

  if (loading) {
    return (
      <MobileLayout title="Elimination Diet">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MobileLayout>
    );
  }

  // Default tab is guide if not started, progress if already started
  const defaultTab = startDate ? "progress" : "guide";

  return (
    <MobileLayout 
      title="Elimination Diet" 
      showBackButton={true}
      onBack={() => navigate("/dashboard")}
    >
      <PatternBackground color="primary">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="guide" className="text-sm">Diet Guide</TabsTrigger>
              <TabsTrigger value="progress" className="text-sm" disabled={!startDate}>My Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="mt-0">
              <DietGuide
                activePhaseId={activePhaseId}
                setActivePhaseId={setActivePhaseId}
                startDate={startDate}
                startEliminationDiet={startEliminationDiet}
                phases={phases}
              />
            </TabsContent>
            
            <TabsContent value="progress" className="mt-0">
              {startDate && (
                <DietProgress
                  startDate={startDate}
                  totalDays={totalDays}
                  currentPhase={currentPhase}
                  daysInCurrentPhase={daysInCurrentPhase}
                  resetEliminationDiet={resetEliminationDiet}
                  phases={phases}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default EliminationDiet;
