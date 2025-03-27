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

// --- Copied Type Definition ---
// NOTE: Ideally, this should come from a central types file (e.g., @/types/form.ts)
// Duplicating it here based on the request to "do nothing else".
export interface ElementType {
  id: string;
  title: string;
  // Added options based on previous suggestions
  options?: string[];
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
    // Allow other style props
    [key: string]: any;
  };
  type: string;
  required: boolean;
  value?: string | number | boolean | string[]; // Allow different value types
  column?: "left" | "right";
}
// --- End Copied Type Definition ---

// Copied from original file
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Props interface for EditableElement
interface EditableElementProps {
  element: ElementType;
  selectedElement: { element: ElementType; pageIndex: number } | null; // Assuming selectedElement shape
  updateElement: (id: string, changes: Partial<ElementType>) => void;
  deleteElement: (id: string) => void;
  reorderElements: (draggedId: string, targetId: string) => void;
  setSelectedElement: (sel: { element: ElementType; pageIndex: number } | null) => void; // Assuming shape
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
      // Remove existing image if present.
      if (element.value) {
        try {
          const urlObj = new URL(element.value);
          // Adjust path based on your bucket structure if needed
          const pathParts = urlObj.pathname.split("/");
          const bucketName = pathParts[pathParts.length - 2]; // e.g., 'formImage'
          const fileName = decodeURIComponent(pathParts[pathParts.length - 1]); // Ensure decoding

          if (bucketName && fileName) {
            console.log(`Attempting delete from bucket: ${bucketName}, file: ${fileName}`);
            const { error: removeError } = await supabase.storage.from(bucketName).remove([fileName]);
            if (removeError) console.error("Error deleting old image:", removeError.message);
          } else {
            console.warn("Could not parse bucket/filename from URL for deletion:", element.value);
          }
        } catch (error) {
          console.error("Error parsing/deleting old image URL:", error);
        }
      }

      // Use a consistent naming convention, perhaps related to form/page/element ID
      const fileExt = file.name.split(".").pop();
      const newFileName = `${element.id}-${Date.now()}.${fileExt}`;
      const bucket = "formImage"; // Your bucket name

      const { error } = await supabase.storage.from(bucket).upload(newFileName, file);

      if (error) {
        console.error("Error uploading image:", error.message);
        toast.error(`Image upload failed: ${error.message}`); // Add user feedback
        return;
      }
      // Construct the public URL manually or use getPublicUrl
      // Note: Using getPublicUrl is generally preferred as it handles edge cases/config changes better.
      // const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${newFileName}`;
      const { data } = supabase.storage.from(bucket).getPublicUrl(newFileName);

