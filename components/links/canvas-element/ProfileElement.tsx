import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { User, Edit2, Trash2, Upload } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Initialize Supabase client (Consider moving to a shared utils file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  const { data, error } = await supabase.storage.from("avatars").upload(filePath, file);
  if (error) {
    console.error("Upload error", error);
    throw error;
  }
  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
  if (!publicUrlData) {
    console.error("Failed to get public URL for path:", data.path);
    throw new Error("Failed to get public URL");
  }
  return publicUrlData.publicUrl;
}

interface ProfileElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ProfileElement({ element, styles, updateElement, deleteElement }: ProfileElementProps) {
  // Local states for editing values
  const [uploading, setUploading] = useState(false);
  const [editedName, setEditedName] = useState(element.name || "");
  const [editedBio, setEditedBio] = useState(element.bioText || "");
  const [editedAvatarUrl, setEditedAvatarUrl] = useState(element.avatarUrl || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        toast.info("Uploading avatar...");
        const url = await uploadImage(file);
        setEditedAvatarUrl(url);
        toast.success("Avatar updated!");
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Image upload failed. Check console/bucket policy.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = () => {
    updateElement(element.id, { name: editedName, bioText: editedBio, avatarUrl: editedAvatarUrl });
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  // Map border radius from the style prop to a Tailwind class
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;

  return (
    <div className="flex flex-col items-center mb-6 text-center relative group">
      {/* Hover Controls: Edit and Delete Buttons */}
      <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              aria-label="Edit Profile">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-semibold mb-4">Edit Profile</Dialog.Title>
              <div className="flex flex-col space-y-4">
                {/* Avatar Section */}
                <div className="w-full flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                  <div className="w-24 h-24">
                    {editedAvatarUrl ? (
                      <img
                        src={editedAvatarUrl}
                        alt="Avatar"
                        className={`w-24 h-24 object-cover border-2 ${radiusClass}`}
                        style={{ borderColor: styles.buttonColor }}
                      />
                    ) : (
                      <div
                        className={`w-24 h-24 bg-gray-300 flex items-center justify-center border-2 ${radiusClass}`}
                        style={{ borderColor: styles.buttonColor }}>
                        <User
                          size={40}
                          className="text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                  {/* Upload button positioned below the avatar preview */}
                  <button
                    onClick={() => document.getElementById(`avatar-upload-${element.id}`)?.click()}
                    className="mt-2 flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                    <Upload
                      size={16}
                      className="mr-1 text-gray-600"
                    />
                    <span className="text-sm text-gray-700">Upload</span>
                  </button>
                  <input
                    id={`avatar-upload-${element.id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </div>
                {/* Name Section */}
                <div className="w-full">
                  <label
                    htmlFor={`profile-name-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id={`profile-name-${element.id}`}
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Your Name"
                    className="text-center text-xl font-semibold p-2 border rounded w-full"
                    style={{ color: styles.textColor }}
                  />
                </div>
                {/* Bio Section */}
                <div className="w-full">
                  <label
                    htmlFor={`profile-bio-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id={`profile-bio-${element.id}`}
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Your Bio"
                    className="text-center text-sm p-2 border rounded w-full resize-none"
                    rows={3}
                    style={{ color: styles.textColor }}
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
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    aria-label="Save">
                    Save
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          onClick={handleDelete}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="Delete Profile">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Profile Preview */}
      <div className="mb-3">
        {element.avatarUrl ? (
          <img
            src={element.avatarUrl}
            alt="Avatar"
            className={`w-24 h-24 object-cover border-2 ${radiusClass === "rounded-full" ? "rounded-full" : radiusClass}`}
            style={{ borderColor: styles.buttonColor }}
          />
        ) : (
          <div
            className={`w-24 h-24 bg-gray-300 flex items-center justify-center border-2 ${
              radiusClass === "rounded-full" ? "rounded-full" : radiusClass
            }`}
            style={{ borderColor: styles.buttonColor }}>
            <User
              size={40}
              className="text-gray-500"
            />
          </div>
        )}
      </div>
      <h1
        className="text-xl font-semibold"
        style={{ color: styles.textColor }}>
        {element.name || "Your Name"}
      </h1>
      <p
        className="text-sm mt-1"
        style={{ color: styles.textColor }}>
        {element.bioText || "Your bio goes here. Click edit to change."}
      </p>
    </div>
  );
}
