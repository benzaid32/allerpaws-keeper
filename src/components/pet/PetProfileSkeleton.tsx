
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PetProfileSkeletonProps {
  onBack: () => void;
}

const PetProfileSkeleton: React.FC<PetProfileSkeletonProps> = ({ onBack }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="h-8 w-48 rounded-md bg-muted animate-pulse"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-lg bg-muted animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-8 w-32 rounded-md bg-muted animate-pulse"></div>
          <div className="h-24 rounded-md bg-muted animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileSkeleton;