      if (data?.publicUrl) {
        updateElement(element.id, { value: data.publicUrl });
      } else {
        console.error("Could not get public URL after upload.");
        toast.error("Image uploaded, but failed to get URL.");
      }
    } catch (error) {
      console.error("Image upload process error:", error);
      toast.error("An unexpected error occurred during image upload."); // User feedback
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    // Attempt to delete the image from storage BEFORE deleting the element data
    if (element.type === "image" && element.value) {
      try {
        const urlObj = new URL(element.value);
        // Adjust path based on your bucket structure if needed
        const pathParts = urlObj.pathname.split("/");
        const bucketName = pathParts[pathParts.length - 2];
        const fileName = decodeURIComponent(pathParts[pathParts.length - 1]);

        if (bucketName && fileName) {
          console.log(`Attempting delete from bucket: ${bucketName}, file: ${fileName}`);
          const { error: removeError } = await supabase.storage.from(bucketName).remove([fileName]);
          if (removeError) console.error("Error deleting image from bucket:", removeError.message);
          // Don't block element deletion if storage deletion fails, but log it.
        } else {
          console.warn("Could not parse bucket/filename from URL for deletion:", element.value);
        }
      } catch (error) {
        console.error("Error parsing/deleting image URL during element deletion:", error);
      }
    }
    // Proceed to delete the element from the form state
    deleteElement(element.id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("elementId", element.id); // Use specific key "elementId"
    // Also pass pageIndex if reordering across pages is possible (currently not implemented in drop)
    // e.dataTransfer.setData("pageIndex", String(currentPageIndex));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("elementId"); // Get the correct key
    // const draggedPageIndex = parseInt(e.dataTransfer.getData("pageIndex"), 10); // If needed

    // Ensure drop happens only if IDs are different and maybe on the same page
    if (draggedId && draggedId !== element.id /* && draggedPageIndex === currentPageIndex */) {
      reorderElements(draggedId, element.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling up to parent containers
    // Check if the currently selected element is different from this one
    if (selectedElement?.element?.id !== element.id || selectedElement?.pageIndex !== currentPageIndex) {
      setSelectedElement({ element, pageIndex: currentPageIndex });
    }
  };

  const isSelected = selectedElement?.element?.id === element.id && selectedElement?.pageIndex === currentPageIndex;

  return (
    // Add the drag handlers to the outer div
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick} // Handle selection click on the wrapper
      className={cn(
        "mb-4 p-4 rounded-lg shadow border bg-white relative group", // Added relative and group for potential future styling
        isSelected ? "ring-2 ring-blue-500 border-blue-500" : "border-transparent hover:border-gray-200", // Improved selection/hover indication
        "transition-all duration-150"
      )}>
      {/* Motion div for potential animations (though variants aren't strictly needed if layout prop is used) */}
      <motion.div
        layout // Enable automatic animation for layout changes (like reordering)
        // variants={itemVariants} // You can keep variants if needed for enter/exit specifically
        // initial="hidden"
        // animate="visible"
        className="flex items-start" // Keep flex layout for handle + content
      >
        {/* Drag Handle - Placed absolutely or flex item */}
        <div
          className="mr-3 flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 pt-1"
          // Stop propagation to prevent handle click selecting the element
          onMouseDown={(e) => e.stopPropagation()}
          title="Drag to reorder">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Element Content */}
        <div className="flex-1">
          {/* Header: Label Input and Delete Button */}
          <div className="flex items-center justify-between mb-2">
            {/* Consider making the title non-editable here, edit in properties panel */}
            <span className="font-medium text-sm mr-2 truncate flex-1">{element.title || "Untitled"}</span>
            {/* Or keep Input if direct editing is desired */}
            {/* <Input
              value={element.title}
              onChange={(e) => updateElement(element.id, { title: e.target.value })}
              placeholder="Element Label"
              className="flex-1 mr-2 text-sm font-medium border-none focus:ring-1 focus:ring-blue-300 p-1 rounded"
              onClick={(e) => e.stopPropagation()} // Prevent selection on input click
            /> */}
            <Button
              variant="ghost"
              size="icon-sm" // Smaller icon button
              onClick={(e) => {
                e.stopPropagation(); // Prevent selection
                handleDelete();
              }}
              className="text-red-500 hover:text-red-700 opacity-50 group-hover:opacity-100 focus:opacity-100" // Show on hover/focus
              title="Delete Element">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Element Type Specific Renderer */}
          <div>
            {(() => {
              // Add more robust rendering based on type
              switch (element.type) {
                case "text":
                  return (
                    <Input
                      placeholder="Preview text input"
                      readOnly // Make canvas inputs read-only previews
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles} // Apply element styles
                    />
                  );
                case "checkbox":
                  return (
                    <label className="flex items-center space-x-2 mt-1 text-sm">
                      <input
                        type="checkbox"
                        disabled
                        className="h-4 w-4"
                      />
                      <span>{element.title || "Checkbox"}</span> {/* Use title or generic */}
                    </label>
                  );
                case "date":
                  return (
                    <Input
                      type="date"
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}
                    />
                  );
                case "rating":
                  return (
                    <div className="flex space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className="text-gray-300 text-xl cursor-default">
                          ★
                        </span>
                      ))}
                    </div>
                  );
                case "select":
                  return (
                    <select
                      disabled
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}>
                      {/* Add options if available in element data */}
                      {(element.options || ["Option 1", "Option 2"]).map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  );
                case "phone":
                  return (
                    <Input
                      type="tel"
                      placeholder="Preview phone input"
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}
                    />
                  );
                case "email":
                  return (
                    <Input
                      type="email"
                      placeholder="Preview email input"
                      readOnly
                      className="mt-1 w-full p-2 border rounded bg-gray-50 text-sm"
                      style={element.styles}
                    />
                  );
                case "image":
                  return (
                    <div className="mt-2 space-y-2">
                      {uploading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Loader className="animate-spin h-4 w-4" />
                          <span>Uploading...</span>
                        </div>
                      ) : element.value ? (
                        <div className="relative group/image">
                          {" "}
                          {/* Differentiate group name */}
                          <img
                            src={element.value}
                            alt={element.title || "Uploaded image"}
                            // Apply styles intelligently (width, height, object-fit?)
                            style={{ maxWidth: "100%", maxHeight: "200px", display: "block", ...element.styles }}
                            className="rounded border"
                          />
                          {/* Overlay buttons for replace/delete */}
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <Button
                              size="icon-xs"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileSelect();
                              }}
                              title="Replace Image">
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
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        onClick={(e) => e.stopPropagation()} // Prevent selection
                        className="hidden"
                      />
                    </div>
                  );
                case "yesno": // Example rendering
                  return (
                    <div className="flex space-x-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled>
                        Yes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled>
                        No
                      </Button>
                    </div>
                  );
                case "link":
                  return (
                    <a
                      href={element.value || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.preventDefault()} // Prevent navigation in builder
                      className="mt-1 text-blue-600 underline text-sm break-all"
                      style={element.styles}>
                      {element.title || element.value || "Link"}
                    </a>
                  );
                case "button":
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
                  return <div className="mt-1 text-xs text-red-500">(Unsupported Type: {element.type})</div>;
              }
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
