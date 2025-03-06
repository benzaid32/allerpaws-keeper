import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEVERITY_LEVELS } from "@/lib/constants";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface PetFormData {
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  allergies: string[];
}

const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "dog",
    breed: "",
    age: "",
    weight: "",
    allergies: [],
  });
  const [currentAllergy, setCurrentAllergy] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPet = async () => {
      try {
        setLoading(true);
        
        // Fetch pet details
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", id)
          .single();

        if (petError) throw petError;

        // Fetch pet allergies
        const { data: allergiesData, error: allergiesError } = await supabase
          .from("allergies")
          .select("name")
          .eq("pet_id", id);

        if (allergiesError) throw allergiesError;

        // Set form data
        setFormData({
          name: petData.name || "",
          species: petData.species || "dog",
          breed: petData.breed || "",
          age: petData.age ? String(petData.age) : "",
          weight: petData.weight ? String(petData.weight) : "",
          allergies: allergiesData.map(a => a.name) || [],
        });

        // Set image preview if available
        if (petData.image_url) {
          setOriginalImageUrl(petData.image_url);
          setImagePreview(petData.image_url);
        }
      } catch (error: any) {
        console.error("Error fetching pet:", error.message);
        toast({
          title: "Error",
          description: "Failed to load pet information",
          variant: "destructive",
        });
        navigate("/manage-pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAllergy = () => {
    if (currentAllergy.trim() && !formData.allergies.includes(currentAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, currentAllergy.trim()]
      }));
      setCurrentAllergy("");
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(allergy => allergy !== allergyToRemove)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.name || !formData.species) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and species for your pet",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload new image if provided
      let imageUrl = originalImageUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `pet-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('pet-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Convert string values to appropriate types for database
      const age = formData.age ? parseFloat(formData.age) : null;
      const weight = formData.weight ? parseFloat(formData.weight) : null;

      // Update pet data
      const { error: petError } = await supabase
        .from("pets")
        .update({
          name: formData.name,
          species: formData.species,
          breed: formData.breed || null,
          age: age,
          weight: weight,
          image_url: imageUrl,
        })
        .eq("id", id);

      if (petError) {
        throw petError;
      }

      // Delete existing allergies
      const { error: deleteError } = await supabase
        .from("allergies")
        .delete()
        .eq("pet_id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new allergies if any
      if (formData.allergies.length > 0) {
        const allergyRecords = formData.allergies.map(allergy => ({
          pet_id: id,
          name: allergy,
          severity: SEVERITY_LEVELS[0], // Use the first severity level (mild)
        }));

        const { error: allergyError } = await supabase
          .from("allergies")
          .insert(allergyRecords);

        if (allergyError) {
          throw allergyError;
        }
      }

      toast({
        title: "Success",
        description: "Pet information updated successfully",
      });

      navigate("/manage-pets");
    } catch (error: any) {
      console.error("Error updating pet:", error.message);
      toast({
        title: "Error",
        description: "Failed to update pet information",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <MobileCard className="mb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your pet's name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => handleSelectChange("species", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Enter breed (optional)"
                />
              </div>
            </div>
          </MobileCard>
        );
      case 2:
        return (
          <MobileCard className="mb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Enter weight (optional)"
                  type="number"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Pet Photo</Label>
                <div className="flex flex-col items-center space-y-3">
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-2">
                      <img 
                        src={imagePreview} 
                        alt="Pet preview" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6 rounded-full"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(originalImageUrl);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={imagePreview ? "hidden" : ""}
                  />
                  {!imagePreview && (
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('image')?.click()}
                    >
                      Choose Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </MobileCard>
        );
      case 3:
        return (
          <MobileCard className="mb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <div className="flex space-x-2">
                  <Input
                    id="currentAllergy"
                    value={currentAllergy}
                    onChange={(e) => setCurrentAllergy(e.target.value)}
                    placeholder="Add an allergy"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAllergy();
                      }
                    }}
                  />
                  <Button type="button" onClick={addAllergy} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        className="ml-1 text-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </MobileCard>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Edit Pet">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title="Edit Pet" 
      showBackButton={true}
      onBack={() => navigate("/manage-pets")}
    >
      <div className="space-y-4">
        {/* Progress indicator */}
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div 
              key={step}
              className={`h-2 flex-1 mx-1 rounded-full ${
                currentStep >= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={() => navigate("/manage-pets")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default EditPet;
