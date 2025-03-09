
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataSync } from "@/contexts/DataSyncContext";
import { Loader2, CloudSync, CloudOff } from "lucide-react";

export const DataSyncCard = () => {
  const { 
    isOnlineOnly, 
    toggleOnlineMode, 
    syncFrequency, 
    setSyncFrequency, 
    lastSyncTime, 
    syncNow,
    isSyncing
  } = useDataSync();

  const formatLastSync = () => {
    if (!lastSyncTime) return "Never";
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastSyncTime.toDateString() === today.toDateString()) {
      return `Today at ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (lastSyncTime.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return lastSyncTime.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Data Synchronization</span>
          {isOnlineOnly ? (
            <CloudSync className="h-5 w-5 text-primary" />
          ) : (
            <CloudOff className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>
          Control how your data is stored and synced
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium">Cloud Synchronization</h3>
            <p className="text-xs text-muted-foreground">
              {isOnlineOnly
                ? "Your data is stored in the cloud and synced across devices"
                : "Your data is stored on this device only"}
            </p>
          </div>
          <Switch
            checked={isOnlineOnly}
            onCheckedChange={toggleOnlineMode}
          />
        </div>
        
        {isOnlineOnly && (
          <>
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Sync Frequency</h3>
              <Select
                value={syncFrequency}
                onValueChange={(value) => setSyncFrequency(value as 'weekly' | 'monthly' | 'manual' | 'never')}
                disabled={!isOnlineOnly}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual only</SelectItem>
                  <SelectItem value="never">Never (local only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium">Last Synced</h3>
                <p className="text-xs text-muted-foreground">
                  {formatLastSync()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={syncNow}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <CloudSync className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        {isOnlineOnly
          ? "Your data is securely stored and accessible from any device."
          : "Warning: If you lose this device, your data cannot be recovered."}
      </CardFooter>
    </Card>
  );
};
