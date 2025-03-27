// src/components/form-builder/toolbar/ElementToolbar.tsx
"use client";

import React from "react";
import {
  Type,
  Star,
  List,
  CheckSquare,
  Calendar,
  Mail,
  Phone,
  Image as ImageIcon,
  Link,
  Radio,
  Heading,
  FileText, // Added Radio, Heading, Textarea
  MousePointerClick, // Better icon for Button
} from "lucide-react";

// Expand or adjust element types as needed
const ELEMENT_TYPES = [
  { id: "heading", icon: Heading, label: "Heading", type: "heading" },
  { id: "text", icon: Type, label: "Text Input", type: "text" },
  { id: "textarea", icon: FileText, label: "Text Area", type: "textarea" }, // Added Textarea
  { id: "email", icon: Mail, label: "Email", type: "email" },
  { id: "phone", icon: Phone, label: "Phone", type: "phone" },
  { id: "checkbox", icon: CheckSquare, label: "Checkbox", type: "checkbox" },
  { id: "radio", icon: Radio, label: "Radio Group", type: "radio" }, // Added Radio
  { id: "select", icon: List, label: "Dropdown", type: "select" },
  { id: "date", icon: Calendar, label: "Date", type: "date" },
  { id: "rating", icon: Star, label: "Rating", type: "rating" },
  { id: "image", icon: ImageIcon, label: "Image", type: "image" },
  { id: "link", icon: Link, label: "Link", type: "link" },
  { id: "button", icon: MousePointerClick, label: "Button", type: "button" },
];

export function ElementToolbar() {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, elementType: string) => {
    e.dataTransfer.setData("elementType", elementType);
    e.dataTransfer.effectAllowed = "copy"; // Indicate that this is a copy operation
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-gray-600 mb-3 px-1">Elements</h3>
      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_TYPES.map((element) => {
          const Icon = element.icon;
          return (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element.type)}
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-md border border-gray-200 bg-white cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm"
              title={`Add ${element.label} element`}>
              <Icon className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-center text-gray-700">{element.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
