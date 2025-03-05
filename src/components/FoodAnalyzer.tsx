
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FoodAnalyzerProps {
  petId: string;
  petName: string;
}

interface AnalysisResult {
  safe: boolean;
  allergens_found: string[];
  ingredients_analyzed: number;
  timestamp: string;
}

const FoodAnalyzer: React.FC<FoodAnalyzerProps> = ({ petId, petName }) => {
  const [ingredients, setIngredients] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "No ingredients provided",
        description: "Please enter the food ingredients to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      setAnalyzing(true);
      
      // Parse ingredients from text area (split by commas or new lines)
      const ingredientsList = ingredients
        .split(/[,\n]/)
        .map(i => i.trim())
        .filter(i => i !== "");
      
      // Call the edge function to analyze the ingredients
      const { data, error } = await supabase.functions.invoke("analyze-ingredients", {
        body: {
          ingredients: ingredientsList,
          petId,
        },
      });
      
      if (error) throw error;
      
      setResult(data as AnalysisResult);
    } catch (error: any) {
      console.error("Error analyzing ingredients:", error.message);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze ingredients",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Ingredient Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-4">
            <Alert variant={result.safe ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.safe ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <AlertTitle>
                  {result.safe
                    ? "Food appears to be safe"
                    : "Potential allergens detected"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.safe ? (
                  <p>
                    None of {petName}'s known allergens were found in the ingredients. 
                    Always monitor for new reactions.
                  </p>
                ) : (
                  <div>
                    <p>The following allergens were found:</p>
                    <ul className="list-disc ml-5 mt-2">
                      {result.allergens_found.map((allergen) => (
                        <li key={allergen} className="capitalize">{allergen}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-sm mt-3 text-muted-foreground">
                  Analyzed {result.ingredients_analyzed} ingredients at{" "}
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </AlertDescription>
            </Alert>
            
            <Button variant="outline" onClick={resetAnalysis} className="w-full">
              Analyze Another Food
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the ingredients list from your pet food to check for potential allergens.
            </p>
            <Textarea
              placeholder="Paste ingredients here, separated by commas or new lines..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="min-h-32"
            />
          </div>
        )}
      </CardContent>
      {!result && (
        <CardFooter>
          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing || !ingredients.trim()} 
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              `Analyze for ${petName}`
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FoodAnalyzer;
