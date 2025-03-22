"use client";

import { Type, Star, List, CheckSquare, Calendar, Mail, Phone, Image, Link, Cuboid } from "lucide-react";

const ELEMENT_TYPES = [
  { id: "text", icon: Type, label: "Text", type: "text" },
  { id: "rating", icon: Star, label: "Rating", type: "rating" },
  { id: "select", icon: List, label: "Select", type: "select" },
  { id: "checkbox", icon: CheckSquare, label: "Checkbox", type: "checkbox" },
  { id: "date", icon: Calendar, label: "Date", type: "date" },
  { id: "phone", icon: Phone, label: "Phone", type: "phone" },
  { id: "image", icon: Image, label: "Image", type: "image" },
  { id: "email", icon: Mail, label: "Email", type: "email" },
  { id: "link", icon: Link, label: "Link", type: "link" },
  { id: "button", icon: Cuboid, label: "Button", type: "button" },
];

export function ElementToolbar() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-2">
        {ELEMENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("elementType", type.type)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border cursor-move hover:bg-accent">
              <Icon className="h-5 w-5" />
              <span className="text-xs">{type.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
