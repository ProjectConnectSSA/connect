import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Share2, Edit2, Plus, Trash2, Facebook, Twitter, Instagram, Linkedin, Youtube, Twitch, Github, Mail } from "lucide-react"; // Add more icons as needed

interface SocialsElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

// Map platform names to icons (you can expand this)
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

export default function SocialsElement({ element, styles, updateElement, deleteElement }: SocialsElementProps) {
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  const getIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    return platformIcons[lowerPlatform] || platformIcons.default;
  };

  const handleDelete = () => {
    deleteElement(element.id);
  };

  return (
    <div className="my-6 relative group">
      <button onClick={() => setIsEditing(!isEditing)} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Edit Socials">
        <Edit2 size={16} />
      </button>

      <div className="flex justify-center space-x-4">
        {(element.socialLinks || []).map((link, index) => (
          <a
            key={index}
            href={link.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-75 transition-opacity"
            style={{ color: styles.textColor }} // Icons inherit text color
            aria-label={link.platform}
          >
            {getIcon(link.platform)}
          </a>
        ))}
        {(element.socialLinks || []).length === 0 && !isEditing && <p className="text-sm text-gray-500">Add social links</p>}
      </div>

      {isEditing && (
        <div className="mt-4 p-3 border rounded bg-gray-100 space-y-3">
          <h4 className="text-sm font-medium">Edit Social Links</h4>
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <select value={link.platform} onChange={(e) => handleUpdateLink(index, "platform", e.target.value)} className="p-1 border rounded text-sm bg-white w-24">
                {/* Add more platform options */}
                {Object.keys(platformIcons)
                  .filter((k) => k !== "default")
                  .map((p) => (
                    <option key={p} value={p} className="capitalize">
                      {p}
                    </option>
                  ))}
                <option value="other">Other</option>
              </select>
              <input type="url" value={link.url} onChange={(e) => handleUpdateLink(index, "url", e.target.value)} placeholder="https://..." className="flex-grow p-1 border rounded text-sm" />
              <button onClick={() => handleRemoveLink(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={handleAddLink} className="flex items-center text-sm text-blue-600 hover:underline">
            <Plus size={16} className="mr-1" /> Add Link
          </button>
          <button onClick={handleSave} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
            Save Links
          </button>
        </div>
      )}
    </div>
  );
}
