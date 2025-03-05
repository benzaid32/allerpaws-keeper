
import { Symptom, EliminationPhase, OnboardingStep, NavigationItem } from "./types";

export const COMMON_SYMPTOMS: Symptom[] = [
  {
    id: "itchy-skin",
    name: "Itchy Skin",
    description: "Frequent scratching, licking, or chewing of the skin",
    severity: "moderate",
    icon: "paw-print"
  },
  {
    id: "ear-infection",
    name: "Ear Infection",
    description: "Red, inflamed ears with discharge or odor",
    severity: "moderate",
    icon: "ear"
  },
  {
    id: "vomiting",
    name: "Vomiting",
    description: "Throwing up food or bile",
    severity: "moderate",
    icon: "thermometer"
  },
  {
    id: "diarrhea",
    name: "Diarrhea",
    description: "Loose or watery stool",
    severity: "moderate",
    icon: "poop"
  },
  {
    id: "gas",
    name: "Gas",
    description: "Excessive flatulence",
    severity: "mild",
    icon: "wind"
  },
  {
    id: "rash",
    name: "Rash",
    description: "Red, inflamed skin with or without bumps",
    severity: "moderate",
    icon: "activity"
  },
  {
    id: "hair-loss",
    name: "Hair Loss",
    description: "Patches of missing fur",
    severity: "moderate",
    icon: "scissors"
  },
  {
    id: "paw-licking",
    name: "Paw Licking",
    description: "Excessive licking or chewing of paws",
    severity: "moderate",
    icon: "footprints"
  }
];

export const COMMON_ALLERGENS: string[] = [
  "Beef",
  "Chicken",
  "Dairy",
  "Egg",
  "Fish",
  "Wheat",
  "Soy",
  "Corn",
  "Lamb",
  "Pork",
  "Turkey",
  "Rabbit",
  "Duck",
  "Venison",
  "Potato",
  "Rice"
];

export const ELIMINATION_PHASES: EliminationPhase[] = [
  {
    id: "preparation",
    name: "Preparation",
    description: "Prepare for the elimination diet by gathering necessary supplies and selecting an appropriate novel protein diet.",
    duration: 7,
    tips: [
      "Consult with your veterinarian before starting",
      "Select a novel protein your pet hasn't been exposed to",
      "Remove all treats, table scraps, and flavored medications"
    ]
  },
  {
    id: "strict-elimination",
    name: "Strict Elimination",
    description: "Feed only the selected novel protein diet with no other foods, treats, or supplements.",
    duration: 56, // 8 weeks
    tips: [
      "Be consistent - feed only the elimination diet",
      "Monitor and record symptoms daily",
      "Don't introduce any new foods during this phase",
      "Wash food bowls thoroughly to avoid contamination"
    ]
  },
  {
    id: "challenge",
    name: "Challenge Phase",
    description: "Slowly reintroduce potential allergens one at a time while monitoring for reactions.",
    duration: 42, // 6 weeks
    tips: [
      "Introduce one ingredient at a time",
      "Wait 1-2 weeks before introducing another ingredient",
      "If symptoms return, remove the ingredient immediately",
      "Keep detailed notes of reactions"
    ]
  },
  {
    id: "maintenance",
    name: "Maintenance",
    description: "Maintain a diet that excludes identified allergens while providing complete nutrition.",
    duration: 30, // ongoing
    tips: [
      "Create a sustainable diet plan",
      "Continue to monitor for new symptoms",
      "Consider periodic rechecks with your vet",
      "Read all ingredient labels carefully"
    ]
  }
];

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to AllerPaws",
    description: "Your companion for managing your pet's food allergies and sensitivities."
  },
  {
    id: "pet-info",
    title: "Tell Us About Your Pet",
    description: "Let's set up a profile for your furry friend so we can personalize your experience."
  },
  {
    id: "allergy-info",
    title: "Allergy Information",
    description: "Share what you know about your pet's allergies to get started."
  },
  {
    id: "track-symptoms",
    title: "Track Symptoms",
    description: "Monitor your pet's symptoms to identify patterns and triggers."
  },
  {
    id: "explore-foods",
    title: "Explore Safe Foods",
    description: "Find suitable food options based on your pet's specific needs."
  }
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "layout-dashboard"
  },
  {
    name: "Symptoms",
    path: "/symptoms",
    icon: "clipboard-list"
  },
  {
    name: "Food Log",
    path: "/food",
    icon: "utensils"
  },
  {
    name: "Diet Plan",
    path: "/diet",
    icon: "calendar"
  },
  {
    name: "Food Database",
    path: "/database",
    icon: "database"
  },
  {
    name: "Education",
    path: "/education",
    icon: "book-open"
  }
];
