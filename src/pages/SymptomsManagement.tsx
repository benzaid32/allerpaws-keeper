
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
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
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
      <div className="container relative pb-20 pt-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="mr-2 text-purple-700 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Symptoms Management
              </h1>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Symptom
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border border-purple-100/50 dark:border-purple-900/20 shadow-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-purple-900 dark:text-purple-300">
                Manage Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="all">All Symptoms</TabsTrigger>
                  <TabsTrigger value="custom">My Custom Symptoms</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-2">
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
                
                <TabsContent value="custom" className="mt-2">
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
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven't created any custom symptoms yet.</p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Add Your First Symptom
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <CustomSymptomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSymptomCreated={handleSymptomCreated}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default SymptomsManagement;
