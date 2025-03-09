
import React from "react";
import { Sun, Moon } from "lucide-react";
import { Label } from "@/components/ui/label";
import MobileCard from "@/components/ui/mobile-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/components/ui/theme-provider";

const ThemeCard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <MobileCard
      icon={<Sun className="h-5 w-5 text-primary" />}
      title="Display"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <ToggleGroup 
            type="single" 
            value={theme} 
            onValueChange={(value) => value && setTheme(value)}
            className="justify-start"
          >
            <ToggleGroupItem value="light" aria-label="Light mode">
              <Sun className="h-4 w-4 mr-2" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Dark mode">
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </MobileCard>
  );
};

export default ThemeCard;
