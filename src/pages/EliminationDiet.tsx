
import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import DietGuide from "@/components/elimination-diet/DietGuide";
import DietProgress from "@/components/elimination-diet/DietProgress";
import { useEliminationDiet } from "@/hooks/use-elimination-diet";

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
    showGuide,
    setShowGuide,
    showProgress,
    setShowProgress,
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
            <DietGuide
              activePhaseId={activePhaseId}
              setActivePhaseId={setActivePhaseId}
              startDate={startDate}
              startEliminationDiet={startEliminationDiet}
              phases={phases}
            />
          )}

          {showProgress && startDate && (
            <DietProgress
              startDate={startDate}
              totalDays={totalDays}
              currentPhase={currentPhase}
              daysInCurrentPhase={daysInCurrentPhase}
              resetEliminationDiet={resetEliminationDiet}
              setShowGuide={setShowGuide}
              setShowProgress={setShowProgress}
              phases={phases}
            />
          )}
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default EliminationDiet;
