import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationItem from "./navigation/NavigationItem";
import { navItems } from "./navigation/navigationData";
import { useNavigation } from "@/hooks/use-navigation";
import NavigationPageIndicator from "./navigation/NavigationPageIndicator";
import NavigationPageControls from "./navigation/NavigationPageControls";

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
  } = useNavigation(3); // Show 3 items per page

  // Get the current path to determine which tab is active
  const currentPath = location.pathname === "/dashboard" ? "/" : location.pathname;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 shadow-elegant-up safe-bottom"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-16 items-center justify-around px-2 py-2 relative">
        {visibleItems.map((item) => (
          <NavigationItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isActive={
              currentPath === item.path ||
              (item.path === "/" && currentPath === "/dashboard")
            }
            onClick={handleNavigation}
          />
        ))}
        
        <NavigationPageControls 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      <NavigationPageIndicator 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default BottomNavigation;
