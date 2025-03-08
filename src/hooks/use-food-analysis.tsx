
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AnalysisResult = {
  overall_quality_score: number;
  safety_score: number;
  nutritional_profile: {
    protein_quality: string;
    fat_quality: string;
    carbohydrate_quality: string;
    fiber_content: string;
    vitamin_mineral_balance: string;
  };
  nutritional_benefits: string[];
  problematic_ingredients: Array<{
    name: string;
    reason: string;
    severity: string;
  }>;
  allergy_warnings: string[];
  digestibility: string;
  suitable_for: string[];
  artificial_additives: string[];
  suggestions: string[];
  summary: string;
};

export type AnalysisHistoryItem = {
  id: string;
  ingredients: string[];
  timestamp: string;
  analysis: AnalysisResult;
};

export function useFoodAnalysis() {
  const [ingredientsList, setIngredientsList] = useState("");
  const [analyzingIngredients, setAnalyzingIngredients] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const { toast } = useToast();

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('foodAnalysisHistory');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing analysis history:", error);
      }
    }
  }, []);

  // Save analysis history to localStorage whenever it changes
  useEffect(() => {
    if (analysisHistory.length > 0) {
      localStorage.setItem('foodAnalysisHistory', JSON.stringify(analysisHistory));
    }
  }, [analysisHistory]);

  const analyzeIngredients = async () => {
    if (!ingredientsList.trim()) {
      toast({
        title: "No ingredients provided",
        description: "Please enter ingredients to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzingIngredients(true);
    setAnalysisResult(null);

    try {
      // Split the ingredients by commas
      const ingredients = ingredientsList
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Call the analyze-food edge function
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { ingredients, petAllergies: [] },
      });

      if (error) {
        throw error;
      }

      if (data.analysis) {
        setAnalysisResult(data.analysis as AnalysisResult);
        
        // Add to history
        const historyItem: AnalysisHistoryItem = {
          id: Date.now().toString(),
          ingredients,
          timestamp: data.timestamp || new Date().toISOString(),
          analysis: data.analysis as AnalysisResult
        };
        
        setAnalysisHistory(prev => [historyItem, ...prev].slice(0, 10));
      }
    } catch (error: any) {
      console.error("Error analyzing ingredients:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze ingredients",
        variant: "destructive",
      });
    } finally {
      setAnalyzingIngredients(false);
    }
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('foodAnalysisHistory');
    toast({
      title: "History cleared",
      description: "Analysis history has been cleared",
    });
  };

  const selectHistoryItem = (item: AnalysisHistoryItem) => {
    setAnalysisResult(item.analysis);
    setIngredientsList(item.ingredients.join(', '));
  };

  return {
    ingredientsList,
    setIngredientsList,
    analyzingIngredients,
    analysisResult,
    analysisHistory,
    analyzeIngredients,
    clearHistory,
    selectHistoryItem
  };
}
