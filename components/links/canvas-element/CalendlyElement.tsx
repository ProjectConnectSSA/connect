import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, X, Check, Trash2 } from "lucide-react";

interface CalendlyElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function CalendlyElement({ element, styles, updateElement, deleteElement }: CalendlyElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title || "");
  const [editedUrl, setEditedUrl] = useState(element.url || "");

  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(element.title || "");
      setEditedUrl(element.url || "");
    }
  }, [isModalOpen, element.title, element.url]);

  const handleSave = () => {
    const trimmedTitle = editedTitle.trim() || "Book a Call";
    const trimmedUrl = editedUrl.trim() || "https://calendly.com/your-default-link";
    updateElement(element.id, { title: trimmedTitle, url: trimmedUrl });
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDelete = () => deleteElement(element.id);

  return (
    <div className="relative group my-4 p-4 rounded border shadow bg-white">
      {/* Title */}
      <h3 className="font-semibold text-lg mb-2 text-center" style={{ color: styles.textColor }}>
        {element.title || "Book a Call"}
      </h3>

      {/* Calendly Iframe */}
      <iframe src={element.url || "https://calendly.com/your-default-link"} width="100%" height="600" frameBorder="0" allow="fullscreen" style={{ borderRadius: "var(--border-radius-val)" }} />

      {/* Controls: Edit & Delete */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition" aria-label="Edit Calendly">
              <Edit2 size={18} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl p-6 md:p-8 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold text-gray-800">Edit Calendly Block</Dialog.Title>
                <Dialog.Close asChild>
                  <button onClick={handleCancel} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
                    <X size={22} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="mb-4 space-y-4">
                <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} placeholder="Enter title" className="w-full p-3 border border-gray-300 rounded-lg text-base" />
                <input type="url" value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} placeholder="https://calendly.com/your-link" className="w-full p-3 border border-gray-300 rounded-lg text-base" />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600">
                    Cancel
                  </button>
                </Dialog.Close>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white flex items-center bg-green-500 hover:bg-green-600">
                  <Check size={18} className="mr-1.5" />
                  Save Changes
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <button onClick={handleDelete} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition" aria-label="Delete Calendly">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
