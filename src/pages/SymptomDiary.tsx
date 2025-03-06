
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Filter, 
  Clock, 
  Bookmark,
  CalendarClock,
  AlertCircle
} from "lucide-react";

interface SymptomEntry {
  id: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  symptoms: string[];
  severity: "mild" | "moderate" | "severe";
  notes?: string;
  foods?: string[];
}

const mockEntries: SymptomEntry[] = [
  {
    id: "1",
    petId: "pet1",
    petName: "Max",
    date: "2023-05-15",
    time: "08:30 AM",
    symptoms: ["Itching", "Ear inflammation"],
    severity: "moderate",
    notes: "Started after trying new treats",
    foods: ["Chicken treats", "Regular kibble"]
  },
  {
    id: "2",
    petId: "pet1",
    petName: "Max",
    date: "2023-05-10",
    time: "07:45 PM",
    symptoms: ["Digestive issues", "Lethargy"],
    severity: "severe",
    notes: "Lasted for about 2 hours",
    foods: ["Beef chew", "Regular kibble"]
  },
  {
    id: "3",
    petId: "pet2",
    petName: "Luna",
    date: "2023-05-14",
    time: "12:15 PM",
    symptoms: ["Skin rash", "Paw licking"],
    severity: "mild",
    notes: "Only on belly area",
    foods: ["Fish-based wet food"]
  },
  {
    id: "4",
    petId: "pet1",
    petName: "Max",
    date: "2023-05-05",
    time: "06:30 PM",
    symptoms: ["Itching", "Red skin"],
    severity: "mild",
    foods: ["Chicken kibble", "Carrot treats"]
  },
  {
    id: "5",
    petId: "pet2",
    petName: "Luna",
    date: "2023-05-01",
    time: "08:00 AM",
    symptoms: ["Vomiting", "Lethargy"],
    severity: "severe",
    notes: "Called vet",
    foods: ["New grain-free food"]
  }
];

const SymptomDiary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const severityColors = {
    mild: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    severe: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  const filteredEntries = useMemo(() => {
    return mockEntries
      .filter(entry => {
        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            entry.petName.toLowerCase().includes(searchLower) ||
            entry.symptoms.some(s => s.toLowerCase().includes(searchLower)) ||
            (entry.notes?.toLowerCase().includes(searchLower))
          );
        }
        return true;
      })
      .filter(entry => {
        // Filter by tab selection
        if (activeTab === "all") return true;
        if (activeTab === "mild") return entry.severity === "mild";
        if (activeTab === "moderate") return entry.severity === "moderate";
        if (activeTab === "severe") return entry.severity === "severe";
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, activeTab]);

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
                        <Badge className={severityColors[entry.severity]}>
                          {entry.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {entry.symptoms.map((symptom, i) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {symptom}
                          </span>
                        ))}
                      </div>
                      
                      {entry.notes && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                    {entry.foods && entry.foods.length > 0 && (
                      <div className="border-t px-4 py-2 bg-muted/30">
                        <div className="flex items-center text-xs">
                          <Bookmark className="h-3 w-3 mr-1 text-primary" />
                          <span className="font-medium mr-2">Foods:</span>
                          {entry.foods.join(", ")}
                        </div>
                      </div>
                    )}
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
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SymptomDiary;
