import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, X, Check, Trash2 } from "lucide-react";

interface ShopifyElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function ShopifyElement({ element, styles, updateElement, deleteElement }: ShopifyElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title || "");
  const [editedUrl, setEditedUrl] = useState(element.url || "");

  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(element.title || "");
      setEditedUrl(element.url || "");
    }
  }, [isModalOpen, element]);

  const handleSave = () => {
    updateElement(element.id, {
      title: editedTitle.trim() || "Shopify Product",
      url: editedUrl.trim(),
    });
    setIsModalOpen(false);
  };

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.pathname.includes("/products/")) return "";
      return `${urlObj.origin}${urlObj.pathname}?view=embed`;
    } catch {
      return "";
    }
  };

  const embedUrl = getEmbedUrl(element.url || "");

  return (
    <div className="relative group my-4 p-4 rounded border shadow bg-white">
      <h3 className="font-semibold text-lg mb-3 text-center" style={{ color: styles.textColor }}>
        {element.title || "Shopify Product"}
      </h3>

      {embedUrl ? <iframe src={embedUrl} width="100%" height="600" frameBorder="0" allow="fullscreen" /> : <p className="text-center text-sm text-gray-500 italic">Invalid Shopify product URL</p>}

      {/* Controls */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
              <Edit2 size={18} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-semibold">Edit Shopify Product</Dialog.Title>
                <Dialog.Close asChild>
                  <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100">
                    <X size={22} />
                  </button>
                </Dialog.Close>
              </div>

              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Product Title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
                <input type="url" placeholder="https://yourstore.myshopify.com/products/..." value={editedUrl} onChange={(e) => setEditedUrl(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
              </div>

              <div className="flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded bg-red-500 text-white">Cancel</button>
                </Dialog.Close>
                <button onClick={handleSave} className="px-4 py-2 rounded bg-green-500 text-white flex items-center">
                  <Check size={18} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <button onClick={() => deleteElement(element.id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
