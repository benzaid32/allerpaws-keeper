
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const EditSymptomEntry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="container pb-20">
      <div className="pt-6 pb-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Symptom Entry</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Symptom Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p>Editing symptom entry with ID: {id}</p>
            <p className="text-muted-foreground mt-2">This feature is coming soon.</p>
            <Button onClick={() => navigate('/symptom-diary')} className="mt-4">
              Back to Symptom Diary
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default EditSymptomEntry;
