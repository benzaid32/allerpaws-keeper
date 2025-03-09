
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CustomSymptomDialog from "./CustomSymptomDialog";

interface AddCustomSymptomButtonProps {
  onSymptomCreated: (symptomId: string, symptomName: string) => void;
}

const AddCustomSymptomButton: React.FC<AddCustomSymptomButtonProps> = ({ 
  onSymptomCreated 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1 text-sm text-muted-foreground border-dashed"
        onClick={() => setDialogOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Custom Symptom
      </Button>
      
      <CustomSymptomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSymptomCreated={onSymptomCreated}
      />
    </>
  );
};

export default AddCustomSymptomButton;
