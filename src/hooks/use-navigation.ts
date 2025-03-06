
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "@/components/navigation/navigationData";

export const useNavigation = (itemsPerPage: number = 3) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const totalPages = Math.ceil(navItems.length / itemsPerPage);
  
  // Get the current visible items
  const visibleItems = navItems.slice(
    currentPage * itemsPerPage, 
    Math.min((currentPage + 1) * itemsPerPage, navItems.length)
  );
  
  // Find active item page on location change
  useEffect(() => {
    const activeItemIndex = navItems.findIndex(item => item.path === location.pathname);
    if (activeItemIndex >= 0) {
      const activePage = Math.floor(activeItemIndex / itemsPerPage);
      setCurrentPage(activePage);
    }
  }, [location.pathname, itemsPerPage]);
  
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

  // Navigation handler
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return {
    currentPage,
    totalPages,
    visibleItems,
    handlePageChange,
    handleNavigation,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    location
  };
};
