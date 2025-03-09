
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Symptom name must be at least 2 characters.",
  }).max(50, {
    message: "Symptom name cannot exceed 50 characters."
  }),
  description: z.string().max(200, {
    message: "Description cannot exceed 200 characters."
  }).optional(),
  severity_options: z.array(z.string()).min(1, {
    message: "Please add at least one severity level."
  }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultSeverityOptions = ["Mild", "Moderate", "Severe"];

interface CustomSymptomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSymptomCreated: (symptomId: string, symptomName: string) => void;
}

const CustomSymptomDialog: React.FC<CustomSymptomDialogProps> = ({
  open,
  onOpenChange,
  onSymptomCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSeverity, setNewSeverity] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      severity_options: [...defaultSeverityOptions],
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a symptom.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const symptomId = uuidv4();
      
      const { error } = await supabase
        .from("symptoms")
        .insert({
          id: symptomId,
          name: values.name,
          description: values.description || null,
          severity_options: values.severity_options,
          is_custom: true,
          created_by_user_id: user.id,
        });
        
      if (error) throw error;
      
      // Call the callback with the new symptom ID and name
      onSymptomCreated(symptomId, values.name);
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error("Error creating custom symptom:", error.message);
      toast({
        title: "Error",
        description: "Failed to create the custom symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSeverity = () => {
    if (!newSeverity || newSeverity.trim() === "") return;
    
    const currentSeverities = form.getValues().severity_options || [];
    
    // Check if already exists (case insensitive)
    if (currentSeverities.some(s => s.toLowerCase() === newSeverity.toLowerCase())) {
      toast({
        title: "Duplicate Severity",
        description: "This severity level already exists.",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("severity_options", [...currentSeverities, newSeverity.trim()]);
    setNewSeverity("");
  };

  const handleRemoveSeverity = (severityToRemove: string) => {
    const currentSeverities = form.getValues().severity_options || [];
    form.setValue(
      "severity_options", 
      currentSeverities.filter(s => s !== severityToRemove)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSeverity();
    }
  };

  const severityOptions = form.watch("severity_options");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl mb-1">Add Custom Symptom</DialogTitle>
          <DialogDescription className="text-center">
            Create a personalized symptom to track in your health diary
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Symptom Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter symptom name" 
                      {...field} 
                      className="border-purple-100 dark:border-purple-900/40 focus-visible:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the symptom" 
                      className="resize-none border-purple-100 dark:border-purple-900/40 focus-visible:ring-purple-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity_options"
              render={() => (
                <FormItem>
                  <FormLabel className="text-foreground">Severity Levels</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Add severity level"
                          value={newSeverity}
                          onChange={(e) => setNewSeverity(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="border-purple-100 dark:border-purple-900/40 focus-visible:ring-purple-500"
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        onClick={handleAddSeverity}
                        variant="outline"
                        size="icon"
                        className="border-purple-200 dark:border-purple-800"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {severityOptions.map((severity, index) => (
                        <Badge 
                          key={index} 
                          className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
                        >
                          {severity}
                          <button
                            type="button"
                            onClick={() => handleRemoveSeverity(severity)}
                            className="ml-1 text-purple-800 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Symptom"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSymptomDialog;
