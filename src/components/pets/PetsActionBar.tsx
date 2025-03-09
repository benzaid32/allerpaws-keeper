
import React from "react";
import { PlusCircle, Grid, List, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PetsActionBarProps {
  onAddPet: () => void;
  displayMode?: "grid" | "list";
  setDisplayMode?: (mode: "grid" | "list") => void;
  petCount?: number;
  onRefresh?: () => Promise<void> | void;
  isRefreshing?: boolean;
}

export const PetsActionBar: React.FC<PetsActionBarProps> = ({
  onAddPet,
  displayMode = "grid",
  setDisplayMode,
  petCount = 0,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex items-center justify-between bg-white/70 p-3 rounded-lg shadow-sm border">
      <div className="text-sm text-muted-foreground">
        {petCount} {petCount === 1 ? "pet" : "pets"}
      </div>
      
      <div className="flex items-center gap-2">
        {petCount > 0 && setDisplayMode && (
          <ToggleGroup type="single" value={displayMode} onValueChange={(val) => val && setDisplayMode(val as "grid" | "list")}>
            <ToggleGroupItem value="grid" size="sm" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" size="sm" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        
        {onRefresh && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="text-muted-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
        
        <Button size="sm" onClick={onAddPet} className="bg-primary text-white">
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Pet
        </Button>
      </div>
    </div>
  );
};
