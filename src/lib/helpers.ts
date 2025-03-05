
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

// Format a date with smart relative labels
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `Today, ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  } else if (isThisWeek(date)) {
    return format(date, "EEEE, h:mm a");
  } else if (isThisMonth(date)) {
    return format(date, "MMM d, h:mm a");
  } else {
    return format(date, "MMM d, yyyy");
  }
};

// Generate a random ID (for demo purposes)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format symptom severity for display
export const formatSeverity = (severity: "mild" | "moderate" | "severe"): string => {
  switch (severity) {
    case "mild":
      return "Mild";
    case "moderate":
      return "Moderate";
    case "severe":
      return "Severe";
    default:
      return "Unknown";
  }
};

// Get a color based on severity
export const getSeverityColor = (severity: "mild" | "moderate" | "severe"): string => {
  switch (severity) {
    case "mild":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "moderate":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "severe":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Filter allergens from ingredients
export const containsAllergens = (ingredients: string[], allergens: string[]): string[] => {
  return allergens.filter(allergen => 
    ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(allergen.toLowerCase())
    )
  );
};

// Calculate the current phase of elimination diet based on start date
export const calculateEliminationPhase = (startDate: string): number => {
  const start = parseISO(startDate);
  const now = new Date();
  const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysPassed < 7) {
    return 0; // Preparation
  } else if (daysPassed < 63) { // 7 + 56
    return 1; // Strict Elimination
  } else if (daysPassed < 105) { // 7 + 56 + 42
    return 2; // Challenge Phase
  } else {
    return 3; // Maintenance
  }
};

// Get a local storage item with type safety
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  
  try {
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

// Set a local storage item with type safety
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

// Delay for animations
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
