import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Edit2, X, Check, Trash2, Link as LinkIcon, AlertCircle } from "lucide-react"; // Added icons

interface LinkElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

const DEFAULT_TITLE = "Link Title";
const DEFAULT_URL = "#"; // Default placeholder URL

// Basic URL validation (can be made more robust)
const isValidUrl = (url: string): boolean => {
  if (!url || url === "#") return false; // Consider '#' invalid for saving
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default function LinkElement({ element, styles, updateElement, deleteElement, isNested = false }: LinkElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current values safely
  const currentTitle = element.title || DEFAULT_TITLE;
  const currentUrl = element.url || ""; // Use empty string internally if not set
  const isCurrentUrlValid = isValidUrl(currentUrl);

  // States for dialog editing
  const [editedTitle, setEditedTitle] = useState(currentTitle);
  const [editedUrl, setEditedUrl] = useState(currentUrl);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isModalOpen) {
      setEditedTitle(currentTitle);
      setEditedUrl(currentUrl);
      setUrlError(null); // Clear error on open
    }
  }, [isModalOpen, currentTitle, currentUrl]);

  const validateUrlInput = (urlToValidate: string): boolean => {
    if (!urlToValidate) {
      setUrlError("URL is required.");
      return false;
    }
    if (!isValidUrl(urlToValidate)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com).");
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
    const finalTitle = editedTitle.trim() || DEFAULT_TITLE; // Use default if empty
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
  const buttonBaseStyle = `w-full p-3 md:p-4 text-center transition duration-150 ease-in-out block relative group/link overflow-hidden ${radiusClass}`;
  const buttonFilledStyle = `${buttonBaseStyle} text-white hover:opacity-90 active:opacity-80`;
  const buttonOutlineStyle = `${buttonBaseStyle} border-2 bg-transparent hover:bg-opacity-10 active:bg-opacity-20`;

  const commonStyleProps = {
    fontFamily: styles.fontFamily || "inherit", // Apply font family
  };

  const filledStyleProps = {
    ...commonStyleProps,
    backgroundColor: styles.buttonColor,
    color: styles.buttonTextColor,
  };

  const outlineStyleProps = {
    ...commonStyleProps,
    borderColor: styles.buttonColor,
    color: styles.buttonColor,
    // Add hover background color derived from buttonColor with low opacity
    "--hover-bg-color": `${styles.buttonColor}1A`, // ~10% opacity hex
    "--active-bg-color": `${styles.buttonColor}33`, // ~20% opacity hex
  };

  return (
    // Main container: Uses flex to position link and controls side-by-side. Added 'group' for hover effects on controls.
    <div className={`group mb-3 ${isNested ? "px-0" : "px-2 md:px-4"} flex items-center gap-x-2 md:gap-x-3`}>
      {/* Link Display Button: Takes available space */}
      <a
        href={isCurrentUrlValid ? currentUrl : undefined} // Only set valid href
        target="_blank"
        rel="noopener noreferrer nofollow" // Added nofollow
        className={`${styles.buttonStyle === "filled" ? buttonFilledStyle : buttonOutlineStyle} ${
          !isCurrentUrlValid ? "opacity-70 cursor-not-allowed" : ""
        } flex-grow min-w-0`} // Added flex-grow and min-w-0
        style={styles.buttonStyle === "filled" ? filledStyleProps : outlineStyleProps}
        onMouseEnter={(e) => {
          if (styles.buttonStyle === "outline") (e.currentTarget as HTMLAnchorElement).style.backgroundColor = outlineStyleProps["--hover-bg-color"];
        }}
        onMouseLeave={(e) => {
          if (styles.buttonStyle === "outline") (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
        }}
        onMouseDown={(e) => {
          if (styles.buttonStyle === "outline") (e.currentTarget as HTMLAnchorElement).style.backgroundColor = outlineStyleProps["--active-bg-color"];
        }}
        onMouseUp={(e) => {
          // Return to hover state on mouse up if mouse is still over
          if (styles.buttonStyle === "outline" && e.currentTarget.matches(":hover")) {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = outlineStyleProps["--hover-bg-color"];
          } else if (styles.buttonStyle === "outline") {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
          }
        }}
        onClick={(e) => !isCurrentUrlValid && e.preventDefault()}
        aria-disabled={!isCurrentUrlValid}
        role="link">
        <span className="font-medium break-words">{currentTitle}</span>
        {!isCurrentUrlValid && (
          <span
            className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full opacity-80 group-hover/link:opacity-100"
            title="Invalid or missing URL">
            !
          </span>
        )}
      </a>

      {/* Edit/Delete Controls Container: Stacked vertically, appears on group hover */}
      <div className="flex flex-col space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 shrink-0">
        {/* Edit Button & Dialog */}
        <Dialog.Root
          open={isModalOpen}
          onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button
              className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-green-500 transition-colors"
              aria-label="Edit Link">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content
              className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow"
              onEscapeKeyDown={handleCancel}
              onPointerDownOutside={(e) => {
                // Allow Radix to handle closing, but prevent default if the click is outside content but inside a potential parent that might react.
                // For this specific case, it helps ensure the hover state of buttons doesn't flicker if mouse moves slightly during close.
                const target = e.target as HTMLElement;
                if (!target.closest("[data-radix-dialog-content]")) {
                  e.preventDefault();
                }
              }}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Link</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400"
                    aria-label="Close"
                    onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body */}
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor={`link-title-${element.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1.5">
                    Link Text*
                  </label>
                  <input
                    id={`link-title-${element.id}`}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={DEFAULT_TITLE}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    aria-required="true"
                    autoFocus
                  />
                </div>
                <div>
                  <label
                    htmlFor={`link-url-${element.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL*
                  </label>
                  <input
                    id={`link-url-${element.id}`}
                    type="url"
                    value={editedUrl}
                    onChange={handleUrlChange}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com"
                    className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      urlError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                    aria-required="true"
                    aria-invalid={!!urlError}
                    aria-describedby={urlError ? "link-url-error" : undefined}
                  />
                  {urlError && (
                    <p
                      id="link-url-error"
                      className="text-xs text-red-600 mt-1.5 flex items-center">
                      <AlertCircle
                        size={14}
                        className="mr-1"
                      />{" "}
                      {urlError}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Dialog.Close asChild>
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleSave}
                  type="button"
                  disabled={!!urlError || !editedTitle.trim()}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <Check
                    size={16}
                    className="mr-1"
                  />
                  Save
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-red-500 transition-colors"
          aria-label="Delete Link">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
