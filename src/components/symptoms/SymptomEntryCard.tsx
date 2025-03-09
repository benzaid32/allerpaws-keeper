
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, PawPrint, Trash2, MessageSquare } from "lucide-react";
import { SymptomEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSymptomDiary } from "@/hooks/use-symptom-diary";

interface SymptomEntryCardProps {
  entry: SymptomEntry;
  index: number;
}

const SymptomEntryCard: React.FC<SymptomEntryCardProps> = ({ entry, index }) => {
  const { deleteEntry } = useSymptomDiary();
  
  const handleDelete = async () => {
    await deleteEntry(entry.id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden border-purple-100/50 dark:border-purple-900/20 shadow-sm hover:shadow-md transition-shadow bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-purple-800 dark:text-purple-300">
              <PawPrint className="h-4 w-4 mr-1.5" />
              <span className="font-semibold">{entry.petName}</span>
            </div>
            
            <div className="flex gap-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{entry.date}</span>
              </div>
              
              {entry.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{entry.time}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 my-2">
            {entry.symptoms.map((symptom, i) => (
              <Badge
                key={`${symptom.symptomId}-${i}`}
                variant={
                  symptom.severity === "mild" ? "outline" :
                  symptom.severity === "moderate" ? "secondary" :
                  "destructive"
                }
                className="text-xs"
              >
                {symptom.name} {symptom.isCustom && "(Custom)"}
              </Badge>
            ))}
          </div>
          
          {entry.notes && (
            <div className="mt-3 text-sm text-muted-foreground flex items-start gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p className="line-clamp-2">{entry.notes}</p>
            </div>
          )}
          
          <div className="mt-3 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete symptom entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this symptom entry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SymptomEntryCard;
