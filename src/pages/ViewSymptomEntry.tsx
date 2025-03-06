
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SymptomDetail {
  id: string;
  symptom_id: string;
  symptom_name: string;
  severity: string;
  notes?: string;
}

interface SymptomEntry {
  id: string;
  date: string;
  notes?: string;
  pet_id: string;
  pet_name: string;
  symptom_details: SymptomDetail[];
}

const ViewSymptomEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<SymptomEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        
        // Fetch the entry
        const { data: entryData, error: entryError } = await supabase
          .from("symptom_entries")
          .select(`
            id,
            date,
            notes,
            pet_id,
            pets:pet_id (name)
          `)
          .eq("id", id)
          .single();
          
        if (entryError) throw entryError;
        
        // Fetch the symptom details
        const { data: detailsData, error: detailsError } = await supabase
          .from("symptom_details")
          .select(`
            id,
            symptom_id,
            severity,
            notes,
            symptoms:symptom_id (name)
          `)
          .eq("entry_id", id);
          
        if (detailsError) throw detailsError;
        
        // Format the data
        const formattedEntry: SymptomEntry = {
          id: entryData.id,
          date: entryData.date,
          notes: entryData.notes,
          pet_id: entryData.pet_id,
          pet_name: entryData.pets?.name || "Unknown Pet",
          symptom_details: detailsData.map(detail => ({
            id: detail.id,
            symptom_id: detail.symptom_id,
            symptom_name: detail.symptoms?.name || "Unknown Symptom",
            severity: detail.severity,
            notes: detail.notes
          }))
        };
        
        setEntry(formattedEntry);
      } catch (error: any) {
        console.error("Error fetching symptom entry:", error.message);
        toast({
          title: "Error",
          description: "Failed to load symptom entry",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntry();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!entry) return;
    
    try {
      setLoading(true);
      
      // Delete symptom details first (due to foreign key constraint)
      const { error: detailsError } = await supabase
        .from("symptom_details")
        .delete()
        .eq("entry_id", entry.id);
        
      if (detailsError) throw detailsError;
      
      // Then delete the entry
      const { error: entryError } = await supabase
        .from("symptom_entries")
        .delete()
        .eq("id", entry.id);
        
      if (entryError) throw entryError;
      
      toast({
        title: "Entry deleted",
        description: "Symptom entry has been removed",
      });
      
      navigate("/symptom-diary");
    } catch (error: any) {
      console.error("Error deleting symptom entry:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete symptom entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container pt-6 pb-20">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container pt-6 pb-20">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Entry Not Found</h1>
        </div>
        <p className="text-muted-foreground">The symptom entry you're looking for doesn't exist or has been removed.</p>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="container pt-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Symptom Details</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">
            {entry.pet_name}'s Symptoms
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the symptom entry and all related data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-4 gap-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(entry.date), "MMMM d, yyyy")}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {format(new Date(entry.date), "h:mm a")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {entry.symptom_details.map((detail) => (
                  <Badge
                    key={detail.id}
                    variant={
                      detail.severity === "mild" ? "outline" :
                      detail.severity === "moderate" ? "secondary" :
                      "destructive"
                    }
                    className="py-1 px-2 flex items-center"
                  >
                    {detail.symptom_name} ({detail.severity})
                  </Badge>
                ))}
              </div>
            </div>

            {entry.symptom_details.some(detail => detail.notes) && (
              <div className="space-y-2">
                <h3 className="font-medium">Symptom Notes:</h3>
                <div className="space-y-2">
                  {entry.symptom_details
                    .filter(detail => detail.notes)
                    .map((detail) => (
                      <div key={`note-${detail.id}`} className="bg-muted p-3 rounded-md">
                        <p className="font-medium text-sm mb-1">{detail.symptom_name}:</p>
                        <p className="text-sm text-muted-foreground">{detail.notes}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {entry.notes && (
              <div className="space-y-2">
                <h3 className="font-medium">Additional Notes:</h3>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default ViewSymptomEntry;
