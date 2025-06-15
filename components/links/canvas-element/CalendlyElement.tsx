import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, AlertCircle } from "lucide-react"; // Added AlertCircle

interface CalendlyElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_TITLE = "Book a Call";
const DEFAULT_URL = "https://calendly.com/your-username/your-event"; // More specific example
const VALID_CALENDLY_PATTERN = /^https:\/\/calendly\.com\/[a-zA-Z0-9_-]+\/?([a-zA-Z0-9_-]+)?(\?.*)?$/;

export default function CalendlyElement({
  element,
  styles,
  updateElement,
  deleteElement,
  isNested = false, // Default to false
}: CalendlyElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(element.title || DEFAULT_TITLE);
  const [editedUrl, setEditedUrl] = useState(element.url || ""); // Start empty if not set
  const [urlError, setUrlError] = useState<string | null>(null);

  // Derive current values safely
  const currentTitle = element.title || DEFAULT_TITLE;
  const currentUrl = element.url || "";
  const isValidCurrentUrl = VALID_CALENDLY_PATTERN.test(currentUrl);

  // Sync local state with prop when element data changes externally
  useEffect(() => {
    setEditedTitle(currentTitle);
    setEditedUrl(currentUrl);
  }, [currentTitle, currentUrl]);

  // Reset specifically when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(currentTitle);
      setEditedUrl(currentUrl);
      setUrlError(null); // Clear error on open
    }
  }, [isModalOpen, currentTitle, currentUrl]);

  const validateUrl = (url: string): boolean => {
    if (!url) {
      setUrlError("Calendly URL is required.");
      return false;
    }
    if (!VALID_CALENDLY_PATTERN.test(url)) {
      setUrlError("Please enter a valid Calendly link (e.g., https://calendly.com/user/event).");
      return false;
    }
    setUrlError(null);
    return true;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setEditedUrl(newUrl);
    validateUrl(newUrl.trim()); // Validate on change
  };

  const handleSave = () => {
    const trimmedTitle = editedTitle.trim() || DEFAULT_TITLE;
    const trimmedUrl = editedUrl.trim();

    if (!validateUrl(trimmedUrl)) {
      return; // Don't save if URL is invalid
    }

    // Only update if something actually changed
    if (trimmedTitle !== currentTitle || trimmedUrl !== currentUrl) {
      updateElement(element.id, { title: trimmedTitle, url: trimmedUrl });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Resetting state is handled by useEffect on next open
  };

  const handleDelete = () => {
    deleteElement(element.id);
    setIsModalOpen(false); // Close modal if open
  };

  // Handle Enter/Escape in the input fields
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  return (
    // Container with padding and styles
    <div
      className={`relative group my-3 ${isNested ? "p-2" : "p-4"} rounded-lg border border-gray-200 shadow-sm bg-white transition-shadow hover:shadow-md`}
      style={{ borderRadius: "var(--border-radius-val)" }} // Apply global border radius if desired
    >
      {/* Title */}
      <h3 className="font-medium text-base mb-3 text-center" style={{ color: styles.textColor }}>
        {currentTitle}
      </h3>

      {/* Calendly Iframe or Placeholder */}
      {isValidCurrentUrl ? (
        <iframe
          src={currentUrl}
          title={`${currentTitle} - Calendly Scheduling`} // Add descriptive title
          width="100%"
          height="600" // Consider making height adjustable later
          frameBorder="0"
          allow="fullscreen"
          // Apply border radius via style if container doesn't clip content
          style={{ borderRadius: "var(--border-radius-val)", minHeight: "400px" }} // Ensure min height
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-60 bg-gray-100 rounded-md p-4 border border-dashed border-gray-300" style={{ borderRadius: "var(--border-radius-val)" }}>
          <AlertCircle className="text-red-500 mb-2" size={30} />
          <p className="text-sm text-red-600 font-medium text-center">Invalid or missing Calendly URL.</p>
          <p className="text-xs text-gray-500 mt-1 text-center">Click the edit icon to add your link.</p>
        </div>
      )}

      {/* Controls: Edit & Delete */}
      <div className="absolute top-1 right-1 md:top-2 md:right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1" aria-label="Edit Calendly Block">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Calendly Block</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="calendly-title-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title (Optional)
                  </label>
                  <input id="calendly-title-input" type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder={DEFAULT_TITLE} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
                <div>
                  <label htmlFor="calendly-url-input" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Calendly Link*
                  </label>
                  <input
                    id="calendly-url-input"
                    type="url" // Use type="url" for basic browser validation hint
                    value={editedUrl}
                    onChange={handleUrlChange}
                    onKeyDown={handleKeyDown}
                    placeholder={DEFAULT_URL}
                    className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition ${urlError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                    aria-required="true"
                    aria-invalid={!!urlError}
                    aria-describedby={urlError ? "calendly-url-error" : undefined}
                  />
                  {urlError && (
                    <p id="calendly-url-error" className="text-xs text-red-600 mt-1.5 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {urlError}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button onClick={handleCancel} type="button" className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button"
                  disabled={!!urlError} // Disable save if URL has error
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition ${!!urlError ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Check size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button onClick={handleDelete} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1" aria-label="Delete Calendly Block">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
