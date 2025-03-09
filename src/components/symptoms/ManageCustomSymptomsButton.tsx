
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ManageCustomSymptomsDialog from "./ManageCustomSymptomsDialog";

interface ManageCustomSymptomsButtonProps {
  onSymptomDeleted?: () => void;
}

const ManageCustomSymptomsButton: React.FC<ManageCustomSymptomsButtonProps> = ({
  onSymptomDeleted
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="flex items-center"
      >
        <Settings className="mr-2 h-4 w-4" />
        Manage Custom Symptoms
      </Button>

      <ManageCustomSymptomsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSymptomDeleted={onSymptomDeleted}
      />
    </>
  );
};

export default ManageCustomSymptomsButton;
