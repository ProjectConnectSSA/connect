import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Edit2, Check, Trash2, Link as LinkIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface LinkElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function LinkElement({ element, styles, updateElement, deleteElement }: LinkElementProps) {
  const [title, setTitle] = useState(element.title || "");
  const [url, setUrl] = useState(element.url || "");

  const handleSave = () => {
    updateElement(element.id, { title: title || "Link Title", url: url || "#" });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      deleteElement(element.id);
    }
  };

  const radiusClass = `rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`;
  const buttonBaseStyle = `w-full p-4 text-center transition duration-150 ease-in-out block ${radiusClass}`;
  const buttonFilledStyle = `${buttonBaseStyle} text-white`;
  const buttonOutlineStyle = `${buttonBaseStyle} border-2 bg-transparent`;

  return (
    <div className="relative group mb-3">
      {/* Hover controls: Edit and Delete */}
      <div className="absolute top-1 right-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition z-10">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              aria-label="Edit Link">
              <Edit2 size={16} />
            </button>
          </Dialog.Trigger>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-w-sm w-full p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-xl font-semibold mb-4">Edit Link</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`title-${element.id}`}
                  className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id={`title-${element.id}`}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Link Title"
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor={`url-${element.id}`}
                  className="block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  id={`url-${element.id}`}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Cancel</button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                  Save
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <button
          onClick={handleDelete}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          aria-label="Delete Link">
          <Trash2 size={16} />
        </button>
      </div>

      <a
        href={element.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.buttonStyle === "filled" ? buttonFilledStyle : buttonOutlineStyle}
        style={
          styles.buttonStyle === "filled"
            ? { backgroundColor: styles.buttonColor, color: styles.buttonTextColor }
            : { borderColor: styles.buttonColor, color: styles.buttonColor }
        }>
        <span className="font-medium">{element.title || "Link Title"}</span>
      </a>
    </div>
  );
}
