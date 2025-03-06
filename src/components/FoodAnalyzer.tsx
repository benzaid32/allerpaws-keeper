
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Info, Star, StarHalf, StarOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FoodAnalyzerProps {
  petId: string;
  petName: string;
}

interface SimpleAnalysisResult {
  safe: boolean;
  allergens_found: string[];
  ingredients_analyzed: number;
  timestamp: string;
}

interface DetailedAnalysisResult {
  overall_quality: "high" | "medium" | "low";
  nutritional_benefits: string[];
  problematic_ingredients: Array<{name: string, reason: string}>;
  allergy_warnings: string[];
  suggestions: string[];
  summary: string;
  raw_analysis?: string;
}

interface AnalysisResponse {
  analysis: DetailedAnalysisResult;
  timestamp: string;
}

const FoodAnalyzer: React.FC<FoodAnalyzerProps> = ({ petId, petName }) => {
  const [ingredients, setIngredients] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [simpleResult, setSimpleResult] = useState<SimpleAnalysisResult | null>(null);
  const [detailedResult, setDetailedResult] = useState<DetailedAnalysisResult | null>(null);
  const [petAllergies, setPetAllergies] = useState<string[]>([]);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("simple");

  useEffect(() => {
    if (petId) {
      const fetchAllergies = async () => {
        try {
          const { data, error } = await supabase
            .from("allergies")
            .select("name")
            .eq("pet_id", petId);
            
          if (error) throw error;
          
          setPetAllergies(data.map(a => a.name));
        } catch (error: any) {
          console.error("Error fetching pet allergies:", error.message);
        }
      };
      
      fetchAllergies();
    }
  }, [petId]);

  const handleSimpleAnalyze = async () => {
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
      setActiveTab("simple");
      
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
      
      setSimpleResult(data as SimpleAnalysisResult);
      setDetailedResult(null);
    } catch (error: any) {
      console.error("Error analyzing ingredients:", error.message);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze ingredients",
        variant: "destructive",
      });
      setSimpleResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDetailedAnalyze = async () => {
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
      setActiveTab("detailed");
      
      // Parse ingredients from text area (split by commas or new lines)
      const ingredientsList = ingredients
        .split(/[,\n]/)
        .map(i => i.trim())
        .filter(i => i !== "");
      
      // Call the GPT-powered edge function to analyze the ingredients
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: {
          ingredients: ingredientsList,
          petAllergies,
        },
      });
      
      if (error) throw error;
      
      const response = data as AnalysisResponse;
      setDetailedResult(response.analysis);
      
      // Also do a simple analysis for comparison
      const { data: simpleData, error: simpleError } = await supabase.functions.invoke("analyze-ingredients", {
        body: {
          ingredients: ingredientsList,
          petId,
        },
      });
      
      if (!simpleError) {
        setSimpleResult(simpleData as SimpleAnalysisResult);
      }
      
    } catch (error: any) {
      console.error("Error in detailed analysis:", error.message);
      toast({
        title: "Advanced analysis failed",
        description: error.message || "Could not perform detailed analysis",
        variant: "destructive",
      });
      setDetailedResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSimpleResult(null);
    setDetailedResult(null);
  };

  const renderQualityStars = (quality: string) => {
    switch(quality) {
      case "high":
        return (
          <div className="flex text-yellow-500">
            <Star className="fill-current h-5 w-5" />
            <Star className="fill-current h-5 w-5" />
            <Star className="fill-current h-5 w-5" />
          </div>
        );
      case "medium":
        return (
          <div className="flex text-yellow-500">
            <Star className="fill-current h-5 w-5" />
            <Star className="fill-current h-5 w-5" />
            <StarOff className="h-5 w-5" />
          </div>
        );
      case "low":
        return (
          <div className="flex text-yellow-500">
            <Star className="fill-current h-5 w-5" />
            <StarOff className="h-5 w-5" />
            <StarOff className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex text-gray-400">
            <StarOff className="h-5 w-5" />
            <StarOff className="h-5 w-5" />
            <StarOff className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Food Ingredient Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        {(simpleResult || detailedResult) ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">Basic Analysis</TabsTrigger>
              <TabsTrigger value="detailed" disabled={!detailedResult}>Advanced Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simple" className="space-y-4">
              {simpleResult && (
                <Alert variant={simpleResult.safe ? "default" : "destructive"}>
                  <div className="flex items-center gap-2">
                    {simpleResult.safe ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                    <AlertTitle>
                      {simpleResult.safe
                        ? "Food appears to be safe"
                        : "Potential allergens detected"}
                    </AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    {simpleResult.safe ? (
                      <p>
                        None of {petName}'s known allergens were found in the ingredients. 
                        Always monitor for new reactions.
                      </p>
                    ) : (
                      <div>
                        <p>The following allergens were found:</p>
                        <ul className="list-disc ml-5 mt-2">
                          {simpleResult.allergens_found.map((allergen) => (
                            <li key={allergen} className="capitalize">{allergen}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm mt-3 text-muted-foreground">
                      Analyzed {simpleResult.ingredients_analyzed} ingredients at{" "}
                      {new Date(simpleResult.timestamp).toLocaleString()}
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="detailed" className="space-y-4">
              {detailedResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Overall Quality:</h3>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{detailedResult.overall_quality}</span>
                      {renderQualityStars(detailedResult.overall_quality)}
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-5 w-5" />
                    <AlertTitle>Summary</AlertTitle>
                    <AlertDescription>
                      {detailedResult.summary}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Nutritional Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {detailedResult.nutritional_benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="bg-green-50">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {detailedResult.problematic_ingredients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Problematic Ingredients:</h4>
                      <div className="space-y-2">
                        {detailedResult.problematic_ingredients.map((item, i) => (
                          <div key={i} className="bg-muted rounded-md p-3">
                            <span className="font-medium">{item.name}: </span>
                            <span className="text-muted-foreground">{item.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {detailedResult.allergy_warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Allergy Warnings:</h4>
                      <Alert variant="destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <AlertTitle>Potential Allergens</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc ml-5 mt-2">
                            {detailedResult.allergy_warnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {detailedResult.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="list-disc ml-5 space-y-1">
                        {detailedResult.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-muted-foreground">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the ingredients list from your pet food to check for potential allergens and get a nutritional analysis.
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
      {!(simpleResult || detailedResult) ? (
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            onClick={handleSimpleAnalyze} 
            disabled={analyzing || !ingredients.trim()} 
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              `Basic Allergen Analysis`
            )}
          </Button>
          <Button 
            onClick={handleDetailedAnalyze} 
            disabled={analyzing || !ingredients.trim()} 
            className="w-full"
            variant="outline"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              `Advanced AI Analysis`
            )}
          </Button>
        </CardFooter>
      ) : (
        <CardFooter>
          <Button variant="outline" onClick={resetAnalysis} className="w-full">
            Analyze Another Food
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FoodAnalyzer;
