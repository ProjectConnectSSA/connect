import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import {
  Edit2,
  X,
  Check,
  Trash2,
  Plus,
  Link as LinkIcon,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Github,
  Mail,
  Award, // Added Tiktok
  Globe,
  AlertCircle, // Added Globe for 'other'
} from "lucide-react";
import { toast } from "sonner";

// Map platform names to icons (expand as needed)
// Using lowercase keys for easier matching
const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook size={24} />,
  twitter: <Twitter size={24} />,
  instagram: <Instagram size={24} />,
  linkedin: <Linkedin size={24} />,
  youtube: <Youtube size={24} />,
  twitch: <Twitch size={24} />,
  github: <Github size={24} />,
  tiktok: <Award size={24} />, // Added Tiktok
  email: <Mail size={24} />,
  other: <Globe size={24} />, // Icon for 'other'
  default: <Share2 size={24} />, // Fallback
};

// List of platforms for the dropdown, excluding 'default'
const availablePlatforms = Object.keys(platformIcons).filter((k) => k !== "default");

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialsElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  isNested?: boolean; // Added prop
}

// Basic URL validation (can be enhanced)
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  // Basic check for email format
  if (url.startsWith("mailto:")) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url.substring(7));
  }
  // Basic check for common URL protocols
  return /^(https?:\/\/|www\.)/.test(url);
};

