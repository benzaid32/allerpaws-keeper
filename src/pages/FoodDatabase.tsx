
import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";

const FoodDatabase = () => {
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <h1 className="text-2xl font-bold">Food Database</h1>
        <p className="text-muted-foreground">Search for safe foods for your pet</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search foods, ingredients, brands..." />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recommended Foods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                <span className="text-primary font-medium">HP</span>
              </div>
              <div>
                <h3 className="font-medium">Hill's Prescription Diet z/d</h3>
                <p className="text-sm text-muted-foreground">Hydrolyzed protein</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                <span className="text-primary font-medium">RC</span>
              </div>
              <div>
                <h3 className="font-medium">Royal Canin Hydrolyzed Protein</h3>
                <p className="text-sm text-muted-foreground">Hydrolyzed soy protein</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Browse Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-medium">Dry Food</h3>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-medium">Wet Food</h3>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-medium">Treats</h3>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <h3 className="font-medium">Supplements</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <BottomNavigation />
    </div>
  );
};

export default FoodDatabase;
