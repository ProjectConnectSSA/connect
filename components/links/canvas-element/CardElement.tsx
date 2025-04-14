// src/components/preview/CardElement.tsx
import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check, Image as ImageIcon } from "lucide-react";

interface CardElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function CardElement({ element, styles, updateElement, deleteElement }: CardElementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(element.title || "");
  const [description, setDescription] = useState(element.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(element.thumbnailUrl || "");
  const [url, setUrl] = useState(element.url || ""); // URL the card links to

  const handleSave = () => {
    updateElement(element.id, {
      title: title || "Card Title",
      description: description,
      thumbnailUrl: thumbnailUrl,
      url: url,
      // layout: element.layout // Preserve layout if set
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };
  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  // Card background: slightly off from main background or using button color aspects?
  // Let's use a subtle background for now, maybe derived from text/bg color later.
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
  const cardTextColor = styles.textColor; // Inherit text color for now

  // The element itself doesn't enforce grid layout, it just renders its content.
  // The parent LinkPreview should handle grid for `layout === 'double'` elements.
  const cardContent = (
    <>
      {element.thumbnailUrl && (
        <img
          src={element.thumbnailUrl}
          alt={element.title || "Card thumbnail"}
          className={`w-full h-32 object-cover ${radiusClass.replace("rounded-", "rounded-t-")} ${!element.title && !element.description ? radiusClass : ""}`} // Apply top radius, or full if no text
        />
      )}
      {(element.title || element.description) && (
        <div className="p-4">
          {element.title && (
            <h3 className="font-semibold mb-1" style={{ color: cardTextColor }}>
              {element.title}
            </h3>
          )}
          {element.description && (
            <p className="text-sm" style={{ color: cardTextColor, opacity: 0.85 }}>
              {element.description}
            </p>
          )}
        </div>
      )}
      {/* Show placeholder if totally empty */}
      {!element.thumbnailUrl && !element.title && !element.description && !isEditing && (
        <div className="p-4 text-center text-sm" style={{ color: cardTextColor, opacity: 0.6 }}>
          Empty Card - Click Edit
        </div>
      )}
    </>
  );

  return (
    <div className={`relative group mb-3 w-full ${element.layout === "double" ? "md:w-[calc(50%-0.5rem)]" : "w-full"}`}>
      {/* Add width classes based on layout for potential parent grid */}
      <button onClick={() => setIsEditing(!isEditing)} className="absolute top-1 right-1 p-1 text-gray-400 bg-white bg-opacity-70 rounded-full hover:text-gray-800 hover:bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Edit Card">
        <Edit2 size={16} />
      </button>

      {isEditing ? (
        <div className="p-3 border rounded bg-gray-100 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Edit Card</h4>
          <label className="text-xs font-medium text-gray-600 block">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card Title" className="w-full p-1 border rounded text-sm" />

          <label className="text-xs font-medium text-gray-600 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Card Description" className="w-full p-1 border rounded text-sm resize-none" rows={3} />

          <label className="text-xs font-medium text-gray-600 block">Thumbnail URL (Optional)</label>
          <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://image.url/thumb.jpg" className="w-full p-1 border rounded text-sm" />

          <label className="text-xs font-medium text-gray-600 block">Link URL (Optional - makes card clickable)</label>
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full p-1 border rounded text-sm" />

          {/* Layout option - maybe better in a different editor section? */}
          {/* <label className="text-xs font-medium text-gray-600 block">Layout</label>
            <select value={element.layout || 'single'} onChange={(e) => updateElement(element.id, { layout: e.target.value as 'single' | 'double' })} className="w-full p-1 border rounded text-sm bg-white">
                <option value="single">Single Column</option>
                <option value="double">Double Column</option>
            </select> */}

          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center">
            <Check size={16} className="mr-1" /> Save
          </button>
        </div>
      ) : (
        // Render as 'a' if URL exists, 'div' otherwise
        React.createElement(
          element.url ? "a" : "div",
          {
            href: element.url || undefined,
            target: element.url ? "_blank" : undefined,
            rel: element.url ? "noopener noreferrer" : undefined,
            className: `block overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow ${radiusClass}`,
            style: { backgroundColor: cardBgColor },
          },
          cardContent
        )
      )}
    </div>
  );
}
