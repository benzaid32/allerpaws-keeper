export const APP_NAME = "Aller Paws";
export const APP_DESCRIPTION = "Track, manage and prevent pet food allergies with our easy-to-use tools";
export const APP_TAGLINE = "The #1 pet food allergy management platform for dogs and cats";
export const APP_KEYWORDS = [
  "pet food allergy tracker",
  "dog food allergies",
  "cat food allergies",
  "pet symptom tracker",
  "elimination diet for pets",
  "pet allergy management",
  "food sensitivities in pets",
  "hypoallergenic pet food"
];

// Elimination diet phases
export const ELIMINATION_PHASES = [
  {
    id: "1",
    name: "Elimination Phase",
    description: "Remove common allergens from your pet's diet",
    duration: 42, // Changed from string to number (days)
    tips: [
      "Feed your pet a simple diet with novel protein",
      "Remove all treats and supplements temporarily",
      "Keep a detailed food diary",
      "Monitor symptoms closely"
    ],
    recommendedFoods: [
      "Hydrolyzed protein diets",
      "Limited ingredient foods",
      "Novel protein sources (venison, duck, rabbit)"
    ]
  },
  {
    id: "2",
    name: "Stabilization Phase",
    description: "Continue with successful diet to ensure symptoms resolve",
    duration: 21, // Changed from string to number (days)
    tips: [
      "Continue with the elimination diet",
      "Look for complete symptom resolution",
      "Maintain consistent feeding",
      "Start planning for challenges"
    ],
    recommendedFoods: [
      "Continue with successful elimination diet",
      "Maintain consistent protein source",
      "Keep treats limited to same protein source"
    ]
  },
  {
    id: "3",
    name: "Challenge Phase",
    description: "Carefully reintroduce potential allergens",
    duration: 49, // Changed from string to number (days)
    tips: [
      "Introduce one new ingredient at a time",
      "Wait 1-2 weeks between new foods",
      "Document any reactions promptly",
      "Stop if symptoms reappear"
    ],
    recommendedFoods: [
      "Same base diet plus test ingredient",
      "Single-ingredient treats for testing",
      "Carefully selected commercial foods"
    ]
  },
  {
    id: "4",
    name: "Maintenance Phase",
    description: "Long-term diet planning based on results",
    duration: 0, // 0 means ongoing/indefinite
    tips: [
      "Create a personalized safe food list",
      "Establish a long-term feeding plan",
      "Set up regular vet check-ups",
      "Maintain a symptom journal"
    ],
    recommendedFoods: [
      "Customized diet avoiding trigger ingredients",
      "Balanced commercial foods without allergens",
      "Rotation diet if tolerated"
    ]
  }
];

// Severity levels for symptom tracking
export const SEVERITY_LEVELS = ["mild", "moderate", "severe"] as const;

// Onboarding steps with titles and descriptions
export const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Aller Paws",
    description: "Your pet's food allergy management solution"
  },
  {
    id: "symptoms",
    title: "Identify Symptoms",
    description: "Track your pet's allergy symptoms"
  },
  {
    id: "allergies",
    title: "Common Allergies",
    description: "Learn about common food allergies in pets"
  },
  {
    id: "database",
    title: "Food Database",
    description: "Find allergy-friendly food options"
  },
  {
    id: "register",
    title: "Create Account",
    description: "Get started with Aller Paws"
  }
];

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    features: [
      "Up to 10 symptom logs",
      "Basic food database access",
      "Community support",
    ],
    isFree: true,
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    price: {
      amount: 19,
      priceIds: {
        test: "price_1OxxqGA14w4R3Ob9UQyY7jkI",
        production: "",
      },
    },
    features: [
      "Up to 50 symptom logs",
      "Advanced food database access",
      "Email support",
    ],
    isFree: false,
  },
];

// Adding missing constants
export const NAVIGATION_ITEMS = [
  { name: "Home", path: "/dashboard", icon: "home" },
  { name: "Symptoms", path: "/symptom-diary", icon: "clipboard-list" },
  { name: "Diet Guide", path: "/elimination-diet", icon: "book-open" },
  { name: "Foods", path: "/food-database", icon: "database" },
  { name: "Settings", path: "/settings", icon: "settings" }
];

// Update to include severity property with the correct type
export const COMMON_SYMPTOMS = [
  { id: "1", name: "Itching", description: "Excessive scratching or licking", severity: "moderate" as const, icon: "paw" },
  { id: "2", name: "Ear Infection", description: "Redness, swelling, or discharge", severity: "moderate" as const, icon: "ear" },
  { id: "3", name: "Digestive Issues", description: "Vomiting, diarrhea, or flatulence", severity: "moderate" as const, icon: "stomach" },
  { id: "4", name: "Skin Rash", description: "Red, inflamed, or irritated skin", severity: "moderate" as const, icon: "rash" },
  { id: "5", name: "Hair Loss", description: "Patchy or general hair loss", severity: "moderate" as const, icon: "hair" }
];

// Fix allergens to be strings instead of objects
export const COMMON_ALLERGENS = [
  "Beef", "Chicken", "Dairy", "Egg", "Wheat", "Corn", "Soy", "Fish"
];

// SEO-optimized content snippets
export const SEO_CONTENT = {
  homepageIntro: "Discover what's causing your pet's food allergies with Aller Paws, the most comprehensive pet allergy management app. Track symptoms, identify triggers, and create safe meal plans for your dog or cat.",
  foodDiaryDesc: "Keep a detailed record of everything your pet eats and any reactions they experience. Our smart analysis helps identify patterns between foods and symptoms.",
  symptomTrackerDesc: "Log your pet's symptoms including itching, digestive issues, and skin problems. Our visual timeline helps you and your vet identify allergy patterns.",
  eliminationDietDesc: "Follow our vet-approved elimination diet protocol to safely identify your pet's food triggers and sensitivities."
};
