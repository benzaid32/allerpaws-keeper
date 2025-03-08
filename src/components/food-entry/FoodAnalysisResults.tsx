
import React from "react";
import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FoodAnalysisProps {
  analysis: {
    summary: string;
    overall_quality_score: number;
    safety_score: number;
    nutritional_benefits?: string[];
    problematic_ingredients?: Array<{
      name: string;
      reason: string;
    }>;
  } | null;
}

const FoodAnalysisResults = ({ analysis }: FoodAnalysisProps) => {
  if (!analysis) return null;
  
  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          AI Food Analysis
        </CardTitle>
        <CardDescription>
          Nutritional profile and concerns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Summary</h4>
          <p className="text-sm text-muted-foreground">{analysis.summary}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h4 className="text-sm font-medium">Quality Score</h4>
            <div className={`text-sm font-medium ${
              analysis.overall_quality_score >= 7 ? 'text-green-500' : 
              analysis.overall_quality_score >= 4 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {analysis.overall_quality_score}/10
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium">Safety Score</h4>
            <div className={`text-sm font-medium ${
              analysis.safety_score >= 7 ? 'text-green-500' : 
              analysis.safety_score >= 4 ? 'text-yellow-500' : 
              'text-red-500'
            }`}>
              {analysis.safety_score}/10
            </div>
          </div>
        </div>
        
        {analysis.nutritional_benefits && analysis.nutritional_benefits.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Benefits</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {analysis.nutritional_benefits.slice(0, 3).map((benefit: string, i: number) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        
        {analysis.problematic_ingredients && analysis.problematic_ingredients.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Concerns</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              {analysis.problematic_ingredients.slice(0, 3).map((item: any, i: number) => (
                <li key={i}>
                  <span className="font-medium">{item.name}</span>: {item.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodAnalysisResults;
