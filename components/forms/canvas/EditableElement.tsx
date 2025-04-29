// src/components/forms/canvas/EditableElement.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, GripVertical, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient"; // Assuming this path is correct
import { toast } from "sonner";

// --- Import types from the central definition ---
import type { ElementType } from "@/app/types/form";

// Props interface for EditableElement
// It's good practice to define this near the component or import if defined centrally too
interface EditableElementProps {
  element: ElementType;
  selectedElement: { element: ElementType; pageIndex: number } | null;
  updateElement: (id: string, changes: Partial<ElementType>) => void;
  deleteElement: (id: string) => void;
  reorderElements: (draggedId: string, targetId: string) => void;
  setSelectedElement: (sel: { element: ElementType; pageIndex: number } | null) => void;
  currentPageIndex: number;
}

export const EditableElement = ({
  element,
  selectedElement,
  updateElement,
  deleteElement,
  reorderElements,
  setSelectedElement,
  currentPageIndex,
}: EditableElementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // --- Type Check for Image URL ---
      // Ensure element.value is a string before attempting URL operations
      const currentImageUrl = typeof element.value === "string" ? element.value : undefined;
      // --- End Type Check ---

      // Remove existing image if present.
      if (currentImageUrl) {
        // Check if it's a valid string URL
        try {
          const urlObj = new URL(currentImageUrl);
          const pathParts = urlObj.pathname.split("/");
          const bucketName = pathParts[pathParts.length - 2];
          const fileName = decodeURIComponent(pathParts[pathParts.length - 1]);

          if (bucketName && fileName) {
            console.log(`Attempting delete from bucket: ${bucketName}, file: ${fileName}`);
            const { error: removeError } = await supabase.storage.from(bucketName).remove([fileName]);
            if (removeError) console.error("Error deleting old image:", removeError.message);
          } else {
            console.warn("Could not parse bucket/filename from URL for deletion:", currentImageUrl);
          }
        } catch (error) {
          // Catch URL parsing errors specifically
          if (error instanceof TypeError) {
            console.warn("Value is not a valid URL for deletion:", currentImageUrl, error);
          } else {
            console.error("Error processing old image URL:", error);
          }
        }
      }

      const fileExt = file.name.split(".").pop();
      const newFileName = `${element.id}-${Date.now()}.${fileExt}`;
      const bucket = "formImage";

      const { error: uploadError } = await supabase.storage.from(bucket).upload(newFileName, file);

      if (uploadError) {
        throw new Error(uploadError.message); // Throw error to be caught below
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(newFileName);

      if (data?.publicUrl) {
        updateElement(element.id, { value: data.publicUrl }); // Update with the new string URL
      } else {
        console.error("Could not get public URL after upload.");
        toast.error("Image uploaded, but failed to get URL.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      console.error("Image upload process error:", message, error);
      toast.error(`Image upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    // --- Type Check for Image URL ---
    const imageUrlToDelete = typeof element.value === "string" ? element.value : undefined;
    // --- End Type Check ---

    // Attempt to delete the image from storage BEFORE deleting the element data
    if (element.type === "image" && imageUrlToDelete) {
      // Only if it's an image AND value is a string
      try {
        const urlObj = new URL(imageUrlToDelete);
        const pathParts = urlObj.pathname.split("/");
        const bucketName = pathParts[pathParts.length - 2];
        const fileName = decodeURIComponent(pathParts[pathParts.length - 1]);

        if (bucketName && fileName) {
          console.log(`Attempting delete from bucket: ${bucketName}, file: ${fileName}`);
          const { error: removeError } = await supabase.storage.from(bucketName).remove([fileName]);
          if (removeError) console.error("Error deleting image from bucket:", removeError.message);
        } else {
          console.warn("Could not parse bucket/filename from URL for deletion:", imageUrlToDelete);
        }
      } catch (error) {
        if (error instanceof TypeError) {
          console.warn("Value is not a valid URL for deletion during delete:", imageUrlToDelete, error);
        } else {
          console.error("Error processing image URL during element deletion:", error);
        }
      }
    }
    // Proceed to delete the element from the form state regardless of storage deletion success/failure
    deleteElement(element.id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("elementId", element.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("elementId");
    if (draggedId && draggedId !== element.id) {
      reorderElements(draggedId, element.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedElement?.element?.id !== element.id || selectedElement?.pageIndex !== currentPageIndex) {
      setSelectedElement({ element, pageIndex: currentPageIndex });
    }
  };

  const isSelected = selectedElement?.element?.id === element.id && selectedElement?.pageIndex === currentPageIndex;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        "mb-4 p-4 rounded-lg shadow border bg-white relative group",
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : "border-transparent hover:border-gray-200",
        "transition-all duration-150"
      )}>
      <motion.div
        layout
        className="flex items-start">
        <div
          className="mr-3 flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 pt-1"
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag to reorder">
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm mr-2 truncate flex-1">{element.title || "Untitled"}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100 focus:opacity-100"
              title="Delete Element">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            {(() => {
              // --- Render based on type, handling potential value types ---
              switch (element.type) {
                case "text":
                case "phone":
                case "email":
                case "date": // Date input value is always string
                  return (
                    <Input
                      type={element.type === "text" ? "text" : element.type} // Use correct type for phone, email, date
                      placeholder={`Preview ${element.type} input`}
                      value={typeof element.value === "string" ? element.value : ""} // Display only if string
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}
                    />
                  );
                case "checkbox":
                  return (
                    <label className="flex items-center space-x-2 mt-1 text-sm">
                      <input
                        type="checkbox"
                        checked={!!element.value} // Handle boolean value
                        disabled
                        className="h-4 w-4"
                      />
                      <span>{element.title || "Checkbox"}</span>
                    </label>
                  );
                case "rating":
                  // Rating might store a number, but display is visual
                  const ratingValue = typeof element.value === "number" ? element.value : 0;
                  return (
                    <div className="flex space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={`text-xl cursor-default ${index < ratingValue ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  );
                case "select":
                  // Select value is typically a string
                  return (
                    <select
                      value={typeof element.value === "string" ? element.value : ""}
                      disabled
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}>
                      {/* Render placeholder if no value */}
                      {!element.value && <option value="">Select...</option>}
                      {(element.options || []).map((opt, i) => (
                        <option
                          key={i}
                          value={opt}>
                          {opt}
                        </option>
                      ))}
                      {/* Add default options if element.options is empty and no value */}
                      {!element.options?.length && !element.value && (
                        <>
                          <option>Option 1</option>
                          <option>Option 2</option>
                        </>
                      )}
                    </select>
                  );
                case "image":
                  // --- Ensure value is a string for src ---
                  const imageUrl = typeof element.value === "string" ? element.value : null;
                  return (
                    <div className="mt-2 space-y-2">
                      {uploading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader className="animate-spin h-4 w-4" />
                          <span>Uploading...</span>
                        </div>
                      ) : imageUrl ? ( // Check if imageUrl is a valid string
                        <div className="relative group/image">
                          <img
                            src={imageUrl} // Use the validated string URL
                            alt={element.title || "Uploaded image"}
                            style={{ maxWidth: "100%", maxHeight: "200px", display: "block", ...element.styles }}
                            className="rounded border"
                            // Add onError handler for broken images
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none"; /* hide broken img */
                            }}
                          />
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileSelect();
                              }}
                              title="Replace Image">
                              {/* Replace Icon SVG */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2m0 0H15"
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileSelect();
                          }}>
                          Upload Image
                        </Button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden"
                      />
                    </div>
                  );
                case "yesno":
                  // Yes/No might store a boolean or specific strings
                  const yesNoValue = typeof element.value === "boolean" ? element.value : undefined; // Or check for 'yes'/'no' strings
                  return (
                    <div className="flex space-x-2 mt-1">
                      <Button
                        size="sm"
                        variant={yesNoValue === true ? "default" : "outline"}
                        disabled>
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant={yesNoValue === false ? "default" : "outline"}
                        disabled>
                        No
                      </Button>
                    </div>
                  );
                case "link":
                  // Link value should be a string
                  const linkHref = typeof element.value === "string" ? element.value : "#";
                  return (
                    <a
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.preventDefault()}
                      className="mt-1 text-blue-600 underline text-sm break-all"
                      style={element.styles}>
                      {element.title || (typeof element.value === "string" ? element.value : "Link")}
                    </a>
                  );
                case "button":
                  // Button doesn't usually have a 'value' in the traditional sense
                  return (
                    <Button
                      disabled
                      size="sm"
                      className="mt-1"
                      style={element.styles}>
                      {element.title || "Button"}
                    </Button>
                  );
                default:
                  // Attempt to display non-string values for unsupported types if needed
                  const displayValue = element.value !== undefined && element.value !== null ? String(element.value) : "";
                  return (
                    <div className="mt-1 text-xs text-red-500">
                      (Unsupported Type: {element.type}) {displayValue && `Value: ${displayValue}`}
                    </div>
                  );
              }
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
