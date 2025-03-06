
import { Session, User, AuthChangeEvent, Provider } from "@supabase/supabase-js";
import { Pet } from "@/lib/types";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<{ error?: Error, needsEmailConfirmation?: boolean }>;
  loading: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  savePetData?: (petData: Pet) => Promise<boolean>;
};
