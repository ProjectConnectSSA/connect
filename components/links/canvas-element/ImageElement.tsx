// src/components/preview/ImageElement.tsx
import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check, Image as ImageIcon } from "lucide-react"; // Alias to avoid conflict

interface ImageElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ImageElement({ element, styles, updateElement, deleteElement }: ImageElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Use 'url' for the main image source, 'title' for alt text
  const [imageUrl, setImageUrl] = useState(element.url || "");
  const [altText, setAltText] = useState(element.title || "");

  const handleSave = () => {
    updateElement(element.id, { url: imageUrl, title: altText });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;

  // Determine the source, preferring 'url', falling back to 'thumbnailUrl' if needed
  const displayUrl = element.url || element.thumbnailUrl;

  return (
    <div className="relative group my-3">
      <button onClick={() => setIsEditing(!isEditing)} className="absolute top-1 right-1 p-1 text-gray-400 bg-white bg-opacity-70 rounded-full hover:text-gray-800 hover:bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Edit Image">
        <Edit2 size={16} />
      </button>

      {isEditing ? (
        <div className="p-3 border rounded bg-gray-100 space-y-2">
          <label className="text-xs font-medium text-gray-600 block">Image URL</label>
          <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://image.url/image.jpg" className="w-full p-1 border rounded text-sm" />
          <label className="text-xs font-medium text-gray-600 block">Alt Text (for accessibility)</label>
          <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image" className="w-full p-1 border rounded text-sm" />
          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center">
            <Check size={16} className="mr-1" /> Save
          </button>
        </div>
      ) : displayUrl ? (
        <img
          src={displayUrl}
          alt={element.title || "User uploaded image"} // Use title as alt text
          className={`w-full h-auto object-cover ${radiusClass}`} // Let image determine its height, constrain width
        />
      ) : (
        // Placeholder if no URL
        <div className={`w-full aspect-video bg-gray-200 flex items-center justify-center ${radiusClass}`}>
          <ImageIcon size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-500 text-sm">Image URL needed</span>
        </div>
      )}
    </div>
  );
}
