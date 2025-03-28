// src/components/preview/HeaderElement.tsx
import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check } from "lucide-react";

interface HeaderElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
}

export default function HeaderElement({ element, styles, updateElement }: HeaderElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(element.title || "");

  const handleSave = () => {
    updateElement(element.id, { title: title || "Header Text" }); // Provide default
    setIsEditing(false);
  };

  return (
    <div className="relative group my-4 text-center">
      {" "}
      {/* Center align header */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute -top-1 -right-1 p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Edit Header">
        <Edit2 size={16} />
      </button>
      {isEditing ? (
        <div className="p-3 border rounded bg-gray-100 flex items-center justify-center space-x-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Header Text"
            className="text-xl font-semibold p-1 border rounded text-center" // Match display style
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm flex items-center">
            <Check
              size={16}
              className="mr-1"
            />{" "}
            Save
          </button>
        </div>
      ) : (
        <h2
          className="text-xl font-semibold"
          style={{ color: styles.textColor }}>
          {element.title || "Header Text"}
        </h2>
      )}
    </div>
  );
}
