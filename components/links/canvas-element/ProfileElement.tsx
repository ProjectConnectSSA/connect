import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { User, Edit2, Trash2, Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react"; // Added icons

// --- Supabase & Upload Config (RECOMMENDATION: Move to shared utils) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = "linkimage"; // Your Supabase storage bucket name for avatars/images
const MAX_FILE_SIZE_MB = 2; // Max avatar size in MB

async function uploadImage(file: File): Promise<string> {
  // Client-side validation
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `avatars/${fileName}`; // Optional: Use a subfolder like 'avatars'

  const { data, error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    if (uploadError.message.includes("Bucket not found")) {
      throw new Error(`Storage bucket "${BUCKET_NAME}" not found.`);
    }
    throw new Error(`Avatar upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error("Failed to get public URL for path:", data.path);
    throw new Error("Failed to get public URL after upload.");
  }

  return publicUrlData.publicUrl;
}
// --- End Supabase & Upload Config ---

interface ProfileElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop, though less relevant for profile
}

const DEFAULT_NAME = "Your Name";
const DEFAULT_BIO = "Your bio goes here. Click edit to change.";

export default function ProfileElement({
  element,
  styles,
  updateElement,
  deleteElement,
  isNested = false, // Default to false
}: ProfileElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely
  const currentName = element.name || "";
  const currentBio = element.bioText || "";
  const currentAvatarUrl = element.avatarUrl || "";

  // States for dialog editing
  const [editedName, setEditedName] = useState(currentName);
  const [editedBio, setEditedBio] = useState(currentBio);
  const [editedAvatarUrl, setEditedAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Reset local state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setEditedName(currentName);
      setEditedBio(currentBio);
      setEditedAvatarUrl(currentAvatarUrl);
      setUploading(false);
      setUploadError(null);
    }
  }, [isModalOpen, currentName, currentBio, currentAvatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    const toastId = toast.loading("Uploading avatar...", { description: file.name });

    try {
      const url = await uploadImage(file);
      setEditedAvatarUrl(url); // Update local state for preview
      toast.success("Avatar uploaded!", { id: toastId });
    } catch (error: any) {
      console.error("Upload failed", error);
      const errorMessage = error.message || "An unknown error occurred.";
      setUploadError(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`, { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset file input
    }
  };

  const handleSave = () => {
    const finalName = editedName.trim();
    const finalBio = editedBio.trim();
    const finalAvatarUrl = editedAvatarUrl.trim(); // Should already be trimmed from upload

    // Check if anything actually changed
    const hasChanged = finalName !== currentName || finalBio !== currentBio || finalAvatarUrl !== currentAvatarUrl;

    if (hasChanged) {
      updateElement(element.id, {
        name: finalName, // Allow empty name if user clears it
        bioText: finalBio,
        avatarUrl: finalAvatarUrl,
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDelete = () => deleteElement(element.id);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Allow Enter in textarea unless Ctrl/Meta is pressed
    if (event.key === "Enter" && !(event.target instanceof HTMLTextAreaElement && !event.metaKey && !event.ctrlKey)) {
      event.preventDefault();
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // --- Styling & Rendering ---
  // Use full border radius for avatar regardless of global setting? Or respect global? Let's respect it for consistency.
  const avatarRadiusClass =
    styles.borderRadius === "full" ? "rounded-full" : styles.borderRadius === "none" ? "rounded-none" : `rounded-${styles.borderRadius}`;
  const avatarSize = "w-24 h-24"; // Consistent size
  const avatarPlaceholderSize = 48; // Icon size within placeholder

  return (
    // Use padding for spacing around content
    <div className={`relative group flex flex-col items-center text-center ${isNested ? "p-2 mb-2" : "p-4 mb-4"}`}>
      {/* Edit/Delete Controls - Positioned top-right of the container */}
      <div className="absolute top-1 right-1 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root
          open={isModalOpen}
          onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button
              className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50"
              aria-label="Edit Profile">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content
              className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow"
              onEscapeKeyDown={handleCancel}
              onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Profile</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400"
                    aria-label="Close"
                    onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-5 mb-6 max-h-[65vh] overflow-y-auto pr-2">
                {/* --- Avatar Section --- */}
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2 self-start">Profile Picture (Max {MAX_FILE_SIZE_MB}MB)</label>
                  {/* Avatar Preview within Modal */}
                  <div
                    className={`relative ${avatarSize} ${avatarRadiusClass} overflow-hidden border-2 border-gray-300 mb-3 bg-gray-100 flex items-center justify-center`}>
                    {editedAvatarUrl ? (
                      <img
                        src={editedAvatarUrl}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={avatarPlaceholderSize}
                        className="text-gray-400"
                      />
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2
                          size={32}
                          className="text-white animate-spin"
                        />
                      </div>
                    )}
                  </div>
                  {/* Upload Button/Input */}
                  <label
                    htmlFor={`avatar-upload-${element.id}`}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                      uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}>
                    <Upload
                      size={16}
                      className={`mr-2 ${uploading ? "animate-pulse" : ""}`}
                    />
                    {uploading ? "Uploading..." : "Choose Image"}
                  </label>
                  <input
                    id={`avatar-upload-${element.id}`}
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  {/* Upload Error Display */}
                  {uploadError && (
                    <p className="text-xs text-red-600 mt-2 flex items-center text-center">
                      <X
                        size={14}
                        className="mr-1 text-red-400 flex-shrink-0"
                      />{" "}
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* --- Name Input --- */}
                <div>
                  <label
                    htmlFor={`profile-name-${element.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    id={`profile-name-${element.id}`}
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={DEFAULT_NAME}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    autoFocus // Autofocus on name field
                  />
                </div>

                {/* --- Bio Input --- */}
                <div>
                  <label
                    htmlFor={`profile-bio-${element.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio (Optional)
                  </label>
                  <textarea
                    id={`profile-bio-${element.id}`}
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={DEFAULT_BIO}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none" // Added resize-none
                    rows={3}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button
                    onClick={handleCancel}
                    type="button"
                    disabled={uploading}
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition disabled:opacity-50">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button"
                  disabled={uploading}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {uploading ? (
                    <Loader2
                      size={16}
                      className="animate-spin mr-1"
                    />
                  ) : (
                    <Check
                      size={16}
                      className="mr-1"
                    />
                  )}
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50"
          aria-label="Delete Profile">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Profile Preview on Canvas */}
      <div
        className={`relative ${avatarSize} ${avatarRadiusClass} overflow-hidden border-2 bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center`}
        style={{ borderColor: styles.buttonColor || styles.textColor }}>
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={currentName || "Profile picture"} // Use name for alt text
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")} // Hide img on error
          />
        ) : (
          // Display icon within the bordered container if no image
          <User
            size={avatarPlaceholderSize}
            className="text-gray-500 dark:text-gray-400"
          />
        )}
      </div>
      {/* Name */}
      <h1
        className="text-xl font-semibold break-words"
        style={{ color: styles.textColor }}>
        {currentName || DEFAULT_NAME}
      </h1>
      {/* Bio */}
      {(currentBio || !currentName) && ( // Show default bio only if name is also default/empty, or if bio exists
        <p
          className="text-sm mt-1 max-w-md break-words"
          style={{ color: styles.textColor, opacity: 0.9 }}>
          {currentBio || DEFAULT_BIO}
        </p>
      )}
    </div>
  );
}
