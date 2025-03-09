
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
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
  CalendarClock,
  PawPrint,
  AlertCircle
} from "lucide-react";
import { useSymptomDiary } from "@/hooks/use-symptom-diary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import SymptomEntryCard from "@/components/symptoms/SymptomEntryCard";
import SymptomDiaryHeader from "@/components/symptoms/SymptomDiaryHeader";
import SymptomEmptyState from "@/components/symptoms/SymptomEmptyState";

const SymptomDiary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { entries, loading } = useSymptomDiary();
  
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
        <SymptomDiaryHeader />

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
              className="pl-10 bg-white/90 dark:bg-card/80 backdrop-blur-sm border-purple-100 dark:border-purple-900/20"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 bg-white/50 dark:bg-muted/30 backdrop-blur-sm">
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
                <SymptomEntryCard key={entry.id} entry={entry} index={index} />
              ))
            ) : (
              <SymptomEmptyState />
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SymptomDiary;
