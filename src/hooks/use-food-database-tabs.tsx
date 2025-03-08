
import { useState } from "react";

export type FoodDatabaseTab = "search" | "analyze" | "compare";

export function useFoodDatabaseTabs() {
  const [activeTab, setActiveTab] = useState<FoodDatabaseTab>("search");
  
  // Create a handler that safely converts the string value to our FoodDatabaseTab type
  const handleTabChange = (value: string) => {
    // Only set the tab if it's a valid FoodDatabaseTab value
    if (value === "search" || value === "analyze" || value === "compare") {
      setActiveTab(value);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
    handleTabChange
  };
}
