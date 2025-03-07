
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";

interface PetsActionBarProps {
  onAddPet: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const PetsActionBar: React.FC<PetsActionBarProps> = ({
  onAddPet,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        onClick={onAddPet} 
        className="flex-1"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Pet
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="w-10 h-10"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
