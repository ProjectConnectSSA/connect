import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check, Trash2, Image as ImageIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface CardElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function CardElement({ element, styles, updateElement, deleteElement }: CardElementProps) {
  // States for dialog editing
  const [editedTitle, setEditedTitle] = useState(element.title || "");
  const [editedDescription, setEditedDescription] = useState(element.description || "");
  const [editedThumbnailUrl, setEditedThumbnailUrl] = useState(element.thumbnailUrl || "");
  const [editedUrl, setEditedUrl] = useState(element.url || "");

  const handleSave = () => {
    updateElement(element.id, {
      title: editedTitle || "Card Title",
      description: editedDescription,
      thumbnailUrl: editedThumbnailUrl,
      url: editedUrl,
    });
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  // Define subtle card background based on theme
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
  const cardTextColor = styles.textColor;

  const cardContent = (
    <>
      {element.thumbnailUrl && (
        <img
          src={element.thumbnailUrl}
          alt={element.title || "Card thumbnail"}
          className={`w-full h-32 object-cover ${radiusClass.replace("rounded-", "rounded-t-")} ${
            !element.title && !element.description ? radiusClass : ""
          }`}
        />
      )}
      {(element.title || element.description) && (
        <div className="p-4">
          {element.title && (
            <h3
              className="font-semibold mb-1"
              style={{ color: cardTextColor }}>
              {element.title}
            </h3>
          )}
          {element.description && (
            <p
              className="text-sm"
              style={{ color: cardTextColor, opacity: 0.85 }}>
              {element.description}
            </p>
          )}
        </div>
      )}
      {!element.thumbnailUrl && !element.title && !element.description && (
        <div
          className="p-4 text-center text-sm"
          style={{ color: cardTextColor, opacity: 0.6 }}>
          Empty Card - Click Edit
        </div>
      )}
    </>
  );

  return (
    <div className={`relative group mb-3 w-full ${element.layout === "double" ? "md:w-[calc(50%-0.5rem)]" : "w-full"}`}>
      {/* Controls: Edit and Delete visible on hover */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              aria-label="Edit Card">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-lg w-full p-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-semibold mb-4">Edit Card</Dialog.Title>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor={`card-title-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id={`card-title-${element.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Card Title"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`card-description-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id={`card-description-${element.id}`}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Card Description"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label
                    htmlFor={`card-thumbnail-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Thumbnail URL (Optional)
                  </label>
                  <input
                    id={`card-thumbnail-${element.id}`}
                    type="url"
                    value={editedThumbnailUrl}
                    onChange={(e) => setEditedThumbnailUrl(e.target.value)}
                    placeholder="https://image.url/thumb.jpg"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`card-link-${element.id}`}
                    className="block text-sm font-medium text-gray-700">
                    Link URL (Optional)
                  </label>
                  <input
                    id={`card-link-${element.id}`}
                    type="url"
                    value={editedUrl}
                    onChange={(e) => setEditedUrl(e.target.value)}
                    placeholder="https://example.com"
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
                    onClick={handleSave}
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
          onClick={handleDelete}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="Delete Card">
          <Trash2 size={16} />
        </button>
      </div>

      {element.url ? (
        <a
          href={element.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow ${radiusClass}`}
          style={{ backgroundColor: cardBgColor }}>
          {cardContent}
        </a>
      ) : (
        <div
          className={`block overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow ${radiusClass}`}
          style={{ backgroundColor: cardBgColor }}>
          {cardContent}
        </div>
      )}
    </div>
  );
}
