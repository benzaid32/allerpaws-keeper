
import React from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface FoodAnalysisButtonProps {
  hasIngredients: boolean;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const FoodAnalysisButton = ({ 
  hasIngredients, 
  isAnalyzing, 
  onAnalyze 
}: FoodAnalysisButtonProps) => {
  if (!hasIngredients) return null;
  
  return (
    <Button 
      className="w-full" 
      variant="outline"
      onClick={onAnalyze}
      disabled={isAnalyzing}
    >
      {isAnalyzing ? (
        <>
          <LoadingSpinner className="h-4 w-4 mr-2" />
          Analyzing Food...
        </>
      ) : (
        <>
          <Zap className="h-4 w-4 mr-2" />
          Analyze with AI
        </>
      )}
    </Button>
  );
};

export default FoodAnalysisButton;
