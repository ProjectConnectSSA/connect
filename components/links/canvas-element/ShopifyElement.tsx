import React, { useState, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, Store, AlertCircle } from "lucide-react"; // Added icons

interface ShopifyElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_TITLE = "Shopify Product";
const DEFAULT_SHOPIFY_URL_EXAMPLE = "https://your-store.myshopify.com/products/your-product-handle";
// Regex to validate a typical Shopify product URL structure
const VALID_SHOPIFY_PRODUCT_URL_PATTERN = /^https:\/\/[a-zA-Z0-9-]+\.(myshopify\.com|shopify\.com)\/products\/[a-zA-Z0-9-]+(\?.*)?$/;

// Function to attempt extracting the embeddable part, assuming standard structure
// Note: Shopify embed views might change or require specific theme support. This is a basic approach.
const getPotentialEmbedUrl = (productUrl: string): string => {
  if (!productUrl || !VALID_SHOPIFY_PRODUCT_URL_PATTERN.test(productUrl)) {
    return "";
  }
  try {
    // Basic embed attempt - Shopify's official embed might require different methods (e.g., Buy Button SDK)
    // For a simple iframe, just showing the product page might be the most reliable fallback
    // Returning the original valid URL might be safer than assuming an embed view exists.
    // If Shopify provides a standard "?view=embed", uncomment the line below.
    // return `${productUrl.split('?')[0]}?view=embed`;
    return productUrl.split("?")[0]; // Return the base product URL
  } catch {
    return "";
  }
};

export default function ShopifyElement({ element, styles, updateElement, deleteElement, isNested = false }: ShopifyElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely
  const currentTitle = element.title || DEFAULT_TITLE;
  const currentUrl = element.url || "";
  const isValidCurrentUrl = VALID_SHOPIFY_PRODUCT_URL_PATTERN.test(currentUrl);
  // Memoize the embed URL calculation
  const embedUrl = useMemo(() => getPotentialEmbedUrl(currentUrl), [currentUrl]);

  // States for dialog editing
  const [editedTitle, setEditedTitle] = useState(currentTitle);
  const [editedUrl, setEditedUrl] = useState(currentUrl);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(currentTitle);
      setEditedUrl(currentUrl);
      setUrlError(null);
    }
  }, [isModalOpen, currentTitle, currentUrl]);

  const validateUrlInput = (urlToValidate: string): boolean => {
    if (!urlToValidate) {
      setUrlError("Shopify product URL is required.");
      return false;
    }
    if (!VALID_SHOPIFY_PRODUCT_URL_PATTERN.test(urlToValidate)) {
      setUrlError("Please enter a valid Shopify product URL.");
      return false;
    }
    setUrlError(null);
    return true;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setEditedUrl(newUrl);
    validateUrlInput(newUrl.trim()); // Validate on change
  };

  const handleSave = () => {
    const finalTitle = editedTitle.trim() || DEFAULT_TITLE;
    const finalUrl = editedUrl.trim();

    if (!validateUrlInput(finalUrl)) {
      return; // Don't save if URL is invalid
    }

    // Only update if changed
    if (finalTitle !== currentTitle || finalUrl !== currentUrl) {
      updateElement(element.id, { title: finalTitle, url: finalUrl });
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
  const cardTextColor = styles.textColor;

  return (
    <div className={`relative group my-3 ${isNested ? "p-2" : "p-4"} border border-gray-200/80 dark:border-gray-700/80 shadow-sm bg-white ${radiusClass}`} style={{ backgroundColor: cardBgColor }}>
      {/* Title */}
      <h3 className="font-medium text-base mb-3 text-center" style={{ color: cardTextColor }}>
        {currentTitle}
      </h3>

      {/* Embed or Placeholder */}
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={`${currentTitle} - Shopify Product`} // Descriptive title
          width="100%"
          height="550" // Adjust height as needed
          frameBorder="0"
          allow="fullscreen"
          className={`block ${radiusClass}`}
          style={{ minHeight: "400px" }} // Ensure a minimum height
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups" // Security sandbox
        />
      ) : (
        // Placeholder when URL is not set or invalid
        <div className={`flex flex-col items-center justify-center h-60 bg-gray-100/50 dark:bg-gray-800/30 rounded-md p-4 border border-dashed border-gray-300 dark:border-gray-600 ${radiusClass}`}>
          <Store className="text-gray-400 dark:text-gray-500 mb-2" size={30} />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">{currentUrl ? "Invalid Shopify Product URL" : "Add a Shopify Product URL"}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">Click the edit icon.</p>
        </div>
      )}

      {/* Edit/Delete Controls */}
      <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Shopify Product">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Shopify Product</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6">
                {/* Title */}
                <div>
                  <label htmlFor={`shopify-title-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Display Title (Optional)
                  </label>
                  <input id={`shopify-title-${element.id}`} type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder={DEFAULT_TITLE} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" autoFocus />
                </div>
                {/* URL */}
                <div>
                  <label htmlFor={`shopify-url-${element.id}`} className="block text-sm font-medium text-gray-700 mb-1.5">
                    Shopify Product URL*
                  </label>
                  <input id={`shopify-url-${element.id}`} type="url" value={editedUrl} onChange={handleUrlChange} onKeyDown={handleKeyDown} placeholder={DEFAULT_SHOPIFY_URL_EXAMPLE} className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition ${urlError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`} aria-required="true" aria-invalid={!!urlError} aria-describedby={urlError ? "shopify-url-error" : undefined} />
                  {urlError && (
                    <p id="shopify-url-error" className="text-xs text-red-600 mt-1.5 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {urlError}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} type="button" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button"
                  disabled={!!urlError} // Disable if URL error
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Check size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Shopify Product">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
