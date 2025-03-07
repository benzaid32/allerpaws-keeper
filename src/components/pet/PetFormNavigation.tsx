
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface PetFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  submitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
}

const PetFormNavigation: React.FC<PetFormNavigationProps> = ({
  currentStep,
  totalSteps,
  submitting,
  onPrevious,
  onNext,
  onCancel,
}) => {
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 1 ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      )}

      {currentStep < totalSteps ? (
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      ) : (
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      )}
    </div>
  );
};

export default PetFormNavigation;
