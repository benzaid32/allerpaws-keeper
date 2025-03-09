
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Search, Database, BookOpen, ChevronRight } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PatternBackground from "@/components/ui/pattern-background";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/use-pets";
import { Card, CardContent } from "@/components/ui/card";

// Define the FoodEntry type to match the actual structure from the database
interface FoodEntry {
  id: string;
  created_at: string;
  pet_id: string;
  notes?: string;
  date: string;
  food_name?: string;
  food_type?: string;
  food_product_id?: string;
}

const FoodDiary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { pets } = usePets();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string | "all">("all");
  
  // Fetch food diary entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        
        // Start with a base query
        let query = supabase
          .from("food_entries")
          .select(`
            *,
            food_items (*)
          `)
          .order("date", { ascending: false });
        
        // Add pet_id filter only if a specific pet is selected
        if (selectedPetId !== "all") {
          query = query.eq("pet_id", selectedPetId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        console.log("Food entries data:", data);
        
        // Transform the data to ensure all expected fields
        const formattedEntries = data.map(entry => {
          // Extract the first food item if available
          const foodItem = entry.food_items && entry.food_items.length > 0 
            ? entry.food_items[0] 
            : null;
          
          return {
            ...entry,
            food_name: foodItem ? foodItem.name : "Unnamed Food",
            food_type: foodItem ? foodItem.type : "regular",
            food_product_id: foodItem ? foodItem.id : null
          };
        }) as FoodEntry[];
        
        setEntries(formattedEntries);
      } catch (error) {
        console.error("Error fetching food diary entries:", error);
        toast({
          title: "Error",
          description: "Failed to load food diary entries",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchEntries();
    }
  }, [selectedPetId, toast, user]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  
  // Get pet name by ID
  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet?.name || "Unknown Pet";
  };
  
  return (
    <MobileLayout
      title="Food Diary"
      showBackButton
      onBack={() => navigate("/elimination-diet")}
    >
      <PatternBackground color="primary">
        <div className="space-y-4">
          {/* Hero Image Section */}
          <Card className="overflow-hidden border-none shadow-lg mb-6">
            <CardContent className="p-0 relative">
              <img 
                src="/lovable-uploads/51e41806-91be-4f88-bbd5-1e5aaced9ab6.png" 
                alt="Track Your Pet's Diet" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16">
                <h2 className="text-white text-2xl font-bold mb-1">Track Your Pet's Diet</h2>
                <p className="text-white/90 text-sm">
                  Keep a detailed record of your pet's meals to identify patterns
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 text-center border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Active Pets</p>
              <p className="text-2xl font-bold text-primary">{pets.length}</p>
            </div>
          </div>
          
          {/* Action bar */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => navigate("/add-food-entry")}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Log New Food
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {}}
              className="flex-none"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/food-database")}
              className="flex-none"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Pet filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <Badge
              variant={selectedPetId === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedPetId("all")}
            >
              All Pets
            </Badge>
            {pets.map((pet) => (
              <Badge
                key={pet.id}
                variant={selectedPetId === pet.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedPetId(pet.id)}
              >
                {pet.name}
              </Badge>
            ))}
          </div>
          
          {/* Food entries list */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 shadow-sm border">
            <h3 className="font-medium text-base mb-3 flex items-center text-primary">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Entries
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading entries...</p>
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MobileCard
                      onClick={() => navigate(`/food-entry/${entry.id}`)}
                      className="hover:border-primary/30 bg-white shadow-sm"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{entry.food_name}</h3>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-primary/60 mr-1.5"></span>
                            {getPetName(entry.pet_id)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="bg-primary/5">{entry.food_type}</Badge>
                            {entry.food_product_id && (
                              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-600 border-blue-200">
                                <Database className="h-3 w-3" />
                                DB
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(entry.date)}
                          </div>
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="mt-2 text-sm border-t pt-2 text-gray-600">
                          {entry.notes.length > 100 ? `${entry.notes.substring(0, 100)}...` : entry.notes}
                        </div>
                      )}
                    </MobileCard>
                  </motion.div>
                ))}
                
                {entries.length > 5 && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-primary text-sm mt-2"
                    onClick={() => {}}
                  >
                    View All Entries
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">No entries yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking what your pet eats to identify patterns
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/add-food-entry")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Entry
                </Button>
              </div>
            )}
          </div>
          
          {/* Helpful tips */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm border">
            <h3 className="font-medium text-base mb-2">Food Tracking Tips</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-primary/80 mt-1.5 mr-2"></span>
                Record all food items, including treats and table scraps
              </li>
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-primary/80 mt-1.5 mr-2"></span>
                Note any changes in behavior after introducing new foods
              </li>
              <li className="flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-primary/80 mt-1.5 mr-2"></span>
                Add photos of commercial food labels for accurate tracking
              </li>
            </ul>
          </div>
          
          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/elimination-diet")}
            >
              Back to Diet Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/food-database")}
            >
              Food Database
            </Button>
          </div>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default FoodDiary;
