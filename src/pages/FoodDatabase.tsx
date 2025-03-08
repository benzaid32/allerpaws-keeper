
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import SearchTab from "@/components/food/SearchTab";
import AnalyzeTab from "@/components/food/AnalyzeTab";
import CompareTab from "@/components/food/CompareTab";
import { useFoodComparison } from "@/hooks/use-food-comparison";
import { useFoodAnalysis } from "@/hooks/use-food-analysis";
import { useFoodDatabaseTabs } from "@/hooks/use-food-database-tabs";

const FoodDatabase = () => {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useFoodDatabaseTabs();
  const { selectedFoods } = useFoodComparison();
  const { analysisResult } = useFoodAnalysis();

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Food Database</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="analyze" className="relative">
            Analyze
            {analysisResult && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="compare" className="relative">
            Compare
            {selectedFoods.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full bg-blue-500 text-white">
                {selectedFoods.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <SearchTab />
        </TabsContent>

        <TabsContent value="analyze" className="mt-4 space-y-6">
          <AnalyzeTab />
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          <CompareTab onSwitchToSearch={() => setActiveTab('search')} />
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
