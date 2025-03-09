
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle, ThermometerSnowflake, Flame } from "lucide-react";
import { SymptomEntry } from "@/lib/types";

interface SymptomEntryCardProps {
  entry: SymptomEntry;
  index: number;
}

const SymptomEntryCard: React.FC<SymptomEntryCardProps> = ({ entry, index }) => {
  const navigate = useNavigate();
  
  const severityColors = {
    mild: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30",
    moderate: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30",
    severe: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
  };
  
  const severityIcons = {
    mild: <ThermometerSnowflake className="h-3 w-3 mr-1" />,
    moderate: <AlertCircle className="h-3 w-3 mr-1" />,
    severe: <Flame className="h-3 w-3 mr-1" />
  };
  
  const highestSeverity = entry.symptoms.reduce((max, symptom) => {
    if (symptom.severity === 'severe') return 'severe';
    if (max === 'moderate' || symptom.severity === 'moderate') return 'moderate';
    return 'mild';
  }, 'mild' as 'mild' | 'moderate' | 'severe');

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/symptom-diary/${entry.id}`)}
      className="hover:scale-[1.01] transition-transform duration-200"
    >
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-purple-100/50 dark:border-purple-900/20 shadow-sm bg-white/80 dark:bg-card/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-purple-900 dark:text-purple-300">{entry.petName}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {entry.date}
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  {entry.time}
                </div>
              </div>
              {entry.symptoms.length > 0 && (
                <Badge className={`flex items-center ${severityColors[highestSeverity]}`}>
                  {severityIcons[highestSeverity]}
                  {highestSeverity}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.symptoms.map((symptom, i) => (
                <span key={i} className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200/50 dark:border-purple-800/30">
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
  );
};

export default SymptomEntryCard;
