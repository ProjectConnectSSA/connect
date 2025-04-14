// src/components/preview/ButtonElement.tsx
import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check } from "lucide-react";

interface ButtonElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ButtonElement({ element, styles, updateElement, deleteElement }: ButtonElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(element.title || "");
  const [url, setUrl] = useState(element.url || "");

  const handleSave = () => {
    updateElement(element.id, { title: title || "Button Text", url: url }); // URL can be empty/undefined
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  const buttonBaseStyle = `w-full p-4 text-center transition duration-150 ease-in-out block ${radiusClass}`;
  const buttonFilledStyle = `${buttonBaseStyle} text-white`;
  const buttonOutlineStyle = `${buttonBaseStyle} border-2 bg-transparent`;

  return (
    <div className="relative group mb-3">
      <button onClick={() => setIsEditing(!isEditing)} className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Edit Button">
        <Edit2 size={16} />
      </button>

      {isEditing ? (
        <div className="p-3 border rounded bg-gray-100 space-y-2">
          <label className="text-xs font-medium text-gray-600 block">Button Text</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Button Text" className="w-full p-1 border rounded text-sm font-medium" />
          <label className="text-xs font-medium text-gray-600 block">URL (Optional)</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full p-1 border rounded text-sm" />
          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center">
            <Check size={16} className="mr-1" /> Save
          </button>
        </div>
      ) : (
        // Render as 'a' if URL exists, 'span' or 'div' styled as button if not
        React.createElement(
          element.url ? "a" : "span", // Use 'span' or 'div' if no URL to avoid empty href
          {
            href: element.url || undefined,
            target: element.url ? "_blank" : undefined,
            rel: element.url ? "noopener noreferrer" : undefined,
            className: styles.buttonStyle === "filled" ? buttonFilledStyle : buttonOutlineStyle,
            style: styles.buttonStyle === "filled" ? { backgroundColor: styles.buttonColor, color: styles.buttonTextColor } : { borderColor: styles.buttonColor, color: styles.buttonColor },
          },
          <span className="font-medium">{element.title || "Button Text"}</span>
        )
      )}
    </div>
  );
}
