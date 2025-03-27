// src/components/link-editor.tsx (Update this component)
import React from "react";
import {
  Link,
  CreditCard,
  MousePointer,
  User,
  Share2,
  Heading1,
  Image as ImageIcon, // Alias because Image is a common name
} from "lucide-react";
import { BioElementType } from "@/app/types/links/types"; // Adjust path if needed

interface LinkEditorProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => void;
}

interface ElementItemProps {
  type: BioElementType;
  label: string;
  icon: React.ReactNode;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => void;
}

const ElementItem: React.FC<ElementItemProps> = ({ type, label, icon, onDragStart }) => (
  <div
    className="flex items-center p-3 mb-2 bg-gray-100 rounded-lg cursor-move hover:bg-blue-100 hover:shadow transition duration-150 ease-in-out border border-gray-200"
    draggable
    onDragStart={(e) => onDragStart(e, type)}>
    <div className="mr-3 text-blue-500">{icon}</div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

export default function LinkEditor({ onDragStart }: LinkEditorProps) {
  return (
    <div className="p-4 border-r bg-gray-50 h-full overflow-y-auto w-64 flex-shrink-0">
      {" "}
      {/* Fixed width */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Elements</h2>
      <ElementItem
        type="profile"
        label="Profile Header"
        icon={<User size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="socials"
        label="Social Icons"
        icon={<Share2 size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="link"
        label="Link"
        icon={<Link size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="card"
        label="Card"
        icon={<CreditCard size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="button"
        label="Button"
        icon={<MousePointer size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="header"
        label="Header Text"
        icon={<Heading1 size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        type="image"
        label="Image"
        icon={<ImageIcon size={20} />}
        onDragStart={onDragStart}
      />
      {/* Add more elements here */}
    </div>
  );
}
