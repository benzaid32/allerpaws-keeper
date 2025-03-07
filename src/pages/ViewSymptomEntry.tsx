
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, AlertCircle, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SymptomEntry } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import BottomNavigation from "@/components/BottomNavigation";

const ViewSymptomEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [entry, setEntry] = useState<SymptomEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const severityColors = {
    mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  useEffect(() => {
    if (!id || !user) return;

    const fetchEntry = async () => {
      try {
        setLoading(true);
        
        // Fetch symptom entry with pet name and symptom details
        const { data: entryData, error: entryError } = await supabase
          .from("symptom_entries")
          .select(`
            id,
            pet_id,
            date,
            notes,
            pets:pet_id (name),
            symptom_details:symptom_details (
              id,
              symptom_id,
              severity,
              notes,
              symptoms:symptom_id (name)
            )
          `)
          .eq("id", id)
          .single();
          
        if (entryError) throw entryError;
        
        // Transform the data to match our SymptomEntry type
        const formattedEntry: SymptomEntry = {
          id: entryData.id,
          petId: entryData.pet_id,
          petName: entryData.pets?.name || "Unknown Pet",
          date: new Date(entryData.date).toISOString().split('T')[0],
          time: new Date(entryData.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          symptoms: entryData.symptom_details?.map(detail => ({
            symptomId: detail.symptom_id,
            name: detail.symptoms?.name,
            severity: detail.severity as "mild" | "moderate" | "severe",
            notes: detail.notes
          })) || [],
          notes: entryData.notes
        };
        
        setEntry(formattedEntry);
      } catch (error: any) {
        console.error("Error fetching symptom entry:", error.message);
        toast({
          title: "Error",
          description: "Failed to load symptom entry",
          variant: "destructive",
        });
        navigate("/symptom-diary");
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id, user, navigate, toast]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      
      // Delete symptom details
      const { error: detailsError } = await supabase
        .from("symptom_details")
        .delete()
        .eq("entry_id", id);
        
      if (detailsError) throw detailsError;
      
      // Delete symptom entry
      const { error: entryError } = await supabase
        .from("symptom_entries")
        .delete()
        .eq("id", id);
        
      if (entryError) throw entryError;
      
      toast({
        title: "Success",
        description: "Symptom entry deleted successfully",
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
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Entry Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>The symptom entry you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button className="mt-4" onClick={() => navigate("/symptom-diary")}>
              Return to Symptom Diary
            </Button>
          </CardContent>
        </Card>
        <BottomNavigation />
      </div>
    );
  }

  // Get the highest severity from all symptoms
  const highestSeverity = entry.symptoms.reduce((max, symptom) => {
    if (symptom.severity === 'severe') return 'severe';
    if (max === 'moderate' || symptom.severity === 'moderate') return 'moderate';
    return 'mild';
  }, 'mild' as 'mild' | 'moderate' | 'severe');

  return (
    <div className="container pb-20">
      <div className="py-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">Symptom Details</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(`/symptom-diary/edit/${entry.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Symptom Entry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this symptom entry? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{entry.petName}</h2>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {entry.date}
                  <Clock className="h-4 w-4 ml-3 mr-1" />
                  {entry.time}
                </div>
              </div>
              <Badge className={severityColors[highestSeverity]}>
                {highestSeverity}
              </Badge>
            </div>
            
            {entry.notes && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="text-sm">{entry.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <h2 className="text-lg font-medium mb-3">Symptoms</h2>
        {entry.symptoms.map((symptom, index) => (
          <Card key={index} className="mb-3">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{symptom.name}</h3>
                <Badge className={severityColors[symptom.severity]}>
                  {symptom.severity}
                </Badge>
              </div>
              {symptom.notes && (
                <>
                  <Separator className="my-3" />
                  <div className="text-sm">{symptom.notes}</div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ViewSymptomEntry;
