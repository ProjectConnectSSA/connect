import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { User, Edit2 } from "lucide-react";

// Initialize Supabase client (Consider moving to a shared utils file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  const { data, error } = await supabase.storage.from("avatars").upload(filePath, file); // Ensure 'avatars' bucket exists and is public
  if (error) {
    console.error("Upload error", error);
    throw error;
  }
  // Construct the public URL correctly
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
}

export default function ProfileElement({ element, styles, updateElement }: ProfileElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(element.name || "");
  const [bio, setBio] = useState(element.bioText || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        toast.info("Uploading avatar...");
        const url = await uploadImage(file);
        updateElement(element.id, { avatarUrl: url });
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
    updateElement(element.id, { name: name, bioText: bio });
    setIsEditing(false);
  };

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`; // Map style prop to Tailwind class

  return (
    <div className="flex flex-col items-center mb-6 text-center relative group">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Edit Profile">
        <Edit2 size={16} />
      </button>

      {/* Avatar */}
      <div className="relative mb-3">
        {element.avatarUrl ? (
          <img
            src={element.avatarUrl}
            alt="Avatar"
            className={`w-24 h-24 object-cover border-2 border-gray-300 ${radiusClass === "rounded-full" ? "rounded-full" : radiusClass}`} // Apply radius, default to full if 'full'
            style={{ borderColor: styles.buttonColor }} // Use button color for border?
          />
        ) : (
          <div
            className={`w-24 h-24 bg-gray-300 flex items-center justify-center border-2 border-gray-300 ${
              radiusClass === "rounded-full" ? "rounded-full" : radiusClass
            }`}
            style={{ borderColor: styles.buttonColor }}>
            <User
              size={40}
              className="text-gray-500"
            />
          </div>
        )}
        {isEditing && (
          <div className="absolute bottom-0 right-0">
            <label
              htmlFor={`avatar-upload-${element.id}`}
              className="cursor-pointer bg-white rounded-full p-1 shadow border">
              <Edit2
                size={14}
                className="text-gray-600"
              />
            </label>
            <input
              id={`avatar-upload-${element.id}`}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading && <span className="text-xs">Uploading...</span>}
          </div>
        )}
      </div>

      {/* Name and Bio */}
      {isEditing ? (
        <div className="w-full max-w-xs flex flex-col items-center space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="text-center text-xl font-semibold p-1 border rounded w-full"
            style={{ color: styles.textColor }}
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Your Bio"
            className="text-center text-sm p-1 border rounded w-full resize-none"
            rows={2}
            style={{ color: styles.textColor }}
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
            Save
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
