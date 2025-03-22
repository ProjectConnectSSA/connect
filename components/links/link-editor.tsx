"use client";

import React from "react";

export type BioElementType = "link" | "card" | "button";

interface LinkEditorProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => void;
}

export default function LinkEditor({ onDragStart }: LinkEditorProps) {
  return (
    <div className="p-4 border-r">
      <h2 className="text-lg font-semibold mb-4">Elements Toolbar</h2>
      <div
        className="p-2 mb-2 bg-blue-100 rounded cursor-move hover:bg-blue-200 transition"
        draggable
        onDragStart={(e) => onDragStart(e, "link")}>
        Link
      </div>
      <div
        className="p-2 mb-2 bg-green-100 rounded cursor-move hover:bg-green-200 transition"
        draggable
        onDragStart={(e) => onDragStart(e, "card")}>
        Card
      </div>
      <div
        className="p-2 mb-2 bg-red-100 rounded cursor-move hover:bg-red-200 transition"
        draggable
        onDragStart={(e) => onDragStart(e, "button")}>
        Button
      </div>
    </div>
  );
}
