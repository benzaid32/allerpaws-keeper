import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/layout/MobileLayout";
import MobileCard from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isPlatform } from "@/lib/utils";
import { ensureStorageBucket, deleteImage } from "@/lib/image-utils";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previousAvatarUrl, setPreviousAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.user_metadata?.avatar_url || null);
      setPreviousAvatarUrl(user.user_metadata?.avatar_url || null);
    }
    
    // Check if we're on a mobile device
    setIsMobileDevice(isPlatform('capacitor') || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Ensure the storage bucket exists
    ensureStorageBucket('user-content');
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      setAvatarFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    const input = document.getElementById('avatar-upload') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;
    
    try {
      // Delete previous avatar if it exists
      if (previousAvatarUrl) {
        await deleteImage(previousAvatarUrl);
      }
      
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      console.log("Uploading avatar to path:", filePath);
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('user-content')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
        
      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload profile picture. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload avatar if a new one was selected
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        newAvatarUrl = await uploadAvatar();
        if (!newAvatarUrl) {
          throw new Error("Failed to upload avatar");
        }
      } else if (previewUrl === null && previousAvatarUrl) {
        // If avatar was cleared but there was a previous one
        await deleteImage(previousAvatarUrl);
        newAvatarUrl = null;
      }
      
      // Update user profile using Supabase Auth API
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: newAvatarUrl
        }
      });
      
      if (error) throw error;
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout title="Profile">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Card - Enhanced Mobile UX */}
        <MobileCard>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 border-4 border-background">
                {(previewUrl || avatarUrl) ? (
                  <AvatarImage 
                    src={previewUrl || avatarUrl || ""} 
                    alt={fullName} 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-3xl bg-primary/10">
                    {fullName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <Button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-md"
                size="icon"
                type="button"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Change profile picture</span>
              </Button>
              
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*"
                capture={isMobileDevice ? "user" : undefined}
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Tap the camera icon to {previewUrl ? "change" : "add"} your profile picture
            </p>
          </div>
        </MobileCard>

        {/* Profile Info Card */}
        <MobileCard
          icon={<User className="h-5 w-5 text-primary" />}
          title="Personal Information"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="pl-10 bg-muted/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
        </MobileCard>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <Button type="submit" disabled={isLoading} className="relative">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </MobileLayout>
  );
};

export default Profile;
