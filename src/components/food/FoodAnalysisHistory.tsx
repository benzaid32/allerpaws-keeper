
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AnalysisResult = {
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

type AnalysisHistoryItem = {
  id: string;
  ingredients: string[];
  timestamp: string;
  analysis: AnalysisResult;
};

interface FoodAnalysisHistoryProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
}

const FoodAnalysisHistory: React.FC<FoodAnalysisHistoryProps> = ({ history, onSelect }) => {
  return (
    <div className="space-y-3">
      {history.map((item) => (
        <Card key={item.id} className="p-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelect(item)}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-sm truncate max-w-[200px]">
                {item.ingredients.slice(0, 2).join(', ')}
                {item.ingredients.length > 2 && '...'}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs px-1.5 py-0.5 rounded bg-gray-100">
                <span className="font-semibold">Quality: </span>
                <span className={`${
                  item.analysis.overall_quality_score >= 7 ? 'text-green-600' : 
                  item.analysis.overall_quality_score >= 4 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {item.analysis.overall_quality_score}/10
                </span>
              </div>
              <div className="text-xs px-1.5 py-0.5 rounded bg-gray-100">
                <span className="font-semibold">Safety: </span>
                <span className={`${
                  item.analysis.safety_score >= 7 ? 'text-green-600' : 
                  item.analysis.safety_score >= 4 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {item.analysis.safety_score}/10
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FoodAnalysisHistory;
