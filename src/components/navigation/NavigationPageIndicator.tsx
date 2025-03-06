
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationPageIndicatorProps {
  totalPages: number;
  currentPage: number;
}

const NavigationPageIndicator = ({
  totalPages,
  currentPage,
}: NavigationPageIndicatorProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-0.5">
      {Array.from({ length: totalPages }).map((_, index) => (
        <motion.div
          key={`dot-${index}`}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            index === currentPage ? "w-3 bg-primary" : "w-1 bg-primary/30"
          )}
          animate={{
            width: index === currentPage ? 12 : 4,
            opacity: index === currentPage ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default NavigationPageIndicator;
