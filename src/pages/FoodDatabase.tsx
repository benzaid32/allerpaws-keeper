import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Upload, Zap } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { FoodProduct } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import PremiumFeature from "@/components/subscription/PremiumFeature";

const FoodDatabase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { isPremium } = useSubscriptionContext();

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

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Food Database</h1>
      </div>

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

      {/* Advanced Analysis Section - Premium Feature */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
        
        <PremiumFeature
          title="Premium Feature: Advanced Food Analysis"
          description="Upgrade to premium to access detailed ingredient analysis, allergen identification, and personalized recommendations for your pet's diet."
        >
          {/* Advanced analysis UI that only premium users can see */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">AI-Powered Food Analysis</CardTitle>
              <CardDescription>Upload a food label or enter ingredients for detailed analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Button className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Food Label Image
                  </Button>
                </div>
                <div>
                  <Label htmlFor="ingredients">Or enter ingredients list</Label>
                  <div className="mt-2">
                    <textarea
                      id="ingredients"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Paste ingredients list here..."
                    ></textarea>
                  </div>
                </div>
                <Button className="w-full">
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze Ingredients
                </Button>
              </div>
            </CardContent>
          </Card>
        </PremiumFeature>
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
                      <Button
                        variant="link"
                        className="p-0 h-auto text-xs mt-2"
                        onClick={() => navigate(`/food/${product.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
