"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";
import { Loader2, Upload, Link } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const supabase = createClient();

      // Get current user
      const { getCurrentUser } = await import("@/app/actions");
      const currentUser = await getCurrentUser();

      if (!currentUser || !currentUser.id) {
        throw new Error("User not authenticated");
      }

      const userId = currentUser.id;

      // Clean up old image if replacing
      if (
        value &&
        value.includes("landing-assets") &&
        value.includes("storage")
      ) {
        const pathMatch = value.match(
          /\/storage\/v1\/object\/public\/landing-assets\/(.+)$/
        );
        if (pathMatch && pathMatch.length >= 2) {
          const oldFilePath = pathMatch[1];
          console.log(`Removing old image: ${oldFilePath}`);
          await supabase.storage.from("landing-assets").remove([oldFilePath]);
        }
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;

      // Create user-specific path
      const filePath = `landing-images/user_${userId}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from("landing-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("landing-assets").getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      onChange(urlInput);
      setShowUrlField(false);
      setUrlInput("");
      toast.success("Image URL updated");
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={!isUploading ? handleButtonClick : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-4 transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
          isDragging ? "border-primary bg-primary/5" : "hover:border-primary/50"
        }`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded image"
              className="max-h-[150px] object-contain rounded-md"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Click to change image or drop a new image
            </p>
          </>
        ) : (
          <div className="py-4 text-center">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Drag and drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF up to 2MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        {showUrlField ? (
          <form className="flex w-full gap-2" onSubmit={handleUrlSubmit}>
            <Input
              type="url"
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUrlField(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowUrlField(true)}
          >
            <Link className="h-4 w-4" />
            Use image URL
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}
