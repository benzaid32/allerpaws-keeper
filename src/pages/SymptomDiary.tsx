
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";
import SymptomEntryForm from "@/components/SymptomEntryForm";
import { SymptomEntry } from "@/lib/types";

const SymptomDiary = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<SymptomEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<{ id: string, name: string }[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchPets = async () => {
      try {
        const { data, error } = await supabase
          .from("pets")
          .select("id, name")
          .eq("user_id", user.id)
          .order("name");
          
        if (error) throw error;
        
        setPets(data || []);
        if (data && data.length > 0) {
          setSelectedPetId(data[0].id);
        }
      } catch (error: any) {
        console.error("Error fetching pets:", error.message);
        toast({
          title: "Error fetching pets",
          description: "Failed to load your pets. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    fetchPets();
  }, [user, toast]);
  
  useEffect(() => {
    if (!selectedPetId) return;
    
    const fetchEntries = async () => {
      setLoading(true);
      try {
        // Get the start and end of the current month
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        
        // Fetch symptom entries for the selected pet in the current month
        const { data: entriesData, error: entriesError } = await supabase
          .from("symptom_entries")
          .select(`
            id, 
            date, 
            notes, 
            pet_id,
            symptoms:symptom_details(
              id,
              severity,
              notes,
              symptom:symptoms(id, name, description)
            )
          `)
          .eq("pet_id", selectedPetId)
          .gte("date", monthStart.toISOString())
          .lte("date", monthEnd.toISOString())
          .order("date", { ascending: false });
          
        if (entriesError) throw entriesError;
        
        // Transform the data to match our SymptomEntry type
        const formattedEntries = (entriesData || []).map((entry: any) => ({
          id: entry.id,
          petId: entry.pet_id,
          date: entry.date,
          symptoms: entry.symptoms.map((detail: any) => ({
            symptomId: detail.symptom.id,
            name: detail.symptom.name,
            severity: detail.severity as "mild" | "moderate" | "severe",
            notes: detail.notes,
          })),
          notes: entry.notes,
        }));
        
        setEntries(formattedEntries);
      } catch (error: any) {
        console.error("Error fetching entries:", error.message);
        toast({
          title: "Error",
          description: "Failed to load symptom entries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [selectedPetId, currentMonth, toast]);
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
  };
  
  const hasEntriesOnDate = (date: Date) => {
    return entries.some((entry) => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, date);
    });
  };
  
  const getEntriesForDate = (date: Date) => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return isSameDay(entryDate, date);
    });
  };
  
  const handleEntryClick = (entry: SymptomEntry) => {
    setSelectedEntry(entry);
  };
  
  const handleNewEntrySuccess = () => {
    // Refresh entries after a new entry is added
    if (selectedPetId) {
      const fetchEntries = async () => {
        // Similar to the useEffect above, but we don't need to set loading state
        // This is just to refresh the data after adding a new entry
        try {
          const monthStart = startOfMonth(currentMonth);
          const monthEnd = endOfMonth(currentMonth);
          
          const { data: entriesData, error: entriesError } = await supabase
            .from("symptom_entries")
            .select(`
              id, 
              date, 
              notes, 
              pet_id,
              symptoms:symptom_details(
                id,
                severity,
                notes,
                symptom:symptoms(id, name, description)
              )
            `)
            .eq("pet_id", selectedPetId)
            .gte("date", monthStart.toISOString())
            .lte("date", monthEnd.toISOString())
            .order("date", { ascending: false });
            
          if (entriesError) throw entriesError;
          
          const formattedEntries = (entriesData || []).map((entry: any) => ({
            id: entry.id,
            petId: entry.pet_id,
            date: entry.date,
            symptoms: entry.symptoms.map((detail: any) => ({
              symptomId: detail.symptom.id,
              name: detail.symptom.name,
              severity: detail.severity as "mild" | "moderate" | "severe",
              notes: detail.notes,
            })),
            notes: entry.notes,
          }));
          
          setEntries(formattedEntries);
        } catch (error: any) {
          console.error("Error refreshing entries:", error.message);
        }
      };
      
      fetchEntries();
    }
  };
  
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
          <div 
            key={`header-${idx}`} 
            className="text-center text-xs font-medium py-2"
          >
            {day}
          </div>
        ))}
        
        {daysInMonth.map((day, idx) => {
          const hasEntries = hasEntriesOnDate(day);
          const isToday = isSameDay(day, new Date());
          const dayNumber = day.getDate();
          
          // Add empty cells for days before the first of the month
          const firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
          const startingDayOfWeek = firstDayOfMonth.getDay();
          
          if (idx === 0) {
            const emptyDays = [];
            for (let i = 0; i < startingDayOfWeek; i++) {
              emptyDays.push(
                <div key={`empty-${i}`} className="h-10 border-0"></div>
              );
            }
            
            return [
              ...emptyDays,
              <div
                key={day.toISOString()}
                className={`h-10 flex items-center justify-center rounded-full cursor-pointer relative ${
                  isToday ? 'bg-primary text-primary-foreground' : 
                  hasEntries ? 'hover:bg-muted' : ''
                }`}
                onClick={() => hasEntries && getEntriesForDate(day).length > 0 && handleEntryClick(getEntriesForDate(day)[0])}
              >
                <span>{dayNumber}</span>
                {hasEntries && (
                  <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </div>
            ];
          }
          
          return (
            <div
              key={day.toISOString()}
              className={`h-10 flex items-center justify-center rounded-full cursor-pointer relative ${
                isToday ? 'bg-primary text-primary-foreground' : 
                hasEntries ? 'hover:bg-muted' : ''
              }`}
              onClick={() => hasEntries && getEntriesForDate(day).length > 0 && handleEntryClick(getEntriesForDate(day)[0])}
            >
              <span>{dayNumber}</span>
              {hasEntries && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Symptom Diary</h1>
        <p className="text-muted-foreground">Track symptoms over time</p>
      </div>
      
      {pets.length > 0 ? (
        <>
          {pets.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {pets.map(pet => (
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
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Calendar View</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex justify-between items-center mt-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="font-medium">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                renderCalendar()
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Symptom Entry</DialogTitle>
                  </DialogHeader>
                  <SymptomEntryForm 
                    petId={selectedPetId!} 
                    onSuccess={handleNewEntrySuccess} 
                  />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.slice(0, 5).map(entry => (
                    <div 
                      key={entry.id} 
                      className="p-3 border rounded-lg cursor-pointer hover:border-primary/50"
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">
                          {format(new Date(entry.date), "MMMM d, yyyy")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "h:mm a")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {entry.symptoms.map((symptom, idx) => (
                          <Badge 
                            key={`${entry.id}-${idx}`}
                            variant={
                              symptom.severity === "mild" ? "outline" :
                              symptom.severity === "moderate" ? "secondary" :
                              "destructive"
                            }
                          >
                            {symptom.name} ({symptom.severity})
                          </Badge>
                        ))}
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No symptom entries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Entry Detail Dialog */}
          {selectedEntry && (
            <Dialog open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    Symptoms on {format(new Date(selectedEntry.date), "MMMM d, yyyy")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <div>
                    <h3 className="font-medium mb-2">Symptoms:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.symptoms.map((symptom, idx) => (
                        <Badge 
                          key={`detail-${idx}`}
                          variant={
                            symptom.severity === "mild" ? "outline" :
                            symptom.severity === "moderate" ? "secondary" :
                            "destructive"
                          }
                          className="px-3 py-1"
                        >
                          {symptom.name} ({symptom.severity})
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedEntry.notes && (
                    <div>
                      <Label>Notes</Label>
                      <Textarea 
                        value={selectedEntry.notes} 
                        readOnly 
                        className="mt-1 resize-none" 
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              You need to add a pet first to track symptoms.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default SymptomDiary;
