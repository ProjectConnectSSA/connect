import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Share2, Edit2, Plus, Trash2, Facebook, Twitter, Instagram, Linkedin, Youtube, Twitch, Github, Mail } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// Map platform names to icons (expand as needed)
const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook size={24} />,
  twitter: <Twitter size={24} />,
  instagram: <Instagram size={24} />,
  linkedin: <Linkedin size={24} />,
  youtube: <Youtube size={24} />,
  twitch: <Twitch size={24} />,
  github: <Github size={24} />,
  email: <Mail size={24} />,
  default: <Share2 size={24} />,
};

interface SocialsElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function SocialsElement({ element, styles, updateElement, deleteElement }: SocialsElementProps) {
  const [socialLinks, setSocialLinks] = useState(element.socialLinks || []);

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, { platform: "facebook", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleUpdateLink = (index: number, field: "platform" | "url", value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSocialLinks(updatedLinks);
  };

  const handleSave = () => {
    updateElement(element.id, { socialLinks });
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  const getIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    return platformIcons[lowerPlatform] || platformIcons.default;
  };

  return (
    <div className="my-6 relative group">
      <div className="flex justify-center space-x-4">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity"
              style={{ color: styles.textColor }}
              aria-label={link.platform}>
              {getIcon(link.platform)}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-500">Add social links</p>
        )}
      </div>
      {/* Hover controls: Edit and Delete buttons */}
      <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              aria-label="Edit Socials">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-xl font-semibold mb-4">Edit Social Links</Dialog.Title>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2">
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateLink(index, "platform", e.target.value)}
                      className="p-1 border rounded text-sm bg-white w-24">
                      {Object.keys(platformIcons)
                        .filter((k) => k !== "default")
                        .map((p) => (
                          <option
                            key={p}
                            value={p}
                            className="capitalize">
                            {p}
                          </option>
                        ))}
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(index, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-grow p-1 border rounded text-sm"
                    />
                    <button
                      onClick={() => handleRemoveLink(index)}
                      className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddLink}
                  className="flex items-center text-sm text-blue-600 hover:underline">
                  <Plus
                    size={16}
                    className="mr-1"
                  />{" "}
                  Add Link
                </button>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <Dialog.Close asChild>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    aria-label="Cancel">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    aria-label="Save">
                    Save Links
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          onClick={handleDelete}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="Delete Socials">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
