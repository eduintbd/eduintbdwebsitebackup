import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string | null;
  studentId: string;
  onAvatarUpdate: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ProfileAvatar({ 
  name, 
  avatarUrl, 
  studentId, 
  onAvatarUpdate,
  size = "lg" 
}: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "h-12 w-12 sm:h-16 sm:w-16",
    md: "h-16 w-16 sm:h-20 sm:w-20",
    lg: "h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
  };

  const textSizeClasses = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-xl",
    lg: "text-base sm:text-lg md:text-2xl"
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update student_applications with avatar URL
      const { error: updateError } = await supabase
        .from('student_applications')
        .update({ avatar_url: publicUrl })
        .eq('id', studentId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);

      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative group">
      <Avatar className={`${sizeClasses[size]} bg-primary text-primary-foreground flex-shrink-0 ring-2 ring-background shadow-lg`}>
        <AvatarImage src={avatarUrl || undefined} alt={name} className="object-cover" />
        <AvatarFallback className={`${textSizeClasses[size]} font-semibold bg-primary text-primary-foreground`}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {/* Upload overlay */}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute bottom-0 right-0 h-6 w-6 sm:h-8 sm:w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
        ) : (
          <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
