
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useFoodDetails } from "@/hooks/use-food-details";
import MobileCard from "@/components/ui/mobile-card";
import { Separator } from "@/components/ui/separator";
import { useFoodComparison } from "@/hooks/use-food-comparison";
import { useToast } from "@/hooks/use-toast";

const FoodDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { food, loading, error } = useFoodDetails(id);
  const { addToComparison } = useFoodComparison();
  const { toast } = useToast();

  useEffect(() => {
    console.log("FoodDetailsPage rendered with food:", food);
  }, [food]);

  const handleAddToComparison = () => {
    if (food) {
      addToComparison(food);
      toast({
        title: "Added to comparison",
        description: `${food.name} added to comparison list`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Food Details</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading product details...</span>
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <div className="text-destructive mb-4 text-lg">
            {error}
          </div>
          <Button onClick={() => navigate('/food-database')}>
            Return to Food Database
          </Button>
        </Card>
      ) : food ? (
        <div className="space-y-6">
          {/* Basic Info Card */}
          <MobileCard>
            <div className="flex flex-col md:flex-row gap-4">
              {food.imageUrl && (
                <div className="w-full md:w-1/3 flex justify-center">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="object-cover rounded-md max-h-48 md:max-h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold">{food.name}</h2>
                <p className="text-muted-foreground">{food.brand}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{food.type}</Badge>
                  <Badge variant="outline">For {food.species}</Badge>
                </div>
                
                {food.allergens && food.allergens.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-red-500">
                      Common Allergens:
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {food.allergens.map((allergen, index) => (
                        <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleAddToComparison}
                    className="w-full sm:w-auto"
                  >
                    Add to Comparison
                  </Button>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* Ingredients Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              {food.ingredients && food.ingredients.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {food.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground italic">No ingredients information available</p>
              )}
            </CardContent>
          </Card>

          {/* Nutritional Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutritional Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="font-medium mb-2">Potential Benefits</h4>
                  <ul className="list-disc pl-5">
                    <li>Protein source for muscle development</li>
                    <li>Essential amino acids for overall health</li>
                    <li>Vitamins for immune system support</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Considerations</h4>
                  <ul className="list-disc pl-5">
                    <li>May contain additives or preservatives</li>
                    <li>Check with your veterinarian about specific ingredients</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Search Button */}
          <div className="flex justify-center my-4">
            <Button 
              onClick={() => navigate('/food-database')}
              className="w-full max-w-xs"
            >
              Back to Food Database
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No product found
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default FoodDetailsPage;
