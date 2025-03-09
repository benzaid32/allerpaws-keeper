
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CustomSymptomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSymptomCreated: (symptomId: string, symptomName: string) => void;
}

const CustomSymptomDialog: React.FC<CustomSymptomDialogProps> = ({
  open,
  onOpenChange,
  onSymptomCreated,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [severityOptions, setSeverityOptions] = useState<string[]>(["mild", "moderate", "severe"]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for the symptom",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Insert the new custom symptom
      const { data, error } = await supabase
        .from("symptoms")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          severity_options: severityOptions,
          is_custom: true,
          created_by_user_id: user?.id
        })
        .select("id, name")
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Symptom created",
        description: `"${name}" has been added to your symptoms list.`,
      });
      
      // Reset form
      setName("");
      setDescription("");
      setSeverityOptions(["mild", "moderate", "severe"]);
      
      // Call the callback with the new symptom ID
      if (data) {
        onSymptomCreated(data.id, data.name);
      }
      
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating custom symptom:", error.message);
      toast({
        title: "Error",
        description: "Failed to create custom symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Symptom</DialogTitle>
          <DialogDescription>
            Create a new symptom that isn't in the predefined list.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="symptom-name">Symptom Name</Label>
            <Input
              id="symptom-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Head Shaking, Sneezing"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symptom-description">Description (Optional)</Label>
            <Textarea
              id="symptom-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details about this symptom"
              className="resize-none"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Symptom"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSymptomDialog;
