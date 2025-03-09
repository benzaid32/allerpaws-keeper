
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, isQueryError, safelyUnwrapResult } from "@/integrations/supabase/client";
import { markUserChanges } from "@/lib/sync-utils";
import CustomSymptomDialog from "@/components/symptoms/CustomSymptomDialog";

interface Symptom {
  id: string;
  name: string;
  description?: string;
  severity_options: string[];
  is_custom?: boolean;
  created_by_user_id?: string;
}

interface SymptomEntryFormProps {
  petId: string;
  onSuccess: () => void;
}

interface FormValues {
  date: string;
  time: string;
  notes: string;
}

const SymptomEntryForm: React.FC<SymptomEntryFormProps> = ({ petId, onSuccess }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<{
    symptomId: string;
    severity: string;
    notes?: string;
  }[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<string>("");
  const [currentSeverity, setCurrentSeverity] = useState<string>("mild");
  const [symptomNote, setSymptomNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingSymptoms, setFetchingSymptoms] = useState(true);
  const [customSymptomDialogOpen, setCustomSymptomDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: "",
    },
  });
  
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setFetchingSymptoms(true);
        const { data, error } = await supabase
          .from("symptoms")
          .select("*")
          .order("name");
          
        if (error) throw error;
        
        if (data) {
          // Transform data to match the Symptom interface
          const mappedSymptoms: Symptom[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            severity_options: item.severity_options || ['mild', 'moderate', 'severe'],
            is_custom: item.is_custom,
            created_by_user_id: item.created_by_user_id
          }));
          
          setSymptoms(mappedSymptoms);
          
          if (mappedSymptoms.length > 0) {
            setCurrentSymptom(mappedSymptoms[0].id);
          }
        }
      } catch (error: any) {
        console.error("Error fetching symptoms:", error.message);
        toast({
          title: "Error",
          description: "Failed to load symptoms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setFetchingSymptoms(false);
      }
    };
    
    fetchSymptoms();
  }, [toast]);
  
  const addSymptom = () => {
    if (!currentSymptom) return;
    
    // Check if symptom is already added
    const alreadyAdded = selectedSymptoms.some(
      (s) => s.symptomId === currentSymptom
    );
    
    if (alreadyAdded) {
      toast({
        title: "Symptom already added",
        description: "This symptom is already included. You can edit its severity if needed.",
        variant: "destructive",
      });
      return;
    }
    
    const symptomObj = symptoms.find((s) => s.id === currentSymptom);
    
    if (symptomObj) {
      setSelectedSymptoms((prev) => [
        ...prev,
        {
          symptomId: currentSymptom,
          severity: currentSeverity,
          notes: symptomNote.trim() || undefined,
        },
      ]);
      
      // Reset symptom note
      setSymptomNote("");
    }
  };
  
  const removeSymptom = (index: number) => {
    const updatedSymptoms = [...selectedSymptoms];
    updatedSymptoms.splice(index, 1);
    setSelectedSymptoms(updatedSymptoms);
  };

  const handleCustomSymptomCreated = (symptomId: string, symptomName: string) => {
    // Add the new symptom to our local symptoms list
    const newSymptom: Symptom = {
      id: symptomId,
      name: symptomName,
      severity_options: ['mild', 'moderate', 'severe'],
      is_custom: true
    };
    
    setSymptoms(prev => [...prev, newSymptom]);
    
    // Select the newly created symptom
    setCurrentSymptom(symptomId);
    
    toast({
      title: "Custom symptom added",
      description: `"${symptomName}" is now available for selection.`,
    });
  };
  
  const onSubmit = async (values: FormValues) => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: "No symptoms added",
        description: "Please add at least one symptom.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Combine date and time
      const dateTime = new Date(`${values.date}T${values.time}`);
      
      // Insert symptom entry - using the correct "filter" approach instead of "eq"
      const { data: entryData, error: entryError } = await supabase
        .from("symptom_entries")
        .insert({
          pet_id: petId,
          date: dateTime.toISOString(),
          notes: values.notes,
        })
        .select("id")
        .single();
        
      if (entryError) throw entryError;
      
      if (!entryData || !entryData.id) {
        throw new Error("Failed to create symptom entry - no ID returned");
      }
      
      // Insert symptom details
      const symptomDetailsPromises = selectedSymptoms.map(symptom => 
        supabase
          .from("symptom_details")
          .insert({
            entry_id: entryData.id,
            symptom_id: symptom.symptomId,
            severity: symptom.severity,
            notes: symptom.notes || null,
          })
      );
      
      const results = await Promise.all(symptomDetailsPromises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        console.error("Errors inserting symptom details:", errors);
        throw new Error("Some symptom details could not be saved");
      }
      
      // Mark that user has made changes to symptoms data
      markUserChanges('symptoms');
      
      // Emit a custom event to notify that data has changed
      window.dispatchEvent(new CustomEvent('data-sync-complete', { 
        detail: { dataType: 'symptoms', tag: 'sync-symptoms' } 
      }));
      
      // Notify other browser tabs about the update
      try {
        const timestamp = new Date().getTime();
        localStorage.setItem('symptoms_updated', timestamp.toString());
      } catch (e) {
        console.warn('Could not update localStorage for cross-tab notification', e);
      }
      
      toast({
        title: "Entry added",
        description: "Symptom entry successfully recorded.",
      });
      
      // Reset form
      reset();
      setSelectedSymptoms([]);
      
      // Call success callback
      onSuccess();
    } catch (error: any) {
      console.error("Error adding symptom entry:", error.message);
      toast({
        title: "Error",
        description: "Failed to save symptom entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            {...register("time", { required: "Time is required" })}
          />
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Symptoms</Label>
        {fetchingSymptoms ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Select
                  value={currentSymptom}
                  onValueChange={setCurrentSymptom}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select symptom" />
                  </SelectTrigger>
                  <SelectContent>
                    {symptoms.map((symptom) => (
                      <SelectItem key={symptom.id} value={symptom.id}>
                        {symptom.name} {symptom.is_custom && "(Custom)"}
                      </SelectItem>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start pl-2 text-primary hover:text-primary/90 font-normal"
                      onClick={(e) => {
                        e.preventDefault();
                        setCustomSymptomDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Custom Symptom
                    </Button>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-[120px]">
                <Select
                  value={currentSeverity}
                  onValueChange={setCurrentSeverity}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="button" 
                size="sm" 
                onClick={addSymptom} 
                aria-label="Add symptom"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-2">
              <Textarea
                placeholder="Optional notes about this symptom"
                value={symptomNote}
                onChange={(e) => setSymptomNote(e.target.value)}
                className="mt-2"
              />
            </div>
            
            {selectedSymptoms.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Selected Symptoms:</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSymptoms.map((symptom, index) => {
                    const symptomObj = symptoms.find((s) => s.id === symptom.symptomId);
                    return (
                      <Badge
                        key={`${symptom.symptomId}-${index}`}
                        variant={
                          symptom.severity === "mild" ? "outline" :
                          symptom.severity === "moderate" ? "secondary" :
                          "destructive"
                        }
                        className="pl-2 pr-1 py-1 flex items-center gap-1"
                      >
                        <span>
                          {symptomObj?.name} ({symptom.severity})
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-muted"
                          onClick={() => removeSymptom(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about the symptoms or possible triggers"
          {...register("notes")}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || selectedSymptoms.length === 0}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Entry"
        )}
      </Button>

      {/* Custom Symptom Dialog */}
      <CustomSymptomDialog
        open={customSymptomDialogOpen}
        onOpenChange={setCustomSymptomDialogOpen}
        onSymptomCreated={handleCustomSymptomCreated}
      />
    </form>
  );
};

export default SymptomEntryForm;
