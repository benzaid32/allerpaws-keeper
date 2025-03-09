
import React, { useState } from "react";
import { motion } from "framer-motion";
import MobileLayout from "@/components/layout/MobileLayout";
import AccountCard from "@/components/settings/AccountCard";
import NotificationsCard from "@/components/settings/NotificationsCard";
import ThemeCard from "@/components/settings/ThemeCard";
import SubscriptionCard from "@/components/settings/SubscriptionCard";
import DataSyncCard from "@/components/settings/DataSyncCard";
import PetManagementCard from "@/components/settings/PetManagementCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { forceNextSync } from "@/lib/sync-utils";

const Settings = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Force a refresh of all data
    forceNextSync();
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Data Refreshed",
      description: "All app data has been refreshed",
    });
    
    setIsRefreshing(false);
  };

  return (
    <MobileLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pb-20"
      >
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        {/* New Data Sync Card */}
        <DataSyncCard />
        
        <AccountCard />
        <SubscriptionCard />
        <NotificationsCard />
        <ThemeCard />
        <PetManagementCard />
      </motion.div>
    </MobileLayout>
  );
};

export default Settings;
