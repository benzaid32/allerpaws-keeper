
import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import NavigationItem from "./navigation/NavigationItem";
import NavigationPageIndicator from "./navigation/NavigationPageIndicator";
import NavigationPageControls from "./navigation/NavigationPageControls";
import { useNavigation } from "@/hooks/use-navigation";

const BottomNavigation = () => {
  const {
    currentPage,
    totalPages,
    visibleItems,
    handlePageChange,
    handleNavigation,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    location
  } = useNavigation();
  
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 border-t bg-card/90 backdrop-blur-md z-50 shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex justify-between items-center h-16 safe-bottom">
        <NavigationPageControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        
        <div className="flex-1 flex justify-around items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`page-${currentPage}`}
              className="flex-1 flex justify-around items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {visibleItems.map((item) => (
                <NavigationItem
                  key={item.path}
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                  isActive={location.pathname === item.path}
                  onClick={handleNavigation}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <NavigationPageIndicator 
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
