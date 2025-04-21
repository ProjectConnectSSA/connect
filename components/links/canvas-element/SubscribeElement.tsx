// File: src/components/links/canvas-element/SubscribeElement.tsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Edit2, X, Check, Trash2 } from "lucide-react";
import { BioElement, StyleProps } from "@/app/types/links/types";

interface SubscribeElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updated: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function SubscribeElement({ element, styles, updateElement, deleteElement }: SubscribeElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTag, setEditedTag] = useState(element.campaignTag || "");

  useEffect(() => {
    if (isModalOpen) {
      setEditedTag(element.campaignTag || "");
    }
  }, [isModalOpen, element.campaignTag]);

  const handleSave = () => {
    updateElement(element.id, { campaignTag: editedTag.trim() });
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDelete = () => deleteElement(element.id);

  return (
    <div className="relative group my-4 p-4 rounded border shadow bg-white text-center">
      {/* Static Subscribe Preview */}
      <input
        type="email"
        placeholder="Enter your email"
        disabled
        className="w-full mb-2 p-2 border rounded-opacity-50 cursor-not-allowed"
        style={{ borderColor: styles.buttonColor, color: styles.textColor }}
      />
      <button
        disabled
        className="w-full p-2 rounded cursor-not-allowed"
        style={{ backgroundColor: styles.buttonColor, color: styles.buttonTextColor, opacity: 0.6 }}>
        Subscribe
      </button>

      {/* Edit/Delete Controls */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        <Dialog.Root
          open={isModalOpen}
          onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              aria-label="Edit Subscribe">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-xs w-full bg-white rounded shadow p-4 transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-lg font-semibold mb-2">Edit Tag</Dialog.Title>
              <input
                type="text"
                value={editedTag}
                onChange={(e) => setEditedTag(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
                placeholder="Campaign Tag"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Dialog.Close asChild>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-300 rounded">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 text-white rounded flex items-center">
                  <Check
                    size={16}
                    className="mr-1"
                  />{" "}
                  Save
                </button>
              </div>
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          onClick={handleDelete}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
          aria-label="Delete Subscribe">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
