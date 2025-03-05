
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Symptom, SymptomEntry, Pet } from "@/lib/types";
import { COMMON_SYMPTOMS } from "@/lib/constants";
import { generateId, getLocalStorage, setLocalStorage, formatDate, getSeverityColor } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Plus, ArrowLeft, Save, AlertTriangle, CalendarDays, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomTracker: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pet, setPet] = useState<Pet | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<{
    symptomId: string;
    severity: "mild" | "moderate" | "severe";
    notes?: string;
  }[]>([]);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [activeTab, setActiveTab] = useState("new");
  const [mounted, setMounted] = useState(false);

  // Load data from local storage
  useEffect(() => {
    try {
      // Load pet data
      const petData = getLocalStorage<Pet | null>("pet", null);
      if (!petData) {
        navigate("/onboarding");
        return;
      }
      setPet(petData);

      // Load symptom entries
      const symptomData = getLocalStorage<SymptomEntry[]>("symptomEntries", []);
      setEntries(symptomData);
      
      setMounted(true);
    } catch (error) {
      console.error("Error loading symptom data:", error);
      toast({
        title: "Error loading data",
        description: "There was an error loading your symptom data",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Toggle a symptom selection
  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      if (prev.some((s) => s.symptomId === symptomId)) {
        return prev.filter((s) => s.symptomId !== symptomId);
      } else {
        return [...prev, { symptomId, severity: "moderate" }];
      }
    });
  };

  // Update the severity of a selected symptom
  const updateSeverity = (symptomId: string, severity: "mild" | "moderate" | "severe") => {
    setSelectedSymptoms((prev) =>
      prev.map((s) =>
        s.symptomId === symptomId ? { ...s, severity } : s
      )
    );
  };

  // Save a new symptom entry
  const saveEntry = () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms selected",
        description: "Please select at least one symptom to log",
        variant: "destructive",
      });
      return;
    }

    if (!pet) {
      toast({
        title: "No pet profile found",
        description: "Please create a pet profile first",
        variant: "destructive",
      });
      return;
    }

    const newEntry: SymptomEntry = {
      id: generateId(),
      petId: pet.id,
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setLocalStorage("symptomEntries", updatedEntries);

    setSelectedSymptoms([]);
    setNotes("");
    setActiveTab("history");

    toast({
      title: "Symptoms logged",
      description: "Your symptom entry has been saved successfully",
    });
  };

  // Delete a symptom entry
  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    setLocalStorage("symptomEntries", updatedEntries);

    toast({
      title: "Entry deleted",
      description: "The symptom entry has been removed",
    });
  };

  // Find a symptom object by ID
  const getSymptomById = (id: string): Symptom | undefined => {
    return COMMON_SYMPTOMS.find((s) => s.id === id);
  };

  // Get the count of entries with this symptom
  const getSymptomOccurrences = (symptomId: string): number => {
    return entries.filter((entry) =>
      entry.symptoms.some((s) => s.symptomId === symptomId)
    ).length;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Symptom Tracker</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new" className="relative">
            New Entry
            {selectedSymptoms.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {selectedSymptoms.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            {entries.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px]">
                {entries.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4 space-y-4 animate-fade-in">
          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 gap-3">
            {COMMON_SYMPTOMS.map((symptom) => {
              const isSelected = selectedSymptoms.some(
                (s) => s.symptomId === symptom.id
              );
              const selectedSymptom = selectedSymptoms.find(
                (s) => s.symptomId === symptom.id
              );

              return (
                <div key={symptom.id} className="space-y-2">
                  <div
                    className={cn(
                      "p-3 rounded-lg border-2 transition-medium cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{symptom.name}</h3>
                      {getSymptomOccurrences(symptom.id) > 0 && (
                        <Badge variant="outline" className="text-xs bg-muted">
                          {getSymptomOccurrences(symptom.id)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {symptom.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="animate-slide-up">
                      <Label htmlFor={`severity-${symptom.id}`} className="text-xs">
                        Severity
                      </Label>
                      <Select
                        value={selectedSymptom?.severity}
                        onValueChange={(value) =>
                          updateSeverity(
                            symptom.id,
                            value as "mild" | "moderate" | "severe"
                          )
                        }
                      >
                        <SelectTrigger id={`severity-${symptom.id}`} className="h-8 mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional details or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={saveEntry}
            disabled={selectedSymptoms.length === 0}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Symptom Entry
          </Button>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4 animate-fade-in">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No symptom entries yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your pet's symptoms to identify patterns
                </p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden animate-scale-in">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                        {formatDate(entry.date)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEntry(entry.id)}
                        className="h-6 w-6 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {entry.symptoms.map((symptom) => {
                          const symptomDetails = getSymptomById(symptom.symptomId);
                          if (!symptomDetails) return null;

                          return (
                            <Badge
                              key={symptom.symptomId}
                              variant="outline"
                              className={cn(
                                "py-1 px-2",
                                getSeverityColor(symptom.severity)
                              )}
                            >
                              {symptomDetails.name} - {symptom.severity}
                            </Badge>
                          );
                        })}
                      </div>

                      {entry.notes && (
                        <div className="text-sm text-muted-foreground bg-muted/40 p-2 rounded-md">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => setActiveTab("new")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Entry
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SymptomTracker;
