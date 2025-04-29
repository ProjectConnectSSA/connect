import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2 } from "lucide-react";

interface HeaderElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop to know if it's inside a layout column
}

const DEFAULT_HEADER_TEXT = "Header Text";

export default function HeaderElement({
  element,
  styles,
  updateElement,
  deleteElement,
  isNested = false, // Default to false if not provided
}: HeaderElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Use element title or default, ensuring it's always a string
  const [editedTitle, setEditedTitle] = useState(element.title || DEFAULT_HEADER_TEXT);

  // Sync local state with prop when element title changes externally or modal opens
  useEffect(() => {
    setEditedTitle(element.title || DEFAULT_HEADER_TEXT);
  }, [element.title]); // Sync only when the element.title prop changes

  // Reset specifically when modal opens to avoid stale data if prop changed while closed
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(element.title || DEFAULT_HEADER_TEXT);
    }
  }, [isModalOpen, element.title]);

  const handleSave = () => {
    // Use default text if trimmed input is empty
    const finalTitle = editedTitle.trim() || DEFAULT_HEADER_TEXT;
    // Only call update if the title actually changed
    if (finalTitle !== (element.title || DEFAULT_HEADER_TEXT)) {
      updateElement(element.id, { title: finalTitle });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Optionally reset local state on cancel, though useEffect handles it on reopen
    // setEditedTitle(element.title || DEFAULT_HEADER_TEXT);
  };

  // Handle Enter/Escape in the input field
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  const handleDelete = () => {
    // Optionally show a confirmation dialog here before deleting
    deleteElement(element.id);
    setIsModalOpen(false); // Close modal if open during delete action
  };

  // Determine text alignment (default to center, but could be configurable later)
  const textAlign = "text-center"; // Could be dynamic: element.alignment || 'center'

  return (
    // Use padding for spacing instead of margin for better group-hover behavior
    // Add min-height to prevent collapse when empty
    <div className={`relative group p-2 ${isNested ? "py-1" : "py-4"} flex items-center justify-center gap-2 min-h-[40px]`}>
      {/* Header Preview - ensure it handles word breaks */}
      <h2
        className={`text-xl font-semibold ${textAlign} break-words w-full`} // Use w-full for better centering control
        style={{ color: styles.textColor }}
      >
        {element.title || DEFAULT_HEADER_TEXT}
      </h2>

      {/* Controls: Edit and Delete - Visible on hover */}
      {/* Placed absolutely, consider alternative positioning if needed */}
      <div className="absolute top-1 right-1 md:top-1/2 md:-translate-y-1/2 md:right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Header">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content
              className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow"
              onEscapeKeyDown={handleCancel}
              // Prevent closing modal when clicking inside content but outside interactive elements
              onPointerDownOutside={(e) => e.preventDefault()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Header Text</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="mb-6">
                <label htmlFor="header-title-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Header Text
                </label>
                <input id="header-title-input" type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder={DEFAULT_HEADER_TEXT} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" autoFocus />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button
                    onClick={handleCancel}
                    type="button" // Explicit type
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button" // Explicit type
                  className="px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition"
                >
                  <Check size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        {/* Consider hiding delete if isNested and deleting should only happen via layout container */}
        {/* {!isNested && ( */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Header">
          <Trash2 size={16} />
        </button>
        {/* )} */}
      </div>
    </div>
  );
}
