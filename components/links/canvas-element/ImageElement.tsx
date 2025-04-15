import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Edit2, Check, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Initialize Supabase client (Consider moving to a shared utils file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  const { data, error } = await supabase.storage.from("linkimage").upload(filePath, file); // Ensure bucket exists & is public
  if (error) {
    console.error("Upload error", error);
    throw error;
  }
  const { data: publicUrlData } = supabase.storage.from("linkimage").getPublicUrl(data.path);
  if (!publicUrlData) {
    console.error("Failed to get public URL for path:", data.path);
    throw new Error("Failed to get public URL");
  }
  return publicUrlData.publicUrl;
}

interface ImageElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ImageElement({ element, styles, updateElement, deleteElement }: ImageElementProps) {
  // Local state for editing values; initialized from the element prop
  const [editedImageUrl, setEditedImageUrl] = useState(element.url || "");
  const [editedAltText, setEditedAltText] = useState(element.title || "");
  const [uploading, setUploading] = useState(false);

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  // Determine which URL to display
  const displayUrl = element.url || element.thumbnailUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        toast.info("Uploading image...");
        const url = await uploadImage(file);
        setEditedImageUrl(url);
        toast.success("Image uploaded!");
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Image upload failed. Check console/bucket policy.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="relative group my-3">
      {/* Hover Controls: Edit and Delete */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition" aria-label="Edit Image">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-semibold mb-4">Edit Image</Dialog.Title>
              <div className="space-y-4">
                {/* Upload Section */}
                <div className="w-full flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
                  {editedImageUrl ? (
                    <img src={editedImageUrl} alt={editedAltText || "Uploaded image"} className={`w-full h-auto object-cover ${radiusClass}`} />
                  ) : (
                    <div className={`w-full aspect-video bg-gray-200 flex items-center justify-center ${radiusClass}`}>
                      <ImageIcon size={40} className="text-gray-400" />
                      <span className="ml-2 text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <button onClick={() => document.getElementById(`image-upload-${element.id}`)?.click()} className="mt-2 flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                    <Upload size={16} className="mr-1 text-gray-600" />
                    <span className="text-sm text-gray-700">Upload</span>
                  </button>
                  <input id={`image-upload-${element.id}`} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                </div>
                {/* Manual URL Input */}
                <div>
                  <label htmlFor={`image-url-${element.id}`} className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input id={`image-url-${element.id}`} type="url" value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} placeholder="https://image.url/image.jpg" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {/* Alt Text Input */}
                <div>
                  <label htmlFor={`alt-text-${element.id}`} className="block text-sm font-medium text-gray-700">
                    Alt Text (for accessibility)
                  </label>
                  <input id={`alt-text-${element.id}`} type="text" value={editedAltText} onChange={(e) => setEditedAltText(e.target.value)} placeholder="Describe the image" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" aria-label="Cancel">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button onClick={() => updateElement(element.id, { url: editedImageUrl, title: editedAltText })} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" aria-label="Save">
                    <Check size={16} className="mr-1" /> Save
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button onClick={() => deleteElement(element.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition" aria-label="Delete Image">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Image Preview: Display image if available; otherwise, show placeholder */}
      {displayUrl ? (
        <img src={displayUrl} alt={element.title || "User uploaded image"} className={`w-full h-auto object-cover ${radiusClass}`} />
      ) : (
        <div className={`w-full aspect-video bg-gray-200 flex items-center justify-center ${radiusClass}`}>
          <ImageIcon size={40} className="text-gray-400" />
          <span className="ml-2 text-gray-500 text-sm">Image URL needed</span>
        </div>
      )}
    </div>
  );
}
