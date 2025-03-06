
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";

const SymptomDiary = () => {
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Symptom Diary</h1>
        <p className="text-muted-foreground">Track symptoms over time</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Calendar View</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-10 flex justify-center items-center text-muted-foreground">
            Calendar view will be implemented here
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>No symptom entries yet</p>
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default SymptomDiary;
