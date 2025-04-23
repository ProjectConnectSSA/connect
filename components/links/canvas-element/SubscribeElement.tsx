// File: src/components/links/canvas-element/SubscribeElement.tsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, Mail } from "lucide-react"; // Added Mail icon

interface SubscribeElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_TAG = ""; // Default campaign tag is empty

export default function SubscribeElement({ element, styles, updateElement, deleteElement, isNested = false }: SubscribeElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current value safely
  const currentTag = element.campaignTag || DEFAULT_TAG;

  // State for editing within the modal
  const [editedTag, setEditedTag] = useState(currentTag);

  // Reset modal state on open
  useEffect(() => {
    if (isModalOpen) {
      setEditedTag(currentTag);
    }
  }, [isModalOpen, currentTag]);

  const handleSave = () => {
    const finalTag = editedTag.trim();
    // Only update if changed
    if (finalTag !== currentTag) {
      // Save empty string if cleared, or the trimmed tag
      updateElement(element.id, { campaignTag: finalTag || undefined }); // Store null if empty? Or empty string? Let's use empty string.
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
  const cardBgColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)";
  const inputBorderColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
  const inputTextColor = styles.textColor;
  const inputPlaceholderColor = styles.theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)";

  const buttonBaseStyle = `w-full p-3 text-center font-medium transition duration-150 ease-in-out ${radiusClass} cursor-not-allowed opacity-70`; // Disabled style
  const buttonFilledStyle = `${buttonBaseStyle}`; // No hover needed for disabled
  const buttonOutlineStyle = `${buttonBaseStyle} border-2 bg-transparent`; // No hover needed

  const filledStyleProps = {
    backgroundColor: styles.buttonColor,
    color: styles.buttonTextColor,
  };

  const outlineStyleProps = {
    borderColor: styles.buttonColor,
    color: styles.buttonColor,
    // No hover/active styles needed for disabled preview
  };

  return (
    <div className={`relative group my-3 ${isNested ? "p-2" : "p-4"} border border-gray-200/60 dark:border-gray-700/60 shadow-sm ${radiusClass}`} style={{ backgroundColor: cardBgColor }}>
      {/* Static Subscribe Preview */}
      <div className="space-y-2">
        <input
          type="email"
          placeholder="Enter your email"
          disabled
          className={`w-full p-3 border ${radiusClass} bg-transparent focus:outline-none cursor-not-allowed placeholder-opacity-50`}
          style={
            {
              borderColor: inputBorderColor,
              color: inputTextColor,
              "--placeholder-color": inputPlaceholderColor, // Use CSS var for placeholder if possible, or style directly
            } as React.CSSProperties
          }
          // Inline style for placeholder as direct prop isn't standard
          // Note: Cross-browser placeholder styling can be tricky. Tailwind's placeholder utilities are better if applicable.
        />
        <button disabled className={styles.buttonStyle === "filled" ? buttonFilledStyle : buttonOutlineStyle} style={styles.buttonStyle === "filled" ? filledStyleProps : outlineStyleProps}>
          Subscribe
        </button>
      </div>
      {/* Optional: Display tag subtly for admin */}
      {currentTag && <p className="text-xs text-center mt-2 text-gray-400 dark:text-gray-500">(Tag: {currentTag})</p>}

      {/* Edit/Delete Controls */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50" aria-label="Edit Subscribe Settings">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-sm transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Subscribe Settings</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6">
                {/* Campaign Tag Input */}
                <div>
                  <label htmlFor={`subscribe-tag-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Campaign Tag (Optional)
                  </label>
                  <input id={`subscribe-tag-${element.id}`} type="text" value={editedTag} onChange={(e) => setEditedTag(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., 'newsletter_popup'" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" autoFocus />
                  <p className="text-xs text-gray-500 mt-1.5">This tag can help track where subscriptions come from (integration needed).</p>
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
                  Save Tag
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Element Button */}
        <button onClick={handleDelete} className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50" aria-label="Delete Subscribe Block">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
