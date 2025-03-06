// Any constant values that were previously defined in this file (other than ONBOARDING_STEPS)
import { format } from "date-fns";

// App information
export const APP_NAME = "AllerPaws";
export const APP_DESCRIPTION = "Track and manage your pet's food allergies";

// Navigation
export const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Pets", href: "/pets" },
  { name: "Food Diary", href: "/food-diary" },
  { name: "Progress", href: "/progress" },
  { name: "Settings", href: "/settings" },
];

// Pet species options
export const PET_SPECIES = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "other", label: "Other" },
];

// Common symptoms for pets
export const COMMON_SYMPTOMS = [
  { id: "itching", name: "Itching/Scratching", description: "Excessive scratching or licking" },
  { id: "redness", name: "Skin Redness", description: "Red, inflamed skin" },
  { id: "vomiting", name: "Vomiting", description: "Throwing up food" },
  { id: "diarrhea", name: "Diarrhea", description: "Loose or watery stool" },
  { id: "ear_infection", name: "Ear Infection", description: "Inflammation of the ear" },
  { id: "gas", name: "Excessive Gas", description: "Flatulence or bloating" },
];

// Severity levels for symptoms
export const SEVERITY_LEVELS = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
];

// Food types
export const FOOD_TYPES = [
  { value: "kibble", label: "Kibble" },
  { value: "wet_food", label: "Wet Food" },
  { value: "raw", label: "Raw Food" },
  { value: "homemade", label: "Homemade" },
  { value: "treats", label: "Treats" },
  { value: "supplement", label: "Supplement" },
  { value: "other", label: "Other" },
];

// Common food allergens for pets
export const COMMON_ALLERGENS = [
  { value: "chicken", label: "Chicken" },
  { value: "beef", label: "Beef" },
  { value: "dairy", label: "Dairy" },
  { value: "wheat", label: "Wheat" },
  { value: "soy", label: "Soy" },
  { value: "corn", label: "Corn" },
  { value: "egg", label: "Egg" },
  { value: "fish", label: "Fish" },
  { value: "lamb", label: "Lamb" },
  { value: "pork", label: "Pork" },
];

// Date formatting functions
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy h:mm a");
};

// Define supported subscription plan types
export const SUBSCRIPTION_PLANS = {
  MONTHLY: "monthly",
  ANNUAL: "annual"
};

// Define subscription statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  INCOMPLETE: "incomplete",
  TRIALING: "trialing"
};
