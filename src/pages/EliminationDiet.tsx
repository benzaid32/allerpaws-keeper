
import React, { useState } from "react";
import { Check, ChevronRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ELIMINATION_PHASES } from "@/lib/constants";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import FoodAnalyzer from "@/components/FoodAnalyzer";

const EliminationDiet = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [pets, setPets] = useState<Array<{ id: string, name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pets")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      console.error("Error fetching pets:", error.message);
      toast({
        title: "Error",
        description: "Failed to load your pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectPhase = (index: number) => {
    setActivePhase(index);
  };

  const currentPhase = ELIMINATION_PHASES[activePhase];
  
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Elimination Diet Guide</h1>
        <p className="text-muted-foreground">A structured approach to identify food allergies in your pet</p>
      </div>

      {!selectedPetId ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a Pet</CardTitle>
            <CardDescription>Choose a pet to start or continue their elimination diet plan</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading your pets...</p>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pets.map(pet => (
                  <Button 
                    key={pet.id} 
                    variant="outline" 
                    className="justify-start h-auto py-6 px-4"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium">{pet.name}</span>
                      <span className="text-sm text-muted-foreground">View diet plan</span>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No pets found. Add a pet to get started.</p>
                <Button onClick={() => window.location.href = "/add-pet"}>Add a Pet</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="phases" className="flex-1">Diet Phases</TabsTrigger>
              <TabsTrigger value="analyze" className="flex-1">Food Analyzer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Phase</CardTitle>
                  <CardDescription>Track your progress through the elimination diet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-4">
                    <h3 className="font-medium text-lg">{currentPhase.name}</h3>
                    <p className="text-muted-foreground mb-2">Day {currentStep + 1} of {currentPhase.duration}</p>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${((currentStep + 1) / currentPhase.duration) * 100}%` }}
                      ></div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Phase Overview</AlertTitle>
                        <AlertDescription>
                          {currentPhase.description}
                        </AlertDescription>
                      </Alert>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Tasks</h4>
                        <ul className="space-y-2">
                          {currentPhase.tips.map((tip, index) => (
                            <li key={index} className="flex items-center">
                              <div className={`h-5 w-5 rounded-full ${index <= currentStep ? "bg-primary/10" : "bg-muted"} flex items-center justify-center mr-2`}>
                                {index <= currentStep && <Check className="h-3 w-3 text-primary" />}
                              </div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button 
                        variant="outline" 
                        onClick={handlePreviousStep}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={handleNextStep}
                        disabled={currentStep >= 3}
                      >
                        Next Task
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Phases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ELIMINATION_PHASES.slice(activePhase + 1).map((phase, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{phase.name}</h3>
                          <Badge variant="outline">{phase.duration} days</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{phase.description.substring(0, 100)}...</p>
                      </div>
                    ))}
                    
                    {activePhase === ELIMINATION_PHASES.length - 1 && (
                      <p className="text-center text-muted-foreground py-2">
                        You've reached the final phase of the elimination diet!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="phases">
              <div className="space-y-6">
                {ELIMINATION_PHASES.map((phase, index) => (
                  <Card 
                    key={index} 
                    className={`transition-all ${activePhase === index ? 'border-primary' : ''}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{phase.name}</CardTitle>
                        <Badge variant="outline">{phase.duration} days</Badge>
                      </div>
                      <CardDescription>{phase.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Tips</h4>
                          <ul className="space-y-1">
                            {phase.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                                  <Check className="h-3 w-3 text-primary" />
                                </div>
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {phase.recommendedFoods && phase.recommendedFoods.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Recommended Foods</h4>
                            <div className="flex flex-wrap gap-2">
                              {phase.recommendedFoods.map((food, foodIndex) => (
                                <Badge key={foodIndex} variant="secondary">
                                  {food}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end">
                          <Button 
                            variant={activePhase === index ? "default" : "outline"}
                            onClick={() => selectPhase(index)}
                          >
                            {activePhase === index ? 'Current Phase' : 'Switch to This Phase'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="analyze">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Pet Food</CardTitle>
                  <CardDescription>
                    Check if a food is suitable for your pet's elimination diet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FoodAnalyzer 
                    petId={selectedPetId} 
                    petName={pets.find(p => p.id === selectedPetId)?.name || "your pet"} 
                    initialIngredients={ingredients}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center mb-4">
            <Button variant="outline" onClick={() => setSelectedPetId(null)}>
              Choose Different Pet
            </Button>
          </div>
        </>
      )}

      <BottomNavigation />
    </div>
  );
};

export default EliminationDiet;
