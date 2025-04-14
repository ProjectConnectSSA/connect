import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, X, Check } from "lucide-react";

interface HeaderElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function HeaderElement({ element, styles, updateElement, deleteElement }: HeaderElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title || "");

  // Reset local input state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(element.title || "");
    }
  }, [isModalOpen, element.title]);

  const handleSave = () => {
    const finalTitle = editedTitle.trim() || "Header Text"; // Default text and trim
    updateElement(element.id, { title: finalTitle });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  return (
    <div className="relative my-4 flex items-center justify-center gap-2 px-4">
      {/* Header Preview with Centered Text */}
      <h2 className="text-xl font-semibold text-center flex-shrink min-w-0" style={{ color: styles.textColor }}>
        <span className="break-words">{element.title || "Header Text"}</span>
      </h2>

      {/* Edit Button - Right Justified */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Trigger asChild>
          <button className="absolute right-4 p-1.5 text-black rounded-full opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" aria-label="Edit Header">
            <Edit2 size={18} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl p-6 md:p-8 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold text-gray-800">Edit Header Text</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 transition-colors duration-150 ease-in-out" aria-label="Close" onClick={handleCancel}>
                  <X size={22} />
                </button>
              </Dialog.Close>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter header text" className="w-full p-3 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-150 ease-in-out" autoFocus />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button onClick={handleCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400 transition-colors duration-150 ease-in-out">
                  Cancel
                </button>
              </Dialog.Close>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white flex items-center bg-green-500 hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400 transition-colors duration-150 ease-in-out">
                <Check size={18} className="mr-1.5" />
                Save Changes
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
