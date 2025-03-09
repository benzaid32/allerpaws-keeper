
import React, { useState } from 'react';
import { Symptom } from "@/lib/types";
import { AlertTriangle, Loader2, Trash2, Edit, Info, Search, ThermometerSnowflake, ThermometerSun, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { triggerDataRefresh } from "@/lib/sync-utils";
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
import { motion } from "framer-motion";

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
      
      // Trigger a complete sync refresh for all symptom data
      triggerDataRefresh('symptoms');
      
      toast({
        title: "Symptom Deleted",
        description: "The symptom has been removed successfully.",
      });
      
      // Force immediate refresh of the symptoms list
      onRefresh();
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

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return <ThermometerSnowflake className="h-3 w-3" />;
      case 'moderate':
        return <Gauge className="h-3 w-3" />;
      case 'severe':
        return <ThermometerSun className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case 'moderate':
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      case 'severe':
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 border-purple-100 dark:border-purple-900/40 focus-visible:ring-purple-500"
        />
      </div>
      
      {filteredSymptoms.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No symptoms found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 
              "Try adjusting your search term." : 
              "There are no symptoms in this category yet."}
          </p>
        </motion.div>
      ) : (
        <ul className="space-y-3">
          {filteredSymptoms.map((symptom, index) => (
            <motion.li 
              key={symptom.id}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="rounded-lg bg-card shadow-sm border border-border hover:border-purple-200 dark:hover:border-purple-800 transition-all"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-medium">{symptom.name}</h3>
                      <Badge 
                        variant={symptom.isCustom ? "secondary" : "outline"} 
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {getSymptomTypeLabel(symptom)}
                      </Badge>
                    </div>
                    {symptom.description && (
                      <p className="text-muted-foreground text-xs mb-2">{symptom.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {symptom.severity_options?.map((severity, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className={`text-[10px] px-1.5 py-0 h-4 flex items-center gap-1 ${getSeverityColor(severity)}`}
                        >
                          {getSeverityIcon(severity)}
                          {severity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    {canDelete(symptom) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteClick(symptom)}
                              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Delete symptom</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="h-8 w-8 flex items-center justify-center text-muted-foreground opacity-50">
                              <Info className="h-4 w-4" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>System symptoms cannot be deleted</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
      
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Symptom?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this custom symptom. This action cannot be undone.
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
