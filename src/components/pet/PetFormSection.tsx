
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileCard from "@/components/ui/mobile-card";

interface PetFormSectionProps {
  section: number;
  formData: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  imageUploader?: React.ReactNode;
  allergyEditor?: React.ReactNode;
}

const PetFormSection: React.FC<PetFormSectionProps> = ({
  section,
  formData,
  onInputChange,
  onSelectChange,
  imageUploader,
  allergyEditor,
}) => {
  const renderContent = () => {
    switch (section) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Enter your pet's name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Select
                value={formData.species}
                onValueChange={(value) => onSelectChange("species", value)}
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
                onChange={onInputChange}
                placeholder="Enter breed (optional)"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                value={formData.age}
                onChange={onInputChange}
                placeholder="Enter age (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={onInputChange}
                placeholder="Enter weight (optional)"
                type="number"
                step="0.1"
              />
            </div>

            {imageUploader}
          </div>
        );
      case 3:
        return allergyEditor;
      default:
        return null;
    }
  };

  return (
    <MobileCard className="mb-4">
      {renderContent()}
    </MobileCard>
  );
};

export default PetFormSection;
