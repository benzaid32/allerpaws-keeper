
import React from "react";
import { Cloud, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MobileCard from "@/components/ui/mobile-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataSync } from "@/contexts/DataSyncContext";

const DataSyncCard: React.FC = () => {
  const { 
    syncEnabled,
    syncFrequency,
    lastSyncTime,
    toggleSyncEnabled,
    changeSyncFrequency,
    syncNow,
    isSyncing,
    syncStatus
  } = useDataSync();
  
  const formatLastSyncTime = () => {
    if (!lastSyncTime) return "Never";
    
    const date = new Date(lastSyncTime);
    return date.toLocaleString();
  };
  
  return (
    <MobileCard
      icon={<Cloud className="h-5 w-5 text-primary" />}
      title="Data Synchronization"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-1">
            <Label htmlFor="sync-toggle" className="text-base font-normal">
              Sync with Cloud
            </Label>
            <p className="text-sm text-muted-foreground">
              Backup your data to your account
            </p>
          </div>
          <Switch
            id="sync-toggle"
            checked={syncEnabled}
            onCheckedChange={toggleSyncEnabled}
          />
        </div>
        
        {syncEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="sync-frequency">Sync Frequency</Label>
              <Select 
                value={syncFrequency} 
                onValueChange={changeSyncFrequency}
                disabled={isSyncing}
              >
                <SelectTrigger id="sync-frequency" className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Last synced: {formatLastSyncTime()}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={syncNow}
                  disabled={isSyncing}
                >
                  {isSyncing ? "Syncing..." : "Sync Now"}
                </Button>
              </div>
            </div>
            
            {syncStatus === "success" && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-400">Sync Successful</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-500">
                  All your data is backed up to the cloud.
                </AlertDescription>
              </Alert>
            )}
            
            {syncStatus === "error" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Sync Failed</AlertTitle>
                <AlertDescription>
                  Could not sync your data. Please try again later.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        
        {!syncEnabled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Local Storage Only</AlertTitle>
            <AlertDescription>
              Your data is only stored on this device and will be lost if you clear your browser data or uninstall the app.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </MobileCard>
  );
};

export default DataSyncCard;
