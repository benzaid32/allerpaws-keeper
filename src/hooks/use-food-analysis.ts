
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FoodAnalysisResult {
  summary: string;
  overall_quality_score: number;
  safety_score: number;
  nutritional_benefits?: string[];
  problematic_ingredients?: Array<{
    name: string;
    reason: string;
  }>;
}

export const useFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeFood = async (ingredients: string[]) => {
    if (!ingredients || ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "This food entry doesn't have any ingredients to analyze",
        variant: "default",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Call the Supabase Edge Function to analyze the food
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { 
          ingredients,
          petAllergies: [] // We could fetch pet allergies here if needed
        }
      });
      
      if (error) {
        console.error("Error analyzing food:", error);
        throw error;
      }
      
      console.log("Food analysis result:", data);
      setFoodAnalysis(data.analysis);
      
      toast({
        title: "Analysis complete",
        description: "Food has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error in food analysis:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze food ingredients",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeFood,
    isAnalyzing,
    foodAnalysis
  };
};
