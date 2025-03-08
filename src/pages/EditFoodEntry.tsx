
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import PatternBackground from "@/components/ui/pattern-background";

const EditFoodEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <MobileLayout
      title="Edit Food Entry"
      showBackButton
      onBack={() => navigate(`/food-entry/${id}`)}
    >
      <PatternBackground color="primary">
        <div className="p-4 text-center">
          <p>This feature is coming soon.</p>
        </div>
      </PatternBackground>
    </MobileLayout>
  );
};

export default EditFoodEntry;
