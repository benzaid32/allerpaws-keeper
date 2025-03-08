
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FoodAnalysisResult {
  summary: string;
  overall_quality_score: number;
  safety_score: number;
  nutritional_benefits?: string[];
  problematic_ingredients?: Array<{
    name: string;
    reason: string;
    severity?: "low" | "medium" | "high";
  }>;
  nutritional_profile?: {
    protein_quality: "low" | "medium" | "high";
    fat_quality: "low" | "medium" | "high";
    carbohydrate_quality: "low" | "medium" | "high";
    fiber_content: string;
    vitamin_mineral_balance: string;
  };
  allergy_warnings?: string[];
  digestibility?: string;
  suitable_for?: string[];
  suggestions?: string[];
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  ingredients: string;
  analysis: FoodAnalysisResult;
}

// Store analysis history in localStorage
const STORAGE_KEY = "food_analysis_history";

// Basic hook for food entry analysis
export const useFoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysisResult | null>(null);
  const { toast } = useToast();

  // For the AnalyzeTab component
  const [ingredientsList, setIngredientsList] = useState<string>("");
  const [analysisHistory, setAnalysisHistory] = useState<Array<AnalysisHistoryItem>>([]);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setAnalysisHistory(parsed);
      } catch (error) {
        console.error("Error parsing analysis history:", error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (history: AnalysisHistoryItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    setAnalysisHistory(history);
  };

  // Analyze food ingredients for a food entry
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

  // Analyze ingredients from text input (for AnalyzeTab)
  const analyzeIngredients = async () => {
    if (!ingredientsList.trim()) {
      toast({
        title: "No ingredients",
        description: "Please enter ingredients to analyze",
        variant: "default",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Convert ingredients string to array
      const ingredientsArray = ingredientsList
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Call the Supabase Edge Function to analyze the ingredients
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { 
          ingredients: ingredientsArray,
          petAllergies: [] // Could be fetched from pet profiles
        }
      });
      
      if (error) {
        console.error("Error analyzing ingredients:", error);
        throw error;
      }
      
      console.log("Ingredients analysis result:", data);
      
      const analysisResult = data.analysis;
      setFoodAnalysis(analysisResult);
      
      // Add to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ingredients: ingredientsList,
        analysis: analysisResult
      };
      
      const updatedHistory = [newHistoryItem, ...analysisHistory].slice(0, 10); // Keep last 10 analyses
      saveHistory(updatedHistory);
      
      toast({
        title: "Analysis complete",
        description: "Ingredients have been analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing ingredients:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze ingredients",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear analysis history
  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnalysisHistory([]);
    toast({
      title: "History cleared",
      description: "Analysis history has been cleared",
    });
  };

  // Select a history item to view
  const selectHistoryItem = (historyItem: AnalysisHistoryItem) => {
    setFoodAnalysis(historyItem.analysis);
    setIngredientsList(historyItem.ingredients);
    toast({
      title: "Analysis loaded",
      description: "Previous analysis has been loaded",
    });
  };

  return {
    // Basic food analysis for FoodEntry
    analyzeFood,
    isAnalyzing,
    foodAnalysis,
    
    // Extended functionality for AnalyzeTab
    ingredientsList,
    setIngredientsList,
    analyzeIngredients,
    analysisHistory,
    clearHistory,
    selectHistoryItem,
    
    // Alias for AnalyzeTab to match existing code
    analysisResult: foodAnalysis,
  };
};
