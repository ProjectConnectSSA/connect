import React, { useRef, useState } from "react";
import { StyleProps } from "@/app/types/links/types";
import { UploadCloud, Trash2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadBackgroundImage } from "../services/backgroundUploadService";

interface BackgroundImageSectionProps {
  backgroundImage?: string;
  onStyleChange: (newStyles: Partial<StyleProps>) => void;
}

export function BackgroundImageSection({ backgroundImage, onStyleChange }: BackgroundImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    const toastId = toast.loading("Uploading background...", { description: file.name });

    try {
      const imageUrl = await uploadBackgroundImage(file);
      onStyleChange({ backgroundImage: imageUrl, theme: "custom" });
      toast.success("Background uploaded!", { id: toastId });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload background.";
      setUploadError(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveBackground = () => {
    onStyleChange({ backgroundImage: undefined });
    setUploadError(null);
    toast.info("Background image removed.");
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Background Image</label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isUploading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {isUploading ? (
          <>
            <Loader2
              size={18}
              className="mr-2 animate-spin"
            />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud
              size={18}
              className="mr-2"
            />
            {backgroundImage ? "Change Image" : "Upload Image"}
          </>
        )}
      </button>

      {backgroundImage && !isUploading && (
        <button
          onClick={handleRemoveBackground}
          className="w-full flex items-center justify-center mt-2 p-2 border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors">
          <Trash2
            size={16}
            className="mr-2"
          />
          Remove Background
        </button>
      )}

      {uploadError && !isUploading && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-start">
          <XCircle
            size={14}
            className="mr-1 mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400"
          />
          <span>{uploadError}</span>
        </p>
      )}
    </div>
  );
}
