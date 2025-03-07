
import React from 'react';
import { FoodProduct } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodComparisonProps {
  foods: FoodProduct[];
  onRemove: (id: string) => void;
}

const FoodComparison: React.FC<FoodComparisonProps> = ({ foods, onRemove }) => {
  // Find common allergens across all products
  const commonAllergens = foods.reduce((common, food) => {
    if (common.length === 0) return [...food.allergens];
    return common.filter(allergen => food.allergens.includes(allergen));
  }, [] as string[]);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <ScrollArea className="pb-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 sticky left-0 bg-gray-50 shadow-sm z-10">
                    Product
                  </th>
                  {foods.map((food) => (
                    <th key={food.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      <div className="flex flex-col items-center">
                        {food.imageUrl && (
                          <div className="w-16 h-16 mb-2">
                            <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover rounded" />
                          </div>
                        )}
                        <div className="text-center">
                          <div className="font-semibold text-sm text-gray-900">{food.name}</div>
                          <div className="text-xs text-gray-500">{food.brand}</div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onRemove(food.id)}
                          className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-sm">
                    Type
                  </td>
                  {foods.map((food) => (
                    <td key={food.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <span className="capitalize">{food.type}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-sm">
                    Species
                  </td>
                  {foods.map((food) => (
                    <td key={food.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <span className="capitalize">{food.species}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-sm">
                    Allergen Count
                  </td>
                  {foods.map((food) => (
                    <td key={food.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <span className={`font-semibold ${
                        food.allergens.length === 0 ? 'text-green-500' : 
                        food.allergens.length <= 2 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {food.allergens.length}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-sm">
                    Allergens
                  </td>
                  {foods.map((food) => (
                    <td key={food.id} className="px-6 py-4 text-sm text-gray-500">
                      {food.allergens.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {food.allergens.map((allergen, index) => (
                            <li 
                              key={index} 
                              className={commonAllergens.includes(allergen) ? 'text-red-500 font-medium' : ''}
                            >
                              {allergen}
                              {commonAllergens.includes(allergen) && ' (common)'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-green-500">No common allergens</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-sm">
                    Ingredients
                  </td>
                  {foods.map((food) => (
                    <td key={food.id} className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {food.ingredients.slice(0, 5).map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                        {food.ingredients.length > 5 && (
                          <li className="text-gray-400">+{food.ingredients.length - 5} more</li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodComparison;
