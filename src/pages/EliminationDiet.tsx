
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";

const EliminationDiet = () => {
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Elimination Diet Guide</h1>
        <p className="text-muted-foreground">Follow a structured elimination diet</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4">
            <h3 className="font-medium text-lg">Preparation Phase</h3>
            <p className="text-muted-foreground mb-2">Day 3 of 7</p>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: "40%" }}></div>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Consult with your veterinarian</span>
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Select a novel protein diet</span>
              </li>
              <li className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center mr-2">
                </div>
                <span>Remove all treats and table scraps</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Upcoming Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">Strict Elimination</h3>
              <p className="text-sm text-muted-foreground">8 weeks</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium">Challenge Phase</h3>
              <p className="text-sm text-muted-foreground">6 weeks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default EliminationDiet;
