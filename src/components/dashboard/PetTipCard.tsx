
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const PetTipCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mb-6"
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 border border-primary/10 shadow-sm backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1">Pet Care Tip</h3>
              <p className="text-sm text-muted-foreground">
                When introducing new foods to pets with allergies, do so one at a time with at least 
                a week between introductions to accurately identify any reactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PetTipCard;
