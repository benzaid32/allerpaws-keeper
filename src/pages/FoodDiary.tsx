
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Search, Database } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PatternBackground from "@/components/ui/pattern-background";
import FeaturedImage from "@/components/ui/featured-image";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePets } from "@/hooks/use-pets";

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
          {/* Header section with stats */}
          <div className="mb-4">
            <FeaturedImage
              name="happyDogOwner"
              height={180}
              caption="Track Your Pet's Diet"
              description="Keep a record of everything your pet eats to identify patterns"
              animate={true}
            />
          </div>
          
          {/* Action bar */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => navigate("/add-food-entry")}
              className="flex-1"
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
          {loading ? (
            <div className="text-center py-8">Loading entries...</div>
          ) : entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MobileCard
                    onClick={() => navigate(`/food-entry/${entry.id}`)}
                    className="hover:border-primary/30"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{entry.food_name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {getPetName(entry.pet_id)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline">{entry.food_type}</Badge>
                          {entry.food_product_id && (
                            <Badge variant="secondary" className="flex items-center gap-1">
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
                      <div className="mt-2 text-sm border-t pt-2">
                        {entry.notes}
                      </div>
                    )}
                  </MobileCard>
                </motion.div>
              ))}
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
