// src/components/link-editor.tsx (Updated)
import React from "react";
import {
  Link,
  CreditCard,
  MousePointer,
  User,
  Share2,
  Heading1,
  Image as ImageIcon,
  Clock,
  Mail, // Alias because Image is a common name
  RectangleHorizontal, // Icon for single column layout
  Columns, // Icon for two column layout
} from "lucide-react";
import { BioElementType } from "@/app/types/links/types"; // Adjust path if needed

interface LinkEditorProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType | string) => void; // Allow string for layout types initially, ideally add them to BioElementType
}

interface ElementItemProps {
  // Use string temporarily if layout types aren't in BioElementType yet
  // Ideally, add 'layout-single-column' | 'layout-two-columns' to BioElementType
  type: BioElementType | "layout-single-column" | "layout-two-columns";
  label: string;
  icon: React.ReactNode;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType | string) => void;
}

const ElementItem: React.FC<ElementItemProps> = ({ type, label, icon, onDragStart }) => (
  <div className="flex items-center p-3 mb-2 bg-gray-100 rounded-lg cursor-move hover:bg-blue-100 hover:shadow transition duration-150 ease-in-out border border-gray-200" draggable onDragStart={(e) => onDragStart(e, type)}>
    <div className="mr-3 text-blue-500">{icon}</div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

export default function LinkEditor({ onDragStart }: LinkEditorProps) {
  return (
    <div className="p-4 border-r bg-gray-50 h-full overflow-y-auto w-64 flex-shrink-0">
      {/* Elements Section */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add Elements</h2>
      <ElementItem type="profile" label="Profile Header" icon={<User size={20} />} onDragStart={onDragStart} />
      <ElementItem type="socials" label="Social Icons" icon={<Share2 size={20} />} onDragStart={onDragStart} />
      <ElementItem type="link" label="Link" icon={<Link size={20} />} onDragStart={onDragStart} />
      <ElementItem type="card" label="Card" icon={<CreditCard size={20} />} onDragStart={onDragStart} />
      <ElementItem type="header" label="Header Text" icon={<Heading1 size={20} />} onDragStart={onDragStart} />
      <ElementItem type="image" label="Image" icon={<ImageIcon size={20} />} onDragStart={onDragStart} />
      <ElementItem
        type="calendly"
        label="Calendly"
        icon={<MousePointer size={20} />} // or use any suitable icon
        onDragStart={onDragStart}
      />
      <ElementItem
        type="shopify"
        label="Shopify Product"
        icon={<CreditCard size={20} />} // or use any ecommerce icon
        onDragStart={onDragStart}
      />
      <ElementItem type="countdown" label="Countdown Timer" icon={<Clock size={20} />} onDragStart={onDragStart} />
      <ElementItem type="subscribe" label="Subscribe" icon={<Mail size={20} />} onDragStart={onDragStart} />
      {/* Add more elements here */}

      {/* Layouts Section - Added */}
      <h2 className="text-lg font-semibold mt-6 mb-4 text-gray-800">Layouts</h2>
      <ElementItem
        // NOTE: Add 'layout-single-column' to your BioElementType enum
        type="layout-single-column"
        label="Single Column Row"
        icon={<RectangleHorizontal size={20} />}
        onDragStart={onDragStart}
      />
      <ElementItem
        // NOTE: Add 'layout-two-columns' to your BioElementType enum
        type="layout-two-columns"
        label="Two Column Row"
        icon={<Columns size={20} />}
        onDragStart={onDragStart}
      />
    </div>
  );
}
