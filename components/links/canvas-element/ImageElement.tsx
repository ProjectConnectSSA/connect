import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, Image as ImageIcon, Upload, Loader2 } from "lucide-react"; // Added Loader2

// Initialize Supabase client (RECOMMENDATION: Move this to a shared utils/supabase.ts file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const BUCKET_NAME = "linkimage"; // Your Supabase storage bucket name
const MAX_FILE_SIZE_MB = 5; // Max image size in MB

// Upload function (could also be in utils)
async function uploadImage(file: File): Promise<string> {
  // Client-side validation
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`; // Use crypto.randomUUID for better uniqueness
  const filePath = `${fileName}`; // Keep path simple or add user ID folder structure

  const { data, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    // Provide more specific error message if possible
    if (uploadError.message.includes("Bucket not found")) {
      throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Please check configuration.`);
    }
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error("Failed to get public URL for path:", data.path);
    // Attempt to clean up uploaded file if URL retrieval fails? (Optional)
    // await supabase.storage.from(BUCKET_NAME).remove([data.path]);
    throw new Error("Failed to get public URL after upload.");
  }

  return publicUrlData.publicUrl;
}

interface ImageElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

export default function ImageElement({ element, styles, updateElement, deleteElement, isNested = false }: ImageElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely (using element.url for image source, element.title for alt text)
  const currentImageUrl = element.url || "";
  const currentAltText = element.title || ""; // Use element.title for alt text

  // States for dialog editing
  const [editedImageUrl, setEditedImageUrl] = useState(currentImageUrl);
  const [editedAltText, setEditedAltText] = useState(currentAltText);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Reset local state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setEditedImageUrl(currentImageUrl);
      setEditedAltText(currentAltText);
      setUploading(false); // Reset uploading state
      setUploadError(null); // Clear errors
    }
  }, [isModalOpen, currentImageUrl, currentAltText]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null); // Clear previous errors
    const toastId = toast.loading("Uploading image...", { description: file.name });

    try {
      const url = await uploadImage(file);
      setEditedImageUrl(url); // Update local state with new URL
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error: any) {
      console.error("Upload failed", error);
      const errorMessage = error.message || "An unknown error occurred during upload.";
      setUploadError(errorMessage); // Store error message for display
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
    } finally {
      setUploading(false);
      // Reset file input value to allow uploading the same file again if needed
      e.target.value = "";
    }
  };

  const handleSave = () => {
    const finalImageUrl = editedImageUrl.trim();
    const finalAltText = editedAltText.trim();

    // Check if anything changed
    const hasChanged = finalImageUrl !== currentImageUrl || finalAltText !== currentAltText;

    if (hasChanged) {
      // Update using element.url for image source, element.title for alt text
      updateElement(element.id, { url: finalImageUrl, title: finalAltText });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDelete = () => deleteElement(element.id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // --- Styling & Rendering ---
  const radiusClass = styles.borderRadius === "none" ? "rounded-none" : `rounded-${styles.borderRadius}`;
  const hasImage = !!currentImageUrl;

  return (
    <div className="relative group my-3 w-full">
      {/* Edit/Delete Controls */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Image">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Image</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-5 mb-6 max-h-[65vh] overflow-y-auto pr-2">
                {/* --- Upload Section --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Max {MAX_FILE_SIZE_MB}MB)</label>
                  {/* Image Preview within Modal */}
                  <div className="mb-3 w-full aspect-video bg-gray-100 flex items-center justify-center rounded overflow-hidden border border-gray-200 relative">
                    {editedImageUrl ? <img src={editedImageUrl} alt={editedAltText || "Preview"} className="w-full h-full object-contain" /> : <ImageIcon size={48} className="text-gray-400" />}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 size={32} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Button/Input */}
                  <label htmlFor={`image-upload-${element.id}`} className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                    <Upload size={16} className={`mr-2 ${uploading ? "animate-pulse" : ""}`} />
                    {uploading ? "Uploading..." : "Choose Image"}
                  </label>
                  <input
                    id={`image-upload-${element.id}`}
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp" // Be more specific with accepted types
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  {/* Upload Error Display */}
                  {uploadError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <X size={14} className="mr-1 text-red-400" /> {uploadError}
                    </p>
                  )}
                </div>

                <div className="text-center text-sm text-gray-500">OR</div>

                {/* --- Manual URL Input --- */}
                <div>
                  <label htmlFor={`image-url-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Enter Image URL
                  </label>
                  <input id={`image-url-${element.id}`} type="url" value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="https://example.com/image.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" disabled={uploading} />
                </div>

                {/* --- Alt Text Input --- */}
                <div>
                  <label htmlFor={`alt-text-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Alt Text <span className="text-xs text-gray-500">(Recommended for accessibility)</span>
                  </label>
                  <input id={`alt-text-${element.id}`} type="text" value={editedAltText} onChange={(e) => setEditedAltText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Describe the image (e.g., 'Logo for ACME Corp')" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" disabled={uploading} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} type="button" disabled={uploading} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition disabled:opacity-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button onClick={handleSave} type="button" disabled={uploading} className="px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Check size={16} className="mr-1" />}
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Image">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Image Preview on Main Canvas */}
      <div className={`w-full overflow-hidden ${radiusClass} border border-gray-200/60 dark:border-gray-700/60`}>
        {hasImage ? (
          <img
            src={currentImageUrl}
            // Use currentAltText which comes from element.title
            alt={currentAltText || "User uploaded image"}
            className={`w-full h-auto object-contain block ${radiusClass}`} // Use object-contain for potentially varied aspect ratios, or 'cover' if preferred
            loading="lazy" // Lazy load images
            onError={(e) => {
              // Optionally hide or replace with placeholder on error
              (e.target as HTMLImageElement).style.display = "none";
              // Could add a visible error state here if desired
            }}
          />
        ) : (
          // Placeholder when no image URL is provided
          <div className={`w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800/50 flex flex-col items-center justify-center ${radiusClass} p-4`}>
            <ImageIcon size={40} className="text-gray-400 dark:text-gray-500 mb-2" />
            <span className="text-gray-500 dark:text-gray-400 text-sm text-center">Image Required</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">(Click edit icon)</span>
          </div>
        )}
      </div>
    </div>
  );
}
