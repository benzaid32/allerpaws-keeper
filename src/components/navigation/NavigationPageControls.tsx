
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationPageControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const NavigationPageControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: NavigationPageControlsProps) => {
  return (
    <>
      {/* Previous page button */}
      <motion.button
        className={cn(
          "absolute left-1 z-20 w-8 h-8 flex items-center justify-center rounded-full",
          "bg-primary/10 text-primary transition-all",
          currentPage === 0 ? "opacity-0" : "opacity-100"
        )}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Previous menu page"
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      {/* Next page button */}
      <motion.button
        className={cn(
          "absolute right-1 z-20 w-8 h-8 flex items-center justify-center rounded-full",
          "bg-primary/10 text-primary transition-all",
          currentPage === totalPages - 1 ? "opacity-0" : "opacity-100"
        )}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        aria-label="Next menu page"
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </>
  );
};

export default NavigationPageControls;
