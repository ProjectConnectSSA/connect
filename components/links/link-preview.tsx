"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { StyleProps } from "./link-styles";

// Export the BioElement type for use in other components
export interface BioElement {
  id: string;
  type: "link" | "card" | "button";
  content: string;
  avatarURL?: string;
  bioText?: string;
}

// Initialize Supabase client – ensure your environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Upload image to Supabase Storage
async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  const { data, error } = await supabase.storage.from("avatars").upload(filePath, file);
  if (error) {
    console.error("Upload error", error);
    throw error;
  }
  return `${supabaseUrl}/storage/v1/object/public/avatars/${data.path}`;
}

interface LinkPreviewProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
}

function CardEditor({ card, onUpdate }: { card: BioElement; onUpdate: (updatedCard: BioElement) => void }) {
  const [bioText, setBioText] = useState(card.bioText || "");
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const url = await uploadImage(file);
        onUpdate({ ...card, avatarURL: url });
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  }

  return (
    <div className="mt-2 p-2 border-t">
      <label className="block text-sm font-medium mb-1">Avatar Image</label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label className="block text-sm font-medium mt-2 mb-1">Bio Info</label>
      <input
        type="text"
        value={bioText}
        onChange={(e) => {
          setBioText(e.target.value);
          onUpdate({ ...card, bioText: e.target.value });
        }}
        className="w-full p-1 border rounded"
        placeholder="Enter your bio info"
      />
    </div>
  );
}

function CardElement({
  card,
  editing,
  onToggleEdit,
  onUpdate,
}: {
  card: BioElement;
  editing: boolean;
  onToggleEdit: () => void;
  onUpdate: (updatedCard: BioElement) => void;
}) {
  return (
    <div className="p-4 rounded shadow border bg-green-50 border-green-200">
      <div className="flex items-center space-x-4">
        {card.avatarURL ? (
          <img
            src={card.avatarURL}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-lg font-bold">?</span>
          </div>
        )}
        <div className="flex-grow">
          <p>{card.bioText || "Your bio info here"}</p>
        </div>
        <button
          onClick={onToggleEdit}
          className="text-sm text-blue-600 underline">
          {editing ? "Close" : "Edit"}
        </button>
      </div>
      {editing && (
        <CardEditor
          card={card}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

export default function LinkPreview({ elements, onDrop, onDragOver, styles, updateElement }: LinkPreviewProps) {
  return (
    <div
      className="p-4 flex-1"
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
        backgroundSize: "cover",
        minHeight: "500px",
      }}>
      <h2 className="text-lg font-semibold mb-4">Preview</h2>
      {elements.length === 0 ? (
        <p className="text-gray-500">Drop elements here to build your page.</p>
      ) : (
        <div className="space-y-3">
          {elements.map((elem) =>
            elem.type === "card" ? (
              <CardElement
                key={elem.id}
                card={elem}
                editing={false} // You can manage an editing state as needed.
                onToggleEdit={() => updateElement(elem.id, { bioText: elem.bioText })}
                onUpdate={(updatedCard) => updateElement(elem.id, updatedCard)}
              />
            ) : (
              <div
                key={elem.id}
                className={`p-4 rounded shadow border ${elem.type === "link" ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
                {elem.content}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
