import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ClipboardList, 
  BookOpen, 
  Database, 
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/symptom-diary", label: "Symptoms", icon: ClipboardList },
  { path: "/elimination-diet", label: "Diet", icon: BookOpen },
  { path: "/food-database", label: "Foods", icon: Database },
  { path: "/reminders", label: "Reminders", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
];

const BottomNavigation = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Items per page (3 visible at a time)
  const itemsPerPage = 3;
  const totalPages = Math.ceil(navItems.length / itemsPerPage);
  
  // Get the current visible items
  const visibleItems = navItems.slice(
    currentPage * itemsPerPage, 
    Math.min((currentPage + 1) * itemsPerPage, navItems.length)
  );
  
  // Find active item page
  useEffect(() => {
    const activeItemIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeItemIndex >= 0) {
      const activePage = Math.floor(activeItemIndex / itemsPerPage);
      setCurrentPage(activePage);
    }
  }, [location.pathname]);
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    
    // Swipe threshold (min distance to register a swipe)
    const swipeThreshold = 50;
    
    if (deltaX > swipeThreshold && currentPage > 0) {
      // Swipe right - previous page
      setCurrentPage(prev => prev - 1);
    } else if (deltaX < -swipeThreshold && currentPage < totalPages - 1) {
      // Swipe left - next page
      setCurrentPage(prev => prev + 1);
    }
    
    setIsSwiping(false);
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fix the navigation handler to properly navigate to home
  const handleNavigation = (path: string) => {
    // Use navigate function directly with the path
    navigate(path);
  };
  
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
        {/* Previous page button */}
        <motion.button
          className={cn(
            "absolute left-1 z-20 w-8 h-8 flex items-center justify-center rounded-full",
            "bg-primary/10 text-primary transition-all",
            currentPage === 0 ? "opacity-0" : "opacity-100"
          )}
          whileTap={{ scale: 0.9 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous menu page"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        
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
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex flex-col items-center justify-center w-[33%] h-full px-1",
                      "transition-all duration-300 relative",
                      "touch-manipulation active:scale-95", 
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={item.label}
                  >
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <motion.div
                      animate={{ 
                        y: isActive ? -2 : 0,
                        scale: isActive ? 1.1 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative z-10"
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mb-1",
                        isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                      )} />
                    </motion.div>
                    
                    <motion.span 
                      className="text-xs font-medium truncate max-w-full relative z-10"
                      animate={{ 
                        scale: isActive ? 1.05 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {item.label}
                    </motion.span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTabDot"
                        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Next page button */}
        <motion.button
          className={cn(
            "absolute right-1 z-20 w-8 h-8 flex items-center justify-center rounded-full",
            "bg-primary/10 text-primary transition-all",
            currentPage === totalPages - 1 ? "opacity-0" : "opacity-100"
          )}
          whileTap={{ scale: 0.9 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          aria-label="Next menu page"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
        
        {/* Page indicator dots */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-0.5">
          {Array.from({ length: totalPages }).map((_, index) => (
            <motion.div
              key={`dot-${index}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === currentPage 
                  ? "w-3 bg-primary" 
                  : "w-1 bg-primary/30"
              )}
              animate={{
                width: index === currentPage ? 12 : 4,
                opacity: index === currentPage ? 1 : 0.5
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