export default function SocialsElement({ element, styles, updateElement, deleteElement, isNested = false }: SocialsElementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive current links safely
  const currentLinks = element.socialLinks || [];

  // State for editing within the modal
  const [editedLinks, setEditedLinks] = useState<SocialLink[]>(currentLinks);
  const [linkErrors, setLinkErrors] = useState<Record<number, string | null>>({}); // Store URL errors by index

  // Reset modal state on open
  useEffect(() => {
    if (isModalOpen) {
      // Create a deep copy to avoid mutating the original prop state indirectly
      setEditedLinks(JSON.parse(JSON.stringify(currentLinks)));
      setLinkErrors({}); // Clear errors
    }
  }, [isModalOpen, currentLinks]);

  const validateLinkUrl = (index: number, url: string, platform: string): boolean => {
    let error: string | null = null;
    if (!url) {
      error = "URL is required.";
    } else if (platform === "email" && !url.startsWith("mailto:")) {
      error = "Email URL must start with 'mailto:'.";
    } else if (platform === "email" && !isValidUrl(url)) {
      error = "Invalid email address format.";
    } else if (platform !== "email" && !isValidUrl(url)) {
      error = "Invalid URL format (e.g., https://...).";
    }

    setLinkErrors((prev) => ({ ...prev, [index]: error }));
    return error === null;
  };

  const handleAddLink = () => {
    const newLink = { platform: "other", url: "" };
    const newLinks = [...editedLinks, newLink];
    setEditedLinks(newLinks);
    // Validate the new empty link immediately (it will show an error)
    validateLinkUrl(newLinks.length - 1, "", "other");
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = editedLinks.filter((_, i) => i !== index);
    setEditedLinks(newLinks);
    // Remove error associated with the deleted index
    setLinkErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      // Potentially shift subsequent error indices (optional, might be complex)
      return newErrors;
    });
  };

  const handleUpdateLink = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = editedLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link));
    setEditedLinks(newLinks);

    // Re-validate URL when platform or URL changes
    if (field === "url") {
      validateLinkUrl(index, value, newLinks[index].platform);
    } else if (field === "platform") {
      validateLinkUrl(index, newLinks[index].url, value);
    }
  };

  const handleSave = () => {
    // Final validation check on all links before saving
    let allValid = true;
    editedLinks.forEach((link, index) => {
      if (!validateLinkUrl(index, link.url, link.platform)) {
        allValid = false;
      }
    });

    if (!allValid) {
      toast.error("Please fix the errors in the links before saving.");
      return;
    }

    // Filter out any links that might still be completely empty (e.g., added but never filled)
    const finalLinks = editedLinks.filter((link) => link.platform && link.url);

    // Check if the final array is different from the initial one
    // Simple JSON stringify comparison works for this structure
    if (JSON.stringify(finalLinks) !== JSON.stringify(currentLinks)) {
      updateElement(element.id, { socialLinks: finalLinks });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => setIsModalOpen(false);
  const handleDeleteElement = () => deleteElement(element.id); // Renamed to avoid conflict

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.key === "Escape") {
      handleCancel();
    }
    // Enter key could potentially trigger save, but might be annoying in this multi-input form
  };

  const getIcon = (platform: string) => {
    const lowerPlatform = platform?.toLowerCase() || "default";
    return platformIcons[lowerPlatform] || platformIcons.default;
  };

  // Render only links with valid URLs
  const validLinksToRender = currentLinks.filter((link) => isValidUrl(link.url));

  // Check if there are any invalid links in the current state for the save button
  const hasErrors = Object.values(linkErrors).some((error) => error !== null);

  return (
    <div className={`relative group ${isNested ? "my-3" : "my-6"} ${isNested ? "px-0" : "px-4"}`}>
      <div className="flex justify-center items-center space-x-4 flex-wrap gap-y-2">
        {validLinksToRender.length > 0 ? (
          validLinksToRender.map((link, index) => (
            <a
              key={`${element.id}-social-${index}`} // More specific key
              href={link.url} // Already validated
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:opacity-75 transition-opacity duration-150 ease-in-out"
              style={{ color: styles.textColor }} // Use theme text color for icons
              aria-label={`Visit our ${link.platform} page`}
            >
              {getIcon(link.platform)}
            </a>
          ))
        ) : (
          // Placeholder shown if no *valid* links exist
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 opacity-70 w-full">Add your social links here.</p>
        )}
      </div>

      {/* Hover controls: Edit and Delete buttons */}
      <div className="absolute -top-1 right-0 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
        {/* Edit Button & Dialog */}
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger asChild>
            <button className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50" aria-label="Edit Social Links">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 data-[state=open]:animate-overlayShow" />
            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl p-6 focus:outline-none data-[state=open]:animate-contentShow" onEscapeKeyDown={handleCancel} onPointerDownOutside={(e) => e.preventDefault()}>
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <Dialog.Title className="text-lg font-medium text-gray-900">Edit Social Links</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400" aria-label="Close" onClick={handleCancel}>
                    <X size={20} />
                  </button>
                </Dialog.Close>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-3 -mr-1">
                {editedLinks.map((link, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50/50">
                    <div className="flex items-center space-x-2 mb-2">
                      {/* Platform Select */}
                      <div className="flex-shrink-0 w-32">
                        <label htmlFor={`platform-${element.id}-${index}`} className="sr-only">
                          Platform
                        </label>
                        <select id={`platform-${element.id}-${index}`} value={link.platform} onChange={(e) => handleUpdateLink(index, "platform", e.target.value)} onKeyDown={handleKeyDown} className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                          {availablePlatforms.map((p) => (
                            <option key={p} value={p} className="capitalize">
                              {p.charAt(0).toUpperCase() + p.slice(1)} {/* Capitalize */}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* URL Input */}
                      <div className="flex-grow">
                        <label htmlFor={`url-${element.id}-${index}`} className="sr-only">
                          URL
                        </label>
                        <input
                          id={`url-${element.id}-${index}`}
                          type={link.platform === "email" ? "email" : "url"} // Use email type for basic validation hint
                          value={link.url}
                          onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={link.platform === "email" ? "your@email.com" : "https://..."}
                          className={`w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${linkErrors[index] ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                          aria-invalid={!!linkErrors[index]}
                          aria-describedby={linkErrors[index] ? `social-url-error-${index}` : undefined}
                        />
                      </div>
                      {/* Remove Button */}
                      <button onClick={() => handleRemoveLink(index)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition" aria-label={`Remove ${link.platform} link`} type="button">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {/* Error Message */}
                    {linkErrors[index] && (
                      <p id={`social-url-error-${index}`} className="text-xs text-red-600 mt-1 flex items-center pl-1">
                        <AlertCircle size={14} className="mr-1 flex-shrink-0" /> {linkErrors[index]}
                      </p>
                    )}
                  </div>
                ))}
                {/* Add Link Button */}
                <button onClick={handleAddLink} type="button" className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition">
                  <Plus size={16} className="mr-1.5" />
                  Add Social Link
                </button>
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
                  disabled={hasErrors} // Disable if any link has error
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Check size={16} className="mr-1" />
                  Save Links
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Element Button */}
        <button onClick={handleDeleteElement} className="p-1.5 bg-black/40 text-white rounded-md hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-black/50" aria-label="Delete Social Links Block">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
