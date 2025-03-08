
import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";
import { usePets } from "@/hooks/use-pets";
import { useFoodSearch } from "@/hooks/use-food-search";
import { useFoodEntry } from "@/hooks/use-food-entry";
import ManualEntryForm from "@/components/food-entry/ManualEntryForm";
import DatabaseSearchTab from "@/components/food-entry/DatabaseSearchTab";

const AddFoodEntry = () => {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { 
    isSubmitting, 
    activeTab, 
    setActiveTab, 
    selectedFood, 
    setSelectedFood, 
    handleSelectFood, 
    handleSubmit 
  } = useFoodEntry();
  
  const { 
    searchTerm, 
    setSearchTerm, 
    searchResults, 
    loading: searchLoading, 
    handleSearch 
  } = useFoodSearch();
  
  return (
    <MobileLayout
      title="Add Food Entry"
      showBackButton
      onBack={() => navigate("/food-diary")}
    >
      <PatternBackground color="primary">
        <div className="space-y-6 pb-10">
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="database">From Database</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database">
              <DatabaseSearchTab
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchResults={searchResults}
                searchLoading={searchLoading}
                handleSearch={handleSearch}
                handleSelectFood={handleSelectFood}
                onSwitchToManual={() => setActiveTab("manual")}
              />
            </TabsContent>
            
            <TabsContent value="manual">
              <ManualEntryForm
                onSubmit={handleSubmit}
                pets={pets}
                isSubmitting={isSubmitting}
                selectedFood={selectedFood}
                onClearSelectedFood={() => setSelectedFood(null)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default AddFoodEntry;
