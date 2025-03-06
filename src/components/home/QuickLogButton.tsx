
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QuickLogButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleQuickLog = () => {
    navigate("/symptom-diary/new");
    toast({
      title: "Quick Log",
      description: "Opening the symptom log form",
    });
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button onClick={handleQuickLog} size="lg" className="rounded-full h-14 w-14 p-0">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default QuickLogButton;
