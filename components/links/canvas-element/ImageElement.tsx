// src/components/preview/ImageElement.tsx
import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check, Image as ImageIcon, Trash2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface ImageElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ImageElement({ element, styles, updateElement, deleteElement }: ImageElementProps) {
  // Local state for editing values; they are initialized from the element prop
  const [editedImageUrl, setEditedImageUrl] = useState(element.url || "");
  const [editedAltText, setEditedAltText] = useState(element.title || "");

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;

  // Determine which image URL to display: use the primary url; fall back to thumbnailUrl if needed
  const displayUrl = element.url || element.thumbnailUrl;

  return (
    <div className="relative group my-3">
      {/* Hover Controls: Edit and Delete */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              aria-label="Edit Image">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-semibold mb-4">Edit Image</Dialog.Title>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`image-url-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    id={`image-url-${element.id}`}
                    type="url"
                    value={editedImageUrl}
                    onChange={(e) => setEditedImageUrl(e.target.value)}
                    placeholder="https://image.url/image.jpg"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`alt-text-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Alt Text (for accessibility)
                  </label>
                  <input
                    id={`alt-text-${element.id}`}
                    type="text"
                    value={editedAltText}
                    onChange={(e) => setEditedAltText(e.target.value)}
                    placeholder="Describe the image"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    aria-label="Cancel">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={() => updateElement(element.id, { url: editedImageUrl, title: editedAltText })}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    aria-label="Save">
                    <Check
                      size={16}
                      className="mr-1"
                    />{" "}
                    Save
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          onClick={() => deleteElement(element.id)}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="Delete Image">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Image preview: shows the image if available, or a placeholder */}
      {displayUrl ? (
        <img
          src={displayUrl}
          alt={element.title || "User uploaded image"}
          className={`w-full h-auto object-cover ${radiusClass}`}
        />
      ) : (
        <div className={`w-full aspect-video bg-gray-200 flex items-center justify-center ${radiusClass}`}>
          <ImageIcon
            size={40}
            className="text-gray-400"
          />
          <span className="ml-2 text-gray-500 text-sm">Image URL needed</span>
        </div>
      )}
    </div>
  );
}
