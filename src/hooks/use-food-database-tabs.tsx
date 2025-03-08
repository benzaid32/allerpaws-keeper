
import { useState } from "react";

export type FoodDatabaseTab = "search" | "analyze" | "compare";

export function useFoodDatabaseTabs() {
  const [activeTab, setActiveTab] = useState<FoodDatabaseTab>("search");
  
  return {
    activeTab,
    setActiveTab,
  };
}
