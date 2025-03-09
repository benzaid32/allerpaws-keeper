
import React, { useState } from 'react';
import { Symptom } from "@/lib/types";
import { AlertTriangle, Loader2, Trash2, Edit, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SymptomsListViewProps {
  symptoms: Symptom[];
  onRefresh: () => void;
  canDelete: (symptom: Symptom) => boolean;
}

const SymptomsListView: React.FC<SymptomsListViewProps> = ({ 
  symptoms, 
  onRefresh,
  canDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSymptomId, setDeleteSymptomId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredSymptoms = symptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (symptom: Symptom) => {
    setDeleteSymptomId(symptom.id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSymptomId) return;
    
    setIsDeleting(true);
    try {
      // First check if the symptom is used in any entries
      const { data: symptomUsage, error: checkError } = await supabase
        .from("symptom_details")
        .select("id")
        .eq("symptom_id", deleteSymptomId)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (symptomUsage && symptomUsage.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This symptom is being used in one or more entries and cannot be deleted.",
          variant: "destructive",
        });
        return;
      }
      
      // If not used, proceed with deletion
      const { error } = await supabase
        .from("symptoms")
        .delete()
        .eq("id", deleteSymptomId);
        
      if (error) throw error;
      
      toast({
        title: "Symptom Deleted",
        description: "The symptom has been removed successfully.",
      });
      
      onRefresh(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting symptom:", error.message);
      toast({
        title: "Error",
        description: "Failed to delete the symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
      setDeleteSymptomId(null);
    }
  };

  const getSymptomTypeLabel = (symptom: Symptom) => {
    if (symptom.isCustom) {
      return "Custom";
    } else {
      return "System";
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-purple-100 dark:border-purple-900/40"
        />
      </div>
      
      {filteredSymptoms.length === 0 ? (
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No symptoms found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 
              "Try adjusting your search term." : 
              "There are no symptoms in this category yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSymptoms.map((symptom) => (
            <div key={symptom.id} className="rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{symptom.name}</h3>
                    <Badge variant={symptom.isCustom ? "secondary" : "outline"} className="text-xs">
                      {getSymptomTypeLabel(symptom)}
                    </Badge>
                  </div>
                  {symptom.description && (
                    <p className="text-muted-foreground text-sm mt-1">{symptom.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {symptom.severity_options?.map((severity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {severity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Edit functionality could be added here in the future */}
                  {canDelete(symptom) ? (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteClick(symptom)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled
                            className="text-muted-foreground opacity-50 cursor-not-allowed"
                          >
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>System symptoms cannot be deleted</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this symptom. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
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
  );
};

export default SymptomsListView;
