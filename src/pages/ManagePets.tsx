
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePets } from "@/hooks/use-pets";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Pencil, 
  Trash, 
  MoreVertical,
  PawPrint,
  RefreshCw
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
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

const ManagePets = () => {
  const { pets, loading, deletePet, fetchPets } = usePets();
  const navigate = useNavigate();
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Force fetch pets data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchPets();
    };
    loadData();
  }, [fetchPets]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPets();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  const handleEditPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleViewPet = (petId: string) => {
    navigate(`/edit-pet/${petId}`);
  };

  const handleDeletePet = async (petId: string) => {
    try {
      setDeletingPetId(petId);
      setIsDeleting(true);
      await deletePet(petId);
    } catch (error) {
      console.error("Error deleting pet:", error);
    } finally {
      setDeletingPetId(null);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout title="Your Pets">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Your Pets">
      <div className="space-y-6">
        {/* Add Pet and Refresh Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleAddPet} 
            className="flex-1"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Pet
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-10 h-10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Pet List */}
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map((pet) => (
              <MobileCard
                key={pet.id}
                onClick={() => handleViewPet(pet.id)}
                className="hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {pet.imageUrl ? (
                        <AvatarImage 
                          src={pet.imageUrl} 
                          alt={pet.name} 
                          onError={(e) => {
                            // If image fails to load, show fallback
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                      )}
                      <AvatarFallback>{pet.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{pet.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {pet.species}
                        </Badge>
                        {pet.breed && (
                          <span className="text-xs text-muted-foreground">
                            {pet.breed}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewPet(pet.id);
                      }}>
                        <PawPrint className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditPet(pet.id);
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={(e) => {
                              e.preventDefault();
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Pet</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {pet.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePet(pet.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting && deletingPetId === pet.id}
                            >
                              {isDeleting && deletingPetId === pet.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {pet.knownAllergies && pet.knownAllergies.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-muted-foreground block mb-2">Allergies: </span>
                    <div className="flex flex-wrap gap-1">
                      {pet.knownAllergies.map((allergy, idx) => (
                        <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </MobileCard>
            ))}
          </div>
        ) : (
          <MobileCard className="border-dashed border-muted-foreground/30">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-1">No pets yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add your first pet to start tracking their allergies and symptoms
              </p>
              <Button onClick={handleAddPet}>
                Add Your First Pet
              </Button>
            </div>
          </MobileCard>
        )}
      </div>
    </MobileLayout>
  );
};

export default ManagePets;
