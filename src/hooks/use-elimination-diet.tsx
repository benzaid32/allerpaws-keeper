
import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/helpers';
import { useToast } from '@/hooks/use-toast';
import { ELIMINATION_PHASES } from '@/lib/constants';

export const useEliminationDiet = () => {
  const { toast } = useToast();
  const [activePhaseId, setActivePhaseId] = useState("1");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [daysInCurrentPhase, setDaysInCurrentPhase] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [showProgress, setShowProgress] = useState(false);

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

  return {
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
    phases: ELIMINATION_PHASES
  };
};
