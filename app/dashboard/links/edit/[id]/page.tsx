// src/app/page.tsx (Or your relevant route)
"use client";

import React, { useState, useCallback } from "react";

import { Toaster, toast } from "sonner"; // For notifications

import LinkEditor from "@/components/links/link-editor";
import LinkPreview from "@/components/links/link-preview";
import LinkStyle from "@/components/links/link-styles";
import Navbar from "@/components/links/navbar";
import { BioElement, BioElementType, StyleProps, defaultStyles } from "@/app/types/links/types"; // Adjust path

export default function Home() {
  const [elements, setElements] = useState<BioElement[]>([]);
  const [styles, setStyles] = useState<StyleProps>(defaultStyles);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => {
    e.dataTransfer.setData("elementType", elementType);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const elementType = e.dataTransfer.getData("elementType") as BioElementType;

      if (!elementType) return;

      const newElement: BioElement = {
        id: crypto.randomUUID(), // Generate unique ID
        type: elementType,
        order: elements.length, // Simple ordering for now
        // Add sensible defaults based on type
        title: elementType === "header" ? "New Header" : undefined,
        name: elementType === "profile" ? "Your Name" : undefined,
        bioText: elementType === "profile" ? "Your Bio" : undefined,
        socialLinks: elementType === "socials" ? [] : undefined,
      };

      setElements((prevElements) => [...prevElements, newElement]);
      toast.success(`${elementType.charAt(0).toUpperCase() + elementType.slice(1)} element added!`);
    },
    [elements.length]
  ); // Dependency on length for order

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleUpdateElement = useCallback((id: string, updatedData: Partial<BioElement>) => {
    setElements((prevElements) => prevElements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)));
    // Optional: Add toast for updates if needed, but might be too noisy
    // toast.info("Element updated.");
  }, []);

  // Allow partial style updates
  const handleChangeStyle = useCallback((newStyles: Partial<StyleProps>) => {
    setStyles((prevStyles) => ({ ...prevStyles, ...newStyles }));
  }, []);

  // Basic delete function (can be triggered from element components later)
  const handleDeleteElement = useCallback((id: string) => {
    setElements((prevElements) => prevElements.filter((el) => el.id !== id));
    toast.success("Element removed.");
  }, []);

  return (
    // If using react-dnd: <DndProvider backend={HTML5Backend}>
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {" "}
        {/* Main content area */}
        <LinkEditor onDragStart={handleDragStart} />
        <LinkPreview
          elements={elements}
          styles={styles}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          updateElement={handleUpdateElement}
        />
        <LinkStyle
          styles={styles}
          onChangeStyle={handleChangeStyle}
        />
      </div>
      <Toaster
        richColors
        position="bottom-right"
      />{" "}
      {/* For notifications */}
    </div>
    // If using react-dnd: </DndProvider>
  );
}
