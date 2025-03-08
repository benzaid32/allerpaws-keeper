
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoodEntryActionsProps {
  entryId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const FoodEntryActions = ({ entryId, onEdit, onDelete }: FoodEntryActionsProps) => {
  return (
    <div className="flex gap-3 mt-6">
      <Button
        variant="outline"
        className="flex-1"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button
        variant="destructive"
        className="flex-1"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

export default FoodEntryActions;
