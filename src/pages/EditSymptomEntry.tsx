
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PawPrint, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { useSymptomDiary } from "@/hooks/use-symptom-diary";
import { SymptomEntry } from "@/lib/types";

const EditSymptomEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { entries, loading, deleteEntry } = useSymptomDiary();
  const [entry, setEntry] = useState<SymptomEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Find the entry with the matching id
  useEffect(() => {
    if (!loading && entries.length > 0 && id) {
      const foundEntry = entries.find(e => e.id === id);
      setEntry(foundEntry || null);
    }
  }, [id, entries, loading]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (confirm("Are you sure you want to delete this symptom entry? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteEntry(id);
        toast({
          title: "Entry deleted",
          description: "The symptom entry has been deleted successfully.",
        });
        navigate('/symptom-diary');
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast({
          title: "Error",
          description: "Failed to delete the symptom entry. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50/50 dark:from-background dark:to-blue-950/20">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('/lovable-uploads/9575c134-213b-4839-b573-65f38dc28955.png')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-400/10 dark:text-purple-400/5"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20, 
              opacity: 0,
              rotate: Math.random() * 180 - 90
            }}
            animate={{ 
              y: window.innerHeight + 50,
              opacity: [0, 0.6, 0],
              rotate: Math.random() * 360 - 180
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25 + Math.random() * 20,
              delay: Math.random() * 15,
              ease: "linear"
            }}
          >
            <PawPrint size={20 + Math.random() * 30} />
          </motion.div>
        ))}
      </div>
      
      <div className="container relative pb-20 pt-4 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2 text-purple-700 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Symptom Entry Details
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border border-purple-100/50 dark:border-purple-900/20 shadow-sm bg-white/90 dark:bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-purple-900 dark:text-purple-300">
                Symptom Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : entry ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{entry.petName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{entry.date}</span>
                        <span>•</span>
                        <span>{entry.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Symptoms</h3>
                    <div className="flex flex-wrap gap-2">
                      {entry.symptoms.map((symptom, idx) => (
                        <Badge 
                          key={idx} 
                          className={`${getSeverityColor(symptom.severity)} border px-2 py-1`}
                        >
                          {symptom.name} ({symptom.severity})
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {entry.notes && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notes</h3>
                      <div className="p-3 bg-muted/50 rounded-md text-sm">
                        {entry.notes}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        'Delete Entry'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/symptom-diary')}
                    >
                      Back to Symptom Diary
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Entry Not Found</h3>
                  <p className="text-muted-foreground mb-6">
                    The symptom entry you're looking for doesn't exist or has been deleted.
                  </p>
                  <Button 
                    onClick={() => navigate('/symptom-diary')} 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Back to Symptom Diary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default EditSymptomEntry;
