
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Upload, Zap, BarChart3, History, Trash2 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { FoodProduct } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import PremiumFeature from "@/components/subscription/PremiumFeature";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodAnalysisHistory from "@/components/food/FoodAnalysisHistory";
import FoodComparison from "@/components/food/FoodComparison";

type AnalysisResult = {
  overall_quality_score: number;
  safety_score: number;
  nutritional_profile: {
    protein_quality: string;
    fat_quality: string;
    carbohydrate_quality: string;
    fiber_content: string;
    vitamin_mineral_balance: string;
  };
  nutritional_benefits: string[];
  problematic_ingredients: Array<{
    name: string;
    reason: string;
    severity: string;
  }>;
  allergy_warnings: string[];
  digestibility: string;
  suitable_for: string[];
  artificial_additives: string[];
  suggestions: string[];
  summary: string;
};

type AnalysisHistoryItem = {
  id: string;
  ingredients: string[];
  timestamp: string;
  analysis: AnalysisResult;
};

const FoodDatabase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { isPremium } = useSubscriptionContext();
  const [ingredientsList, setIngredientsList] = useState("");
  const [analyzingIngredients, setAnalyzingIngredients] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<FoodProduct[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  // Load analysis history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('foodAnalysisHistory');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing analysis history:", error);
      }
    }
  }, []);

  // Save analysis history to localStorage whenever it changes
  useEffect(() => {
    if (analysisHistory.length > 0) {
      localStorage.setItem('foodAnalysisHistory', JSON.stringify(analysisHistory));
    }
  }, [analysisHistory]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      // Search for food products
      const { data, error } = await supabase
        .from("food_products")
        .select("*")
        .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        throw error;
      }

      setSearchResults(data as FoodProduct[]);
      
      if (data.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term or browse our categories",
        });
      }
    } catch (error: any) {
      console.error("Error searching food database:", error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search the food database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeIngredients = async () => {
    if (!ingredientsList.trim()) {
      toast({
        title: "No ingredients provided",
        description: "Please enter ingredients to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzingIngredients(true);
    setAnalysisResult(null);

    try {
      // Split the ingredients by commas
      const ingredients = ingredientsList
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      // Call the analyze-food edge function
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: { ingredients, petAllergies: [] },
      });

      if (error) {
        throw error;
      }

      if (data.analysis) {
        setAnalysisResult(data.analysis as AnalysisResult);
        
        // Add to history
        const historyItem: AnalysisHistoryItem = {
          id: Date.now().toString(),
          ingredients,
          timestamp: data.timestamp || new Date().toISOString(),
          analysis: data.analysis as AnalysisResult
        };
        
        setAnalysisHistory(prev => [historyItem, ...prev].slice(0, 10));
      }
    } catch (error: any) {
      console.error("Error analyzing ingredients:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze ingredients",
        variant: "destructive",
      });
    } finally {
      setAnalyzingIngredients(false);
    }
  };

  const addToComparison = (product: FoodProduct) => {
    if (selectedFoods.some(p => p.id === product.id)) {
      toast({
        title: "Already added",
        description: "This product is already in your comparison list",
      });
      return;
    }
    
    if (selectedFoods.length >= 3 && !isPremium) {
      toast({
        title: "Premium feature",
        description: "Upgrade to premium to compare more than 3 products",
      });
      return;
    }

    if (selectedFoods.length >= 5) {
      toast({
        title: "Maximum reached",
        description: "You can compare up to 5 products at once",
      });
      return;
    }

    setSelectedFoods(prev => [...prev, product]);
    toast({
      title: "Added to comparison",
      description: `${product.name} added to comparison`,
    });
  };

  const removeFromComparison = (productId: string) => {
    setSelectedFoods(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setSelectedFoods([]);
    toast({
      title: "Comparison cleared",
      description: "All products removed from comparison",
    });
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    localStorage.removeItem('foodAnalysisHistory');
    toast({
      title: "History cleared",
      description: "Analysis history has been cleared",
    });
  };

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
          {/* Search form */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search for pet food</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Search by brand or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          <div>
            {searchResults.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {searchResults.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex">
                        {product.imageUrl && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4 flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-red-500">
                                Common Allergens:
                              </span>
                              <span className="text-xs ml-1">
                                {product.allergens.join(", ")}
                              </span>
                            </div>
                          )}
                          <div className="flex mt-2 space-x-2">
                            <Button
                              variant="link"
                              className="p-0 h-auto text-xs"
                              onClick={() => navigate(`/food/${product.id}`)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => addToComparison(product)}
                            >
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Compare
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analyze" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Food Analysis
                </CardTitle>
                <CardDescription>
                  Enter ingredients list to get detailed nutritional analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ingredients">Ingredients List</Label>
                    <div className="mt-2">
                      <textarea
                        id="ingredients"
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Paste ingredients separated by commas..."
                        value={ingredientsList}
                        onChange={(e) => setIngredientsList(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={analyzeIngredients}
                    disabled={analyzingIngredients || !ingredientsList.trim()}
                  >
                    {analyzingIngredients ? (
                      <span className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Zap className="mr-2 h-4 w-4" />
                        Analyze Ingredients
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Analysis History
                </CardTitle>
                <CardDescription>
                  View your recent food analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisHistory.length > 0 ? (
                    <div className="max-h-[250px] overflow-y-auto pr-1">
                      <FoodAnalysisHistory 
                        history={analysisHistory}
                        onSelect={(item) => {
                          setAnalysisResult(item.analysis);
                          setIngredientsList(item.ingredients.join(', '));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No analysis history yet</p>
                      <p className="text-sm mt-1">Analyze ingredients to save results here</p>
                    </div>
                  )}
                  {analysisHistory.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={clearHistory}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Clear History
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {analysisResult && (
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-1">Quality:</span>
                    <span className={`text-sm font-bold ${
                      analysisResult.overall_quality_score >= 7 ? 'text-green-500' : 
                      analysisResult.overall_quality_score >= 4 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {analysisResult.overall_quality_score}/10
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-1">Safety:</span>
                    <span className={`text-sm font-bold ${
                      analysisResult.safety_score >= 7 ? 'text-green-500' : 
                      analysisResult.safety_score >= 4 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {analysisResult.safety_score}/10
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-semibold mb-2">Summary</h3>
                    <p className="text-sm">{analysisResult.summary}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-semibold mb-2">Nutritional Profile</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Protein Quality: </span>
                        <span className={`${
                          analysisResult.nutritional_profile.protein_quality === 'high' ? 'text-green-500' : 
                          analysisResult.nutritional_profile.protein_quality === 'medium' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {analysisResult.nutritional_profile.protein_quality}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Fat Quality: </span>
                        <span className={`${
                          analysisResult.nutritional_profile.fat_quality === 'high' ? 'text-green-500' : 
                          analysisResult.nutritional_profile.fat_quality === 'medium' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {analysisResult.nutritional_profile.fat_quality}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Carb Quality: </span>
                        <span className={`${
                          analysisResult.nutritional_profile.carbohydrate_quality === 'high' ? 'text-green-500' : 
                          analysisResult.nutritional_profile.carbohydrate_quality === 'medium' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {analysisResult.nutritional_profile.carbohydrate_quality}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Fiber Content: </span>
                        <span>{analysisResult.nutritional_profile.fiber_content}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Vitamin/Mineral Balance: </span>
                        <span>{analysisResult.nutritional_profile.vitamin_mineral_balance}</span>
                      </div>
                    </div>
                  </div>
                  
                  {analysisResult.nutritional_benefits.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Benefits</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysisResult.nutritional_benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.problematic_ingredients.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2 text-red-500">Issues</h3>
                      <div className="space-y-2">
                        {analysisResult.problematic_ingredients.map((item, i) => (
                          <div key={i} className="text-sm">
                            <div className="flex items-center">
                              <span className="font-medium">{item.name}</span>
                              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                item.severity === 'high' ? 'bg-red-100 text-red-700' : 
                                item.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {item.severity}
                              </span>
                            </div>
                            <p className="text-muted-foreground">{item.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysisResult.allergy_warnings.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2 text-red-500">Allergy Warnings</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysisResult.allergy_warnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="text-md font-semibold mb-1">Digestibility</h3>
                      <span className={`${
                        analysisResult.digestibility === 'high' ? 'text-green-500' : 
                        analysisResult.digestibility === 'medium' ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}>
                        {analysisResult.digestibility}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-semibold mb-1">Suitable For</h3>
                      <span>{analysisResult.suitable_for.join(', ')}</span>
                    </div>
                  </div>
                  
                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Suggestions</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {analysisResult.suggestions.map((suggestion, i) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compare" className="mt-4">
          {selectedFoods.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Comparing {selectedFoods.length} Products</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearComparison}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
              <FoodComparison foods={selectedFoods} onRemove={removeFromComparison} />
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No products selected for comparison</h3>
              <p className="max-w-md mx-auto">
                Add products to compare by clicking the "Compare" button next to products in the search results.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('search')}
              >
                <Search className="h-4 w-4 mr-2" />
                Search Products
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
