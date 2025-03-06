
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Filter, Star, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const FoodDatabase = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const foodItems = [
    {
      id: 1,
      name: "Royal Canin Hydrolyzed Protein",
      type: "Dog Food",
      allergySafe: true,
      ingredients: ["Hydrolyzed Soy Protein", "Rice", "Vegetable Oil"],
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Hill's Science Diet Sensitive Skin",
      type: "Dog Food",
      allergySafe: true,
      ingredients: ["Salmon", "Potatoes", "Peas"],
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Blue Buffalo Basics Limited Ingredient",
      type: "Cat Food",
      allergySafe: true,
      ingredients: ["Turkey", "Pumpkin", "Brown Rice"],
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 4,
      name: "Purina Pro Plan Sensitive Skin & Stomach",
      type: "Dog Food",
      allergySafe: false,
      ingredients: ["Salmon", "Rice", "Barley", "Wheat"],
      rating: 3.8,
      image: "https://images.unsplash.com/photo-1575900501942-293412c164e4?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 5,
      name: "Merrick Limited Ingredient Diet",
      type: "Cat Food",
      allergySafe: true,
      ingredients: ["Deboned Turkey", "Turkey Meal", "Potatoes"],
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const filteredFoodItems = foodItems.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      
      <div className="container relative pb-20 pt-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">Food Database</h1>
        </div>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search foods or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex justify-between mt-3">
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
            <div className="space-x-2">
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 cursor-pointer">Dog</Badge>
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 cursor-pointer">Cat</Badge>
              <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 cursor-pointer">Allergy-Safe</Badge>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredFoodItems.length > 0 ? (
            filteredFoodItems.map((food, index) => (
              <motion.div 
                key={food.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-none shadow-md bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-24 h-24 overflow-hidden">
                        <img 
                          src={food.image} 
                          alt={food.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{food.name}</h3>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs ml-1">{food.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{food.type}</p>
                        <div className="flex flex-wrap gap-1">
                          {food.ingredients.slice(0, 3).map((ingredient, i) => (
                            <span key={i} className="text-xs bg-muted/40 px-2 py-0.5 rounded-full">
                              {ingredient}
                            </span>
                          ))}
                          {food.ingredients.length > 3 && (
                            <span className="text-xs bg-muted/40 px-2 py-0.5 rounded-full">
                              +{food.ingredients.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-2 ${food.allergySafe ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                      <div className="flex items-center">
                        {food.allergySafe ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-xs text-green-700 dark:text-green-300">Safe for most pets with allergies</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <span className="text-xs text-amber-700 dark:text-amber-300">Contains common allergens</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2">No food items found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search term</p>
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
