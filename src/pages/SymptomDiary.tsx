
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Plus, 
  Clock, 
  Bookmark,
  CalendarClock,
  AlertCircle
} from "lucide-react";
import { useSymptomDiary } from "@/hooks/use-symptom-diary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SymptomDiary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { entries, loading } = useSymptomDiary();
  
  const severityColors = {
    mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            entry.petName.toLowerCase().includes(searchLower) ||
            entry.symptoms.some(s => s.name?.toLowerCase().includes(searchLower)) ||
            (entry.notes?.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .filter(entry => {
        // Filter by tab selection (severity)
        if (activeTab === "all") return true;
        if (activeTab === "mild") return entry.symptoms.some(s => s.severity === "mild");
        if (activeTab === "moderate") return entry.symptoms.some(s => s.severity === "moderate");
        if (activeTab === "severe") return entry.symptoms.some(s => s.severity === "severe");
        return true;
      });
  }, [entries, searchTerm, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20">
      <div className="absolute top-0 right-0 w-full h-64 bg-[url('https://images.unsplash.com/photo-1494947665470-20322015e3a8?auto=format&fit=crop&w=800&q=80')] bg-no-repeat bg-right-top bg-contain opacity-10 dark:opacity-5 z-0"></div>
      
      <div className="container relative pb-20 pt-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">Symptom Diary</h1>
          <Button 
            onClick={() => navigate("/symptom-diary/new")} 
            size="sm" 
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by pet, symptom, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/80 backdrop-blur-sm"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="mild" className="text-green-600 dark:text-green-400">Mild</TabsTrigger>
            <TabsTrigger value="moderate" className="text-yellow-600 dark:text-yellow-400">Moderate</TabsTrigger>
            <TabsTrigger value="severe" className="text-red-600 dark:text-red-400">Severe</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/symptom-diary/${entry.id}`)}
                >
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-none shadow-sm bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{entry.petName}</h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {entry.date}
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              {entry.time}
                            </div>
                          </div>
                          {entry.symptoms.length > 0 && (
                            <Badge className={severityColors[entry.symptoms.reduce((max, symptom) => {
                              // Determine highest severity
                              if (symptom.severity === 'severe') return 'severe';
                              if (max === 'moderate' || symptom.severity === 'moderate') return 'moderate';
                              return 'mild';
                            }, 'mild' as 'mild' | 'moderate' | 'severe')]}>
                              {entry.symptoms.reduce((max, symptom) => {
                                // Determine highest severity
                                if (symptom.severity === 'severe') return 'severe';
                                if (max === 'moderate' || symptom.severity === 'moderate') return 'moderate';
                                return 'mild';
                              }, 'mild' as 'mild' | 'moderate' | 'severe')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {entry.symptoms.map((symptom, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {symptom.name || "Unknown"}
                            </span>
                          ))}
                        </div>
                        
                        {entry.notes && (
                          <div className="mt-3 text-sm text-muted-foreground">
                            {entry.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <p className="text-lg font-medium mb-1">No symptom logs found</p>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start tracking your pet's symptoms to identify potential food allergies.
                </p>
                <Button onClick={() => navigate("/symptom-diary/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Entry
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SymptomDiary;
