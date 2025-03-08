
import React from "react";

interface FoodItem {
  id: string;
  name: string;
  type: string;
  ingredients?: string[];
  notes?: string;
}

interface FoodItemDetailsProps {
  foodItems: FoodItem[];
}

const FoodItemDetails = ({ foodItems }: FoodItemDetailsProps) => {
  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="font-medium mb-3">Food Details</h3>
      
      {foodItems.map((item) => (
        <div key={item.id} className="mb-4 last:mb-0">
          <h4 className="font-medium">{item.name}</h4>
          <p className="text-sm text-muted-foreground">
            Type: {item.type}
          </p>
          
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-2">
              <h5 className="text-sm font-medium">Ingredients:</h5>
              <p className="text-sm text-muted-foreground">
                {item.ingredients.join(", ")}
              </p>
            </div>
          )}
          
          {item.notes && (
            <div className="mt-2">
              <h5 className="text-sm font-medium">Food Notes:</h5>
              <p className="text-sm text-muted-foreground">
                {item.notes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoodItemDetails;
