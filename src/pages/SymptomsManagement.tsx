
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";
import { Symptom } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SymptomsListView from '@/components/symptoms/SymptomsListView';
import CustomSymptomDialog from '@/components/symptoms/CustomSymptomDialog';

const SymptomsManagement = () => {
  const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const fetchSymptoms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch all symptoms
      const { data: symptomData, error } = await supabase
        .from("symptoms")
        .select("*")
        .order("name");
        
      if (error) throw error;

      // Map database results to Symptom type
      const mappedSymptoms: Symptom[] = (symptomData || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        severity: "mild", // Default value for display
        severity_options: item.severity_options,
        icon: undefined,
        isCustom: item.is_custom || false,
        created_by_user_id: item.created_by_user_id
      }));

      setAllSymptoms(mappedSymptoms);
      
      // Filter custom symptoms created by the user
      setCustomSymptoms(mappedSymptoms.filter(
        symptom => symptom.isCustom && symptom.created_by_user_id === user.id
      ));
    } catch (error: any) {
      console.error("Error fetching symptoms:", error.message);
      toast({
        title: "Error",
        description: "Failed to load symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, [user]);

  const handleSymptomCreated = (symptomId: string, symptomName: string) => {
    toast({
      title: "Symptom Added",
      description: `"${symptomName}" has been added to the symptoms list.`,
    });
    fetchSymptoms(); // Refresh the list
  };

  const canDeleteSymptom = (symptom: Symptom) => {
    // User can only delete their own custom symptoms
    return symptom.isCustom && symptom.created_by_user_id === user?.id;
  };

  // Custom header content with gradient title and add button
  const headerContent = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Symptoms Management
        </h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Manage your symptom library and create custom symptoms for tracking
      </p>
    </div>
  );

  return (
    <MobileLayout headerContent={headerContent} className="bg-gradient-to-br from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <Card className="border border-purple-100/50 dark:border-purple-900/20 shadow-sm overflow-hidden">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 rounded-none bg-muted/50">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-background data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
              >
                All Symptoms
              </TabsTrigger>
              <TabsTrigger 
                value="custom"
                className="data-[state=active]:bg-background data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400"
              >
                My Custom
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
              ) : (
                <SymptomsListView 
                  symptoms={allSymptoms}
                  onRefresh={fetchSymptoms}
                  canDelete={canDeleteSymptom}
                />
              )}
            </TabsContent>
            
            <TabsContent value="custom" className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
              ) : customSymptoms.length > 0 ? (
                <SymptomsListView 
                  symptoms={customSymptoms}
                  onRefresh={fetchSymptoms}
                  canDelete={canDeleteSymptom}
                />
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <PlusCircle className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No custom symptoms</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Create your own symptom definitions to better track your health
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Symptom
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
      
      <CustomSymptomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSymptomCreated={handleSymptomCreated}
      />
    </MobileLayout>
  );
};

export default SymptomsManagement;
