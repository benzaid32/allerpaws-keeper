
import { UserSubscription } from "@/types/subscriptions";

export interface SubscriptionContextType {
  isLoading: boolean;
  subscription: UserSubscription | null;
  isPremium: boolean;
  maxAllowedPets: number;
  maxEntriesPerMonth: number;
  canAccessAdvancedAnalysis: boolean;
  refreshSubscription: () => Promise<void>;
}
