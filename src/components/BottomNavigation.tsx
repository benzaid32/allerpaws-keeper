
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationItem from "./navigation/NavigationItem";
import { navItems } from "./navigation/navigationData";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Get the current path to determine which tab is active
  const currentPath = location.pathname === "/dashboard" ? "/" : location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 shadow-elegant-up safe-bottom">
      <div className="flex h-16 items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map((item) => (
          <NavigationItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            isActive={
              currentPath === item.path ||
              (item.path === "/" && currentPath === "/dashboard")
            }
            onClick={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
