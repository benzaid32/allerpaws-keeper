import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import BottomNavigation from "@/components/BottomNavigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  headerContent?: ReactNode;
  hideNavigation?: boolean;
  fullWidth?: boolean;
  className?: string;
  contentClassName?: string;
  animate?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBack,
  headerContent,
  hideNavigation = false,
  fullWidth = false,
  className,
  contentClassName,
  animate = true,
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  };

  const ContentWrapper = animate ? motion.div : React.Fragment;
  const contentProps = animate
    ? {
        initial: "initial",
        animate: "animate",
        exit: "exit",
        variants: pageVariants,
        transition: pageTransition,
      }
    : {};

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col bg-background",
        "safe-top safe-bottom", // Safe areas for notches and home indicators
        className
      )}
    >
      {/* Main content area with proper padding */}
      <main 
        className={cn(
          "flex-1 flex flex-col",
          !fullWidth && "max-w-md mx-auto w-full",
          "px-4 pt-6 pb-24", // Extra bottom padding for navigation
          contentClassName
        )}
      >
        {/* Custom header content or title */}
        {(title || headerContent) && (
          <div className="mb-6">
            {headerContent || <h1 className="text-2xl font-bold">{title}</h1>}
          </div>
        )}

        {/* Main content with animation */}
        <ContentWrapper {...contentProps} className="flex-1">
          {children}
        </ContentWrapper>
      </main>

      {/* Bottom navigation */}
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default MobileLayout; 