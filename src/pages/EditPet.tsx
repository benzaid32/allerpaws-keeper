
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEVERITY_LEVELS } from "@/lib/constants";
import MobileLayout from "@/components/layout/MobileLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { uploadImage } from "@/lib/image-utils";
import PetFormSection from "@/components/pet/PetFormSection";
import PetImageUploader from "@/components/pet/PetImageUploader";
import PetAllergyEditor from "@/components/pet/PetAllergyEditor";
import PetFormNavigation from "@/components/pet/PetFormNavigation";
import PetFormProgress from "@/components/pet/PetFormProgress";

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleImageSelected = (file: File | null) => {
    setImageFile(file);
  };

  const handleAllergiesChange = (allergies: string[]) => {
    setFormData(prev => ({ ...prev, allergies }));
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
        console.log("Uploading pet image...");
        const uploadedImageUrl = await uploadImage(imageFile, "pets");
        
        if (!uploadedImageUrl) {
          throw new Error("Failed to upload pet image");
        }
        
        imageUrl = uploadedImageUrl;
        console.log("Pet image uploaded successfully:", imageUrl);
      } else if (imageUrl === null && originalImageUrl) {
        // If image was cleared (imageFile is null) but there was an original image
        // This means the user removed the image
        imageUrl = null;
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
        <PetFormProgress currentStep={currentStep} totalSteps={3} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <PetFormSection 
            section={currentStep}
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            imageUploader={
              <PetImageUploader 
                initialImageUrl={originalImageUrl} 
                onImageSelected={handleImageSelected}
              />
            }
            allergyEditor={
              <PetAllergyEditor 
                allergies={formData.allergies}
                onAllergiesChange={handleAllergiesChange}
              />
            }
          />

          <PetFormNavigation 
            currentStep={currentStep}
            totalSteps={3}
            submitting={submitting}
            onPrevious={prevStep}
            onNext={nextStep}
            onCancel={() => navigate("/manage-pets")}
          />
        </form>
      </div>
    </MobileLayout>
  );
};

export default EditPet;
