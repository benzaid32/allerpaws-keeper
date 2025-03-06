
import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

type ThemeType = "light" | "dark";

interface SettingsState {
  theme: ThemeType;
  notifications: boolean;
}

export const useSettings = () => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get from localStorage or default to system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  
  const [notifications, setNotifications] = useState<boolean>(() => {
    // Get from localStorage or default to true
    const savedNotifications = localStorage.getItem("notifications");
    return savedNotifications !== null ? savedNotifications === "true" : true;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Apply theme to document
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("notifications", String(notifications));
  }, [notifications]);

  const updateTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  const updateNotifications = (enabled: boolean) => {
    setNotifications(enabled);
  };

  return {
    theme,
    notifications,
    updateTheme,
    updateNotifications
  };
};
