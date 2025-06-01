"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Image as ImageIcon, Upload, X, Search } from "lucide-react";
import { UnsplashSearch } from "./unsplash-search";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [unsplashDialogOpen, setUnsplashDialogOpen] = useState(false);

  // Attribution data for Unsplash images
  const [attributionData, setAttributionData] = useState<any>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      // Clear any previous attribution data when uploading own image
      setAttributionData(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (tempUrl) {
      onChange(tempUrl);
      setIsUrlInput(false);
      setTempUrl("");
      // Clear any previous attribution data when using custom URL
      setAttributionData(null);
    }
  };

  const handleUnsplashSelect = (imageUrl: string, attribution: any) => {
    onChange(imageUrl);
    setAttributionData(attribution);
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="p-4 border-2 border-dashed rounded-md flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Attribution for Unsplash images */}
          {attributionData && (
            <div className="text-xs text-gray-500 mt-1">
              Photo by{" "}
              <a
                href={`${attributionData.photographerUrl}?utm_source=your_app&utm_medium=referral`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                {attributionData.photographer}
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/?utm_source=your_app&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Unsplash
              </a>
            </div>
          )}
        </div>
      ) : isUrlInput ? (
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Paste image URL..."
            className="flex-1"
          />
          <Button onClick={handleUrlSubmit}>Add</Button>
          <Button
            variant="ghost"
            onClick={() => setIsUrlInput(false)}
            className="px-2"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={triggerFileSelect}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsUrlInput(true)}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            URL
          </Button>
          <Button
            variant="outline"
            onClick={() => setUnsplashDialogOpen(true)}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            Unsplash
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            onClick={(e) => e.stopPropagation()}
            className="hidden"
          />
        </div>
      )}

      {/* Unsplash Dialog */}
      <UnsplashSearch
        open={unsplashDialogOpen}
        onOpenChange={setUnsplashDialogOpen}
        onSelectImage={handleUnsplashSelect}
      />
    </div>
  );
}
