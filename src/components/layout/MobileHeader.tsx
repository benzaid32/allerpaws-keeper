import React, { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerContent?: ReactNode;
  className?: string;
  sticky?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  leftContent,
  rightContent,
  centerContent,
  className,
  sticky = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between h-14 mb-4",
        sticky && "sticky top-0 z-30 bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      {/* Left section (back button or custom content) */}
      <div className="flex-none w-1/4 flex justify-start">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          leftContent
        )}
      </div>

      {/* Center section (title or custom content) */}
      <div className="flex-1 flex justify-center">
        {centerContent || (
          title && (
            <h1 className="text-lg font-semibold truncate text-center">
              {title}
            </h1>
          )
        )}
      </div>

      {/* Right section (custom content) */}
      <div className="flex-none w-1/4 flex justify-end">
        {rightContent}
      </div>
    </header>
  );
};

export default MobileHeader; 