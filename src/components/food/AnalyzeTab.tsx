
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Zap, History, Trash2 } from "lucide-react";
import { useFoodAnalysis, FoodAnalysisResult } from "@/hooks/use-food-analysis";
import FoodAnalysisHistory from "@/components/food/FoodAnalysisHistory";

const AnalyzeTab: React.FC = () => {
  const {
    ingredientsList,
    setIngredientsList,
    isAnalyzing,
    foodAnalysis,
    analysisHistory,
    analyzeIngredients,
    clearHistory,
    selectHistoryItem
  } = useFoodAnalysis();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Food Analysis
            </CardTitle>
            <CardDescription>
              Enter ingredients list to get detailed nutritional analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ingredients">Ingredients List</Label>
                <div className="mt-2">
                  <textarea
                    id="ingredients"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Paste ingredients separated by commas..."
                    value={ingredientsList}
                    onChange={(e) => setIngredientsList(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={analyzeIngredients}
                disabled={isAnalyzing || !ingredientsList.trim()}
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Analyze Ingredients
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Analysis History
            </CardTitle>
            <CardDescription>
              View your recent food analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisHistory.length > 0 ? (
                <div className="max-h-[250px] overflow-y-auto pr-1">
                  <FoodAnalysisHistory 
                    history={analysisHistory}
                    onSelect={selectHistoryItem}
                  />
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No analysis history yet</p>
                  <p className="text-sm mt-1">Analyze ingredients to save results here</p>
                </div>
              )}
              {analysisHistory.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={clearHistory}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear History
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {foodAnalysis && <AnalysisResultCard result={foodAnalysis} />}
    </div>
  );
};

interface AnalysisResultCardProps {
  result: FoodAnalysisResult;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ result }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1">Quality:</span>
            <span className={`text-sm font-bold ${
              result.overall_quality_score >= 7 ? 'text-green-500' : 
              result.overall_quality_score >= 4 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {result.overall_quality_score}/10
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1">Safety:</span>
            <span className={`text-sm font-bold ${
              result.safety_score >= 7 ? 'text-green-500' : 
              result.safety_score >= 4 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {result.safety_score}/10
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold mb-2">Summary</h3>
            <p className="text-sm">{result.summary}</p>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-2">Nutritional Profile</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Protein Quality: </span>
                <span className={`${
                  result.nutritional_profile?.protein_quality === 'high' ? 'text-green-500' : 
                  result.nutritional_profile?.protein_quality === 'medium' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {result.nutritional_profile?.protein_quality}
                </span>
              </div>
              <div>
                <span className="font-medium">Fat Quality: </span>
                <span className={`${
                  result.nutritional_profile?.fat_quality === 'high' ? 'text-green-500' : 
                  result.nutritional_profile?.fat_quality === 'medium' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {result.nutritional_profile?.fat_quality}
                </span>
              </div>
              <div>
                <span className="font-medium">Carb Quality: </span>
                <span className={`${
                  result.nutritional_profile?.carbohydrate_quality === 'high' ? 'text-green-500' : 
                  result.nutritional_profile?.carbohydrate_quality === 'medium' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {result.nutritional_profile?.carbohydrate_quality}
                </span>
              </div>
              <div>
                <span className="font-medium">Fiber Content: </span>
                <span>{result.nutritional_profile?.fiber_content}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Vitamin/Mineral Balance: </span>
                <span>{result.nutritional_profile?.vitamin_mineral_balance}</span>
              </div>
            </div>
          </div>
          
          {result.nutritional_benefits && result.nutritional_benefits.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Benefits</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.nutritional_benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.problematic_ingredients && result.problematic_ingredients.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2 text-red-500">Issues</h3>
              <div className="space-y-2">
                {result.problematic_ingredients.map((item, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                        item.severity === 'high' ? 'bg-red-100 text-red-700' : 
                        item.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {result.allergy_warnings && result.allergy_warnings.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2 text-red-500">Allergy Warnings</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.allergy_warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-md font-semibold mb-1">Digestibility</h3>
              <span className={`${
                result.digestibility === 'high' ? 'text-green-500' : 
                result.digestibility === 'medium' ? 'text-yellow-500' : 
                'text-red-500'
              }`}>
                {result.digestibility}
              </span>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-1">Suitable For</h3>
              <span>{result.suitable_for && result.suitable_for.join(', ')}</span>
            </div>
          </div>
          
          {result.suggestions && result.suggestions.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Suggestions</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyzeTab;
