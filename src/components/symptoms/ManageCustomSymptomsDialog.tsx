
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Symptom } from "@/lib/types";

interface ManageCustomSymptomsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSymptomDeleted?: () => void;
}

const ManageCustomSymptomsDialog: React.FC<ManageCustomSymptomsDialogProps> = ({
  open,
  onOpenChange,
  onSymptomDeleted,
}) => {
  const [customSymptoms, setCustomSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch custom symptoms when dialog opens
  useEffect(() => {
    if (open && user) {
      fetchCustomSymptoms();
    }
  }, [open, user]);

  const fetchCustomSymptoms = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("symptoms")
        .select("*")
        .eq("created_by_user_id", user.id)
        .eq("is_custom", true);
        
      if (error) throw error;
      
      // Map database results to Symptom type
      const mappedSymptoms: Symptom[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        severity: "mild", // Default value since this is required by the Symptom type
        severity_options: item.severity_options,
        icon: undefined,
        isCustom: item.is_custom || false,
        created_by_user_id: item.created_by_user_id
      }));
      
      setCustomSymptoms(mappedSymptoms);
    } catch (error: any) {
      console.error("Error fetching custom symptoms:", error.message);
      toast({
        title: "Error",
        description: "Failed to load your custom symptoms.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSymptom = async (symptomId: string) => {
    if (!user) return;
    
    setDeleteLoading(symptomId);
    try {
      // First check if this symptom is used in any entries
      const { data: usageData, error: usageError } = await supabase
        .from("symptom_details")
        .select("id")
        .eq("symptom_id", symptomId)
        .limit(1);
        
      if (usageError) throw usageError;
      
      // If symptom is in use, show warning and don't delete
      if (usageData && usageData.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This symptom is used in one or more entries and cannot be deleted.",
          variant: "destructive",
        });
        return;
      }
      
      // Delete the symptom
      const { error } = await supabase
        .from("symptoms")
        .delete()
        .eq("id", symptomId)
        .eq("created_by_user_id", user.id)
        .eq("is_custom", true);
        
      if (error) throw error;
      
      toast({
        title: "Symptom Deleted",
        description: "The custom symptom has been removed.",
      });
      
      // Update the local state
      setCustomSymptoms(customSymptoms.filter(s => s.id !== symptomId));
      
      // Callback to notify parent component
      if (onSymptomDeleted) {
        onSymptomDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting symptom:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete the symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Custom Symptoms</DialogTitle>
          <DialogDescription>
            View and delete custom symptoms you've created.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : customSymptoms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't created any custom symptoms yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  onOpenChange(false);
                  // You would typically open the CustomSymptomDialog here
                  // This requires coordination with the parent component
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Symptom
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {customSymptoms.map((symptom) => (
                <li key={symptom.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <h4 className="font-medium">{symptom.name}</h4>
                    {symptom.description && (
                      <p className="text-sm text-muted-foreground">{symptom.description}</p>
                    )}
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Custom Symptom</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{symptom.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSymptom(symptom.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteLoading === symptom.id ? (
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
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <DialogFooter className="pt-4">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCustomSymptomsDialog;
