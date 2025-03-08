
import React from "react";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FoodEntryHeaderProps {
  date: string;
  foodName: string;
  petName: string;
  foodType?: string;
}

const FoodEntryHeader = ({ date, foodName, petName, foodType }: FoodEntryHeaderProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center text-muted-foreground mb-2">
        <Calendar className="h-4 w-4 mr-2" />
        <span>{formatDate(date)}</span>
      </div>
      <h2 className="text-lg font-semibold mb-1">
        {foodName || "Unnamed Food"}
      </h2>
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {petName}
        </Badge>
        {foodType && (
          <Badge variant="secondary">
            {foodType}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FoodEntryHeader;
