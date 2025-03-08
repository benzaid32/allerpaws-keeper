
import React from "react";
import { motion } from "framer-motion";
import { User, Settings, Crown, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  userName: string;
  firstName: string;
  isPremium: boolean;
  setIsSigningOut: (value: boolean) => void;
  isSigningOut: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  firstName,
  isPremium,
  setIsSigningOut,
  isSigningOut
}) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const getTodayDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setDropdownOpen(false); // Close dropdown immediately
      
      // Show toast to indicate sign-out is in progress
      toast({
        title: "Signing out...",
        description: "Please wait while we sign you out",
      });
      
      console.log("Dashboard: Initiating sign out process");
      await signOut();
      
      // The page will be redirected by the signOut function in AuthContext
      // But we'll show a success toast anyway in case there's a delay
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      console.error("Dashboard: Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "Could not sign out. Please try again.",
      });
      setIsSigningOut(false); // Reset signing out state on error
    }
  };

  return (
    <>
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="mb-6 overflow-hidden relative border-none shadow-md">
          {/* Card background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/10 backdrop-blur-md"></div>
          
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Hello, {firstName}!</h2>
                <p className="text-muted-foreground">{getTodayDate()}</p>
                
                {isPremium && (
                  <div className="flex items-center mt-2 text-amber-600">
                    <Crown className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Premium Member</span>
                  </div>
                )}
              </div>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {user?.user_metadata?.avatar_url ? (
                      <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all shadow-md">
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/80 to-blue-600/80 flex items-center justify-center ring-2 ring-primary/20 cursor-pointer hover:ring-primary transition-all shadow-md">
                        <span className="text-xl font-bold text-white">{firstName.charAt(0)}</span>
                      </div>
                    )}
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {!isPremium && (
                    <DropdownMenuItem onClick={() => navigate("/pricing")} className="cursor-pointer text-amber-600 font-medium">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade to Premium</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="cursor-pointer text-destructive"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Signing out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default DashboardHeader;
