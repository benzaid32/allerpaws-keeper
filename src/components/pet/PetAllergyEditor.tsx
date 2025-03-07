
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface PetAllergyEditorProps {
  allergies: string[];
  onAllergiesChange: (allergies: string[]) => void;
}

const PetAllergyEditor: React.FC<PetAllergyEditorProps> = ({ 
  allergies, 
  onAllergiesChange 
}) => {
  const [currentAllergy, setCurrentAllergy] = useState("");

  const addAllergy = () => {
    if (currentAllergy.trim() && !allergies.includes(currentAllergy.trim())) {
      onAllergiesChange([...allergies, currentAllergy.trim()]);
      setCurrentAllergy("");
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    onAllergiesChange(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="allergies">Known Allergies</Label>
        <div className="flex space-x-2">
          <Input
            id="currentAllergy"
            value={currentAllergy}
            onChange={(e) => setCurrentAllergy(e.target.value)}
            placeholder="Add an allergy"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAllergy();
              }
            }}
          />
          <Button type="button" onClick={addAllergy} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {allergies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {allergies.map((allergy, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {allergy}
              <button
                type="button"
                onClick={() => removeAllergy(allergy)}
                className="ml-1 text-xs"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetAllergyEditor;
