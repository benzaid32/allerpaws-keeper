
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, BarChart2, CheckCircle, TrendingUp, Clock } from "lucide-react";

interface StatsCardsProps {
  recentActivity: number;
  symptomsThisWeek: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ recentActivity, symptomsThisWeek }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="hover:shadow-md transition-all bg-white/90 backdrop-blur-sm border border-primary/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="mr-2 h-4 w-4 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold flex items-center">
            {recentActivity}
            <Clock className="ml-2 h-4 w-4 text-primary/70" />
          </div>
          <p className="text-xs text-muted-foreground">
            Entries in the last 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-all bg-white/90 backdrop-blur-sm border border-primary/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0"></div>
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart2 className="mr-2 h-4 w-4 text-primary" />
            Symptom Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-2xl font-bold flex items-center">
            {symptomsThisWeek > 0 ? (
              <>
                {symptomsThisWeek}
                <TrendingUp className="ml-2 h-4 w-4 text-yellow-500" />
              </>
            ) : (
              <>
                All Good
                <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {symptomsThisWeek > 0 
              ? "Symptoms recorded this week" 
              : "No symptoms this week"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCards;
