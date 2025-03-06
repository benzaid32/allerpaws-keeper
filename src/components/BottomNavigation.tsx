
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "@/components/navigation/navigationData";
import NavigationItem from "@/components/navigation/NavigationItem";
import NavigationPageIndicator from "@/components/navigation/NavigationPageIndicator";
import NavigationPageControls from "@/components/navigation/NavigationPageControls";

const BottomNavigation = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find the active index based on the current location
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);
  
  const handleNavigation = (path: string) => {
    console.log("Navigation to:", path);
    navigate(path);
  };
  
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleNavigation(navItems[newPage].path);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background z-50 border-t">
      <div className="container max-w-md mx-auto relative pb-1">
        <NavigationPageControls
          totalPages={navItems.length}
          currentPage={activeIndex !== -1 ? activeIndex : currentPage}
          onPageChange={handlePageChange}
        />
        
        <div className="flex justify-around items-center h-14">
          {navItems.map((item, index) => (
            <NavigationItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
        
        <NavigationPageIndicator
          totalPages={navItems.length}
          currentPage={activeIndex !== -1 ? activeIndex : currentPage}
        />
      </div>
    </div>
  );
};

export default BottomNavigation;
