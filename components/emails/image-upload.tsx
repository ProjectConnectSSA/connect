"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL"
        />
        <Button variant="outline" size="icon">
          <Image className="h-4 w-4" />
        </Button>
      </div>
      {value && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}