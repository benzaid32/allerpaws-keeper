
import React, { useState, useEffect } from "react";
import { Search, ChevronRight, Loader2, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import FoodAnalyzer from "@/components/FoodAnalyzer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FoodProduct } from "@/lib/types";

// Type helper for converting db response to our FoodProduct type
const mapToFoodProduct = (dbProduct: any): FoodProduct => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand,
    type: dbProduct.type as "dry" | "wet" | "treat" | "supplement",
    species: dbProduct.species as "dog" | "cat" | "both",
    ingredients: dbProduct.ingredients || [],
    allergens: dbProduct.allergens || [],
    imageUrl: dbProduct.image_url
  };
};

// Define the type for search parameters
interface SearchParams {
  query?: string;
  petId?: string | null;
  allergens?: boolean;
  type?: string;
}

// Define pet type for species filtering
interface UserPet {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
}

const FoodDatabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [recommendedFoods, setRecommendedFoods] = useState<FoodProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FoodProduct | null>(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [pets, setPets] = useState<UserPet[]>([]);
  const [activeTab, setActiveTab] = useState<string>("search");
  const [analyzerIngredients, setAnalyzerIngredients] = useState<string>("");
  const [userPetSpecies, setUserPetSpecies] = useState<Set<string>>(new Set());
  const [isFetchingPets, setIsFetchingPets] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  useEffect(() => {
    if (userPetSpecies.size > 0) {
      fetchRecommendedFoods();
    }
  }, [userPetSpecies]);

  const fetchPets = async () => {
    try {
      setIsFetchingPets(true);
      const { data, error } = await supabase
        .from("pets")
        .select("id, name, species")
        .eq("user_id", user?.id)
        .order("name");

      if (error) throw error;
      
      setPets(data || []);
      if (data && data.length > 0) {
        setSelectedPetId(data[0].id);
        
        // Extract unique species from pets
        const species = new Set<string>();
        data.forEach(pet => {
          if (pet.species === "dog" || pet.species === "cat") {
            species.add(pet.species);
          }
        });
        setUserPetSpecies(species);
      }
    } catch (error: any) {
      console.error("Error fetching pets:", error.message);
    } finally {
      setIsFetchingPets(false);
    }
  };

  const fetchRecommendedFoods = async () => {
    try {
      setIsLoading(true);
      
      // Create query to fetch foods compatible with user's pets
      let query = supabase
        .from("food_products")
        .select("*")
        .limit(8);
      
      // Filter foods by species based on user's pets
      if (userPetSpecies.size === 1) {
        // If user has only dogs or only cats
        const species = userPetSpecies.has("dog") ? "dog" : "cat";
        query = query.or(`species.eq.${species},species.eq.both`);
      } else if (userPetSpecies.size > 1) {
        // If user has both, prioritize "both" first, then include some dog and cat specific
        query = query.or(`species.eq.both,species.eq.dog,species.eq.cat`).limit(8);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Convert the data to our FoodProduct type
      const mappedData = data?.map(mapToFoodProduct) || [];
      setRecommendedFoods(mappedData);
    } catch (error: any) {
      console.error("Error fetching recommended foods:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      
      // Check if this is a category search
      const isCategory = ["dry", "wet", "treat", "supplement"].includes(searchQuery.toLowerCase());
      
      // Create the query parameters with the correct TypeScript interface
      const queryParams: SearchParams = { 
        petId: selectedPetId,
        allergens: true
      };
      
      // If it's a category search, set the type parameter, otherwise set the query parameter
      if (isCategory) {
        queryParams.type = searchQuery.toLowerCase();
      } else {
        queryParams.query = searchQuery;
      }
      
      // Use the Supabase Edge Function for searching
      const { data, error } = await supabase.functions.invoke('search-food', {
        body: queryParams
      });

      if (error) throw error;
      
      if (data && data.success) {
        // Convert the data to our FoodProduct type
        const mappedData = data.data?.map(mapToFoodProduct) || [];
        setSearchResults(mappedData);
        
        if (mappedData.length === 0) {
          toast({
            title: "No results found",
            description: "Try a different search term or check our recommended foods.",
          });
        }
      } else {
        throw new Error(data?.error || "Failed to search food products");
      }
    } catch (error: any) {
      console.error("Error searching foods:", error.message);
      toast({
        title: "Search error",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    setIsLoading(true);
    
    // Use a small timeout to ensure the UI updates before the search
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const viewProductDetails = (product: FoodProduct) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const getProductInitials = (brand: string) => {
    return brand.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
  };

  const sendToAnalyzer = (ingredients: string[]) => {
    setActiveTab("analyzer");
    setProductDialogOpen(false);
    setAnalyzerIngredients(ingredients.join(", "));
  };

  // Check if food is compatible with user's pets
  const getFoodCompatibility = (product: FoodProduct) => {
    if (product.species === "both") {
      return { compatible: true, message: "Suitable for all pets" };
    }
    
    // If user has only dogs
    if (userPetSpecies.size === 1 && userPetSpecies.has("dog") && product.species === "dog") {
      return { compatible: true, message: "Great for dogs" };
    }
    
    // If user has only cats
    if (userPetSpecies.size === 1 && userPetSpecies.has("cat") && product.species === "cat") {
      return { compatible: true, message: "Perfect for cats" };
    }
    
    // If user has both dogs and cats but food is species-specific
    if (userPetSpecies.size > 1 && product.species !== "both") {
      return { 
        compatible: true, 
        message: `Only for ${product.species === "dog" ? "dogs" : "cats"}` 
      };
    }
    
    return { compatible: false, message: "Not suitable for your pets" };
  };

  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Food Database</h1>
        <p className="text-muted-foreground">Search for safe foods for your pet</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Foods</TabsTrigger>
          <TabsTrigger value="analyzer">Ingredient Analyzer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4 mt-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 pr-24" 
              placeholder="Search foods, ingredients, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              className="absolute right-1 top-1 h-8" 
              size="sm"
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Search Results</CardTitle>
                <CardDescription>Found {searchResults.length} matching products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => viewProductDetails(product)}
                    >
                      <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <span className="text-primary font-medium">{getProductInitials(product.brand)}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommended Foods</CardTitle>
              {userPetSpecies.size > 0 && (
                <CardDescription>
                  Based on your {Array.from(userPetSpecies).join(' and ')}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isLoading || isFetchingPets ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : recommendedFoods.length > 0 ? (
                <div className="space-y-3">
                  {recommendedFoods.map((product) => {
                    const compatibility = getFoodCompatibility(product);
                    return (
                      <div 
                        key={product.id} 
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer"
                        onClick={() => viewProductDetails(product)}
                      >
                        <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                          <span className="text-primary font-medium">{getProductInitials(product.brand)}</span>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {compatibility.message}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Add pets to see personalized recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Browse Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="p-4 border rounded-lg text-center hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleCategoryClick("dry")}
                >
                  <h3 className="font-medium">Dry Food</h3>
                </div>
                <div 
                  className="p-4 border rounded-lg text-center hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleCategoryClick("wet")}
                >
                  <h3 className="font-medium">Wet Food</h3>
                </div>
                <div 
                  className="p-4 border rounded-lg text-center hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleCategoryClick("treat")}
                >
                  <h3 className="font-medium">Treats</h3>
                </div>
                <div 
                  className="p-4 border rounded-lg text-center hover:bg-accent/50 cursor-pointer"
                  onClick={() => handleCategoryClick("supplement")}
                >
                  <h3 className="font-medium">Supplements</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analyzer" className="space-y-4 mt-4">
          {pets.length > 0 && selectedPetId ? (
            <>
              {pets.length > 1 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {pets.map((pet) => (
                    <Button
                      key={pet.id}
                      variant={selectedPetId === pet.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePetChange(pet.id)}
                    >
                      {pet.name}
                    </Button>
                  ))}
                </div>
              )}
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Analyze Food Ingredients</AlertTitle>
                <AlertDescription>
                  Paste ingredients from pet food packaging to check if they're safe for your pet.
                </AlertDescription>
              </Alert>
              <FoodAnalyzer 
                petId={selectedPetId} 
                petName={pets.find(p => p.id === selectedPetId)?.name || ""} 
                initialIngredients={analyzerIngredients}
              />
            </>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium mb-2">No Pets Found</h3>
                <p className="text-muted-foreground mb-4">
                  You need to add a pet before using the food analyzer.
                </p>
                <Button onClick={() => window.location.href = "/dashboard"}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>{selectedProduct.brand}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedProduct.type === "dry" ? "default" : "outline"}>
                    {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    For {selectedProduct.species === "both" ? "Dogs & Cats" : selectedProduct.species === "dog" ? "Dogs" : "Cats"}
                  </Badge>
                </div>
                
                {userPetSpecies.size > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Compatibility:</h4>
                    <p className="text-sm">
                      {(() => {
                        const { message } = getFoodCompatibility(selectedProduct);
                        return message;
                      })()}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Ingredients:</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.ingredients.join(", ")}
                  </p>
                </div>
                
                {selectedProduct.allergens && selectedProduct.allergens.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Known Allergens:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.allergens.map((allergen, index) => (
                        <Badge key={index} variant="destructive" className="capitalize">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => sendToAnalyzer(selectedProduct.ingredients)}
                >
                  Analyze Ingredients
                </Button>
              </CardFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
