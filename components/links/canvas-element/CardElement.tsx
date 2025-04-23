import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, Image as ImageIcon, Link as LinkIcon } from "lucide-react"; // Added LinkIcon

interface CardElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_CARD_TITLE = "Card Title";
const DEFAULT_CARD_DESCRIPTION = "Add a description here...";

export default function CardElement({ element, styles, updateElement, deleteElement, isNested = false }: CardElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely
  const currentTitle = element.title || "";
  const currentDescription = element.description || "";
  const currentThumbnailUrl = element.thumbnailUrl || "";
  const currentUrl = element.url || "";

  // States for dialog editing, initialized based on current values
  const [editedTitle, setEditedTitle] = useState(currentTitle);
  const [editedDescription, setEditedDescription] = useState(currentDescription);
  const [editedThumbnailUrl, setEditedThumbnailUrl] = useState(currentThumbnailUrl);
  const [editedUrl, setEditedUrl] = useState(currentUrl);

  // Reset local state when modal opens to reflect latest element props
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(currentTitle);
      setEditedDescription(currentDescription);
      setEditedThumbnailUrl(currentThumbnailUrl);
      setEditedUrl(currentUrl);
    }
  }, [isModalOpen, currentTitle, currentDescription, currentThumbnailUrl, currentUrl]);

  const handleSave = () => {
    const finalTitle = editedTitle.trim();
    const finalDescription = editedDescription.trim();
    const finalThumbnailUrl = editedThumbnailUrl.trim();
    const finalUrl = editedUrl.trim();

    // Check if anything actually changed
    const hasChanged = finalTitle !== currentTitle || finalDescription !== currentDescription || finalThumbnailUrl !== currentThumbnailUrl || finalUrl !== currentUrl;

    if (hasChanged) {
      updateElement(element.id, {
        // Use defaults only if saving results in empty required fields (like title if needed)
        // For now, allow empty fields to be saved if user clears them
        title: finalTitle, // Use empty string if cleared, or DEFAULT_CARD_TITLE if that's desired behavior
        description: finalDescription,
        thumbnailUrl: finalThumbnailUrl,
        url: finalUrl,
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // State is reset via useEffect on next open
  };

  const handleDelete = () => {
    deleteElement(element.id);
    setIsModalOpen(false); // Close modal if open
  };

  // Handle Enter/Escape in the input fields
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Allow Enter in textarea unless Ctrl/Meta is pressed
    if (event.key === "Enter" && !(event.target instanceof HTMLTextAreaElement && !event.metaKey && !event.ctrlKey)) {
      event.preventDefault(); // Prevent default form submission if wrapped
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  // --- Styling & Rendering ---
  const radiusClass = styles.borderRadius === "none" ? "rounded-none" : `rounded-${styles.borderRadius}`;
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)"; // Slightly adjusted background
  const cardTextColor = styles.textColor;
  const hasContent = !!currentTitle || !!currentDescription || !!currentThumbnailUrl;
  const hasTextContent = !!currentTitle || !!currentDescription;

  // Determine image rounding based on text content below it
  const imageRadiusClass = hasTextContent ? radiusClass.replace("rounded-", "rounded-t-") : radiusClass;

  const CardInnerContent = (
    <>
      {currentThumbnailUrl ? (
        <img
          src={currentThumbnailUrl}
          alt={currentTitle || "Card image"}
          className={`w-full h-36 object-cover ${imageRadiusClass} bg-gray-200`} // Added bg-gray-200 as fallback
          onError={(e) => (e.currentTarget.style.display = "none")} // Hide if image fails to load
        />
      ) : (
        hasTextContent && ( // Show placeholder only if there's text but no image
          <div className={`w-full h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${imageRadiusClass}`}>
            <ImageIcon size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
        )
      )}
      {hasTextContent && (
        <div className="p-4">
          {currentTitle && (
            <h3
              className="font-semibold mb-1 text-base break-words" // Use text-base for card title
              style={{ color: cardTextColor }}
            >
              {currentTitle}
            </h3>
          )}
          {currentDescription && (
            <p className="text-sm break-words" style={{ color: cardTextColor, opacity: 0.85 }}>
              {currentDescription}
            </p>
          )}
        </div>
      )}
      {!hasContent && ( // Placeholder for completely empty card
        <div className={`p-6 text-center text-sm flex flex-col items-center justify-center h-32 ${radiusClass}`} style={{ color: cardTextColor, opacity: 0.6 }}>
          <ImageIcon size={24} className="mb-2" />
          Empty Card
          <span className="text-xs block mt-1">(Click edit icon)</span>
        </div>
      )}
    </>
  );

  // Use an anchor tag if URL exists, otherwise use a div
  const CardWrapper = currentUrl ? "a" : "div";
  const wrapperProps = currentUrl ? { href: currentUrl, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    // Removed layout class - parent handles width/layout
    <div className="relative group mb-3 w-full">
      {/* Controls: Edit and Delete visible on hover */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Card">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Card</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                {/* Title */}
                <div>
                  <label htmlFor={`card-title-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title
                  </label>
                  <input
                    id={`card-title-${element.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={DEFAULT_CARD_TITLE}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    autoFocus // Autofocus on the first field
                  />
                </div>
                {/* Description */}
                <div>
                  <label htmlFor={`card-description-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea id={`card-description-${element.id}`} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} onKeyDown={handleKeyDown} placeholder={DEFAULT_CARD_DESCRIPTION} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" rows={3} />
                </div>
                {/* Thumbnail URL */}
                <div>
                  <label htmlFor={`card-thumbnail-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thumbnail URL (Optional)
                  </label>
                  <input id={`card-thumbnail-${element.id}`} type="url" value={editedThumbnailUrl} onChange={(e) => setEditedThumbnailUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="https://image.url/thumb.jpg" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
                {/* Link URL */}
                <div>
                  <label htmlFor={`card-link-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Link URL (Optional) <span className="text-xs text-gray-500">(Makes card clickable)</span>
                  </label>
                  <input id={`card-link-${element.id}`} type="url" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} onKeyDown={handleKeyDown} placeholder="https://example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} type="button" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button onClick={handleSave} type="button" className="px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition">
                  <Check size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Card">
          <Trash2 size={16} />
        </button>
      </div>

      {/* Card Display */}
      <CardWrapper
        {...wrapperProps}
        className={`block overflow-hidden border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-md transition-shadow ${radiusClass}`}
        style={{ backgroundColor: cardBgColor }}
        aria-label={currentTitle || "Card element"} // Add aria-label
      >
        {CardInnerContent}
      </CardWrapper>
    </div>
  );
}
