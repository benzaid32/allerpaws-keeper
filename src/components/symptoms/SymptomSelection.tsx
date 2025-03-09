
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import AddCustomSymptomButton from "./AddCustomSymptomButton";

interface Symptom {
  id: string;
  name: string;
  description?: string;
  severity_options?: string[];
  is_custom?: boolean;
  created_by_user_id?: string;
}

interface SymptomSelectionProps {
  symptoms: Symptom[];
  selectedSymptoms: string[];
  onSymptomChange: (symptomId: string, checked: boolean) => void;
  onCustomSymptomCreated: (symptomId: string, symptomName: string) => void;
}

const SymptomSelection: React.FC<SymptomSelectionProps> = ({
  symptoms,
  selectedSymptoms,
  onSymptomChange,
  onCustomSymptomCreated
}) => {
  // Separate custom symptoms for better display organization
  const predefinedSymptoms = symptoms.filter(s => !s.is_custom);
  const customSymptoms = symptoms.filter(s => s.is_custom);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {predefinedSymptoms.map((symptom) => (
          <div key={symptom.id} className="flex items-start space-x-2">
            <Checkbox
              id={`symptom-${symptom.id}`}
              checked={selectedSymptoms.includes(symptom.id)}
              onCheckedChange={(checked) => {
                onSymptomChange(symptom.id, checked as boolean);
              }}
            />
            <Label
              htmlFor={`symptom-${symptom.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {symptom.name}
            </Label>
          </div>
        ))}
      </div>
      
      {customSymptoms.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <h4 className="text-sm font-medium">Custom Symptoms</h4>
            <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0 text-muted-foreground">
              {customSymptoms.length}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {customSymptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`symptom-${symptom.id}`}
                  checked={selectedSymptoms.includes(symptom.id)}
                  onCheckedChange={(checked) => {
                    onSymptomChange(symptom.id, checked as boolean);
                  }}
                />
                <Label
                  htmlFor={`symptom-${symptom.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {symptom.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <AddCustomSymptomButton onSymptomCreated={onCustomSymptomCreated} />
      </div>
    </div>
  );
};

export default SymptomSelection;
