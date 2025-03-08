
import React from "react";

interface EntryNotesProps {
  notes?: string;
}

const EntryNotes = ({ notes }: EntryNotesProps) => {
  if (!notes) return null;
  
  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="font-medium mb-2">Entry Notes</h3>
      <p className="text-sm text-muted-foreground">
        {notes}
      </p>
    </div>
  );
};

export default EntryNotes;
