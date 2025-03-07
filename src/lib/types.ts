
export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed?: string;
  age?: number;
  weight?: number;
  knownAllergies: string[];
  imageUrl?: string;
};

export type Symptom = {
  id: string;
  name: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  icon?: string;
};

export type SymptomEntry = {
  id: string;
  petId: string;
  petName?: string; // Added missing property
  date: string;
  time?: string; // Added missing property
  symptoms: {
    symptomId: string;
    name?: string;
    severity: "mild" | "moderate" | "severe";
    notes?: string;
  }[];
  notes?: string;
};

export type FoodEntry = {
  id: string;
  petId: string;
  date: string;
  foods: {
    name: string;
    type: "regular" | "treat" | "supplement";
    ingredients?: string[];
    amount?: string;
    notes?: string;
  }[];
};

export type FoodProduct = {
  id: string;
  name: string;
  brand: string;
  type: "dry" | "wet" | "treat" | "supplement";
  species: "dog" | "cat" | "both";
  ingredients: string[];
  allergens: string[];
  imageUrl?: string;
};

export type EliminationPhase = {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  tips: string[];
  recommendedFoods?: string[];
};

// New type for Reminders
export type Reminder = {
  id: string;
  title: string;
  description?: string;
  time: string;
  days: string[];
  petId?: string;
  petName?: string;
  active: boolean;
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type NavigationItem = {
  name: string;
  path: string;
  icon: string;
};

// New type for notification settings
export type NotificationSettings = {
  enabled: boolean;
  lastUpdated: Date;
};
