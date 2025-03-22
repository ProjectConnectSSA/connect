"use client";

import React, { useEffect, useState } from "react";
import LinkEditor, { BioElementType } from "@/components/links/link-editor";
import LinkPreview, { BioElement } from "@/components/links/link-preview";
import LinkStyle, { StyleProps } from "@/components/links/link-styles";
import { toast } from "sonner";

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: EditFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [elements, setElements] = useState<BioElement[]>([]);
  const [styles, setStyles] = useState<StyleProps>({
    backgroundColor: "#ffffff",
    backgroundImage: "",
  });

  // Only fetch form data if id is not "new"
  useEffect(() => {
    if (id !== "new") {
      async function fetchForm() {
        const res = await fetch(`/api/forms/${id}`);
        const data = await res.json();
        // Assume data contains elements and styles
        setElements(data.elements || []);
        setStyles(data.styles || styles);
      }
      fetchForm();
    }
  }, [id]);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) {
    e.dataTransfer.setData("text/plain", elementType);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("text/plain") as BioElementType;
    const newElement: BioElement = {
      id: Date.now().toString(),
      type: elementType,
      content: elementType === "card" ? "Bio Card" : `${elementType.charAt(0).toUpperCase() + elementType.slice(1)} Element`,
    };
    setElements((prev) => [...prev, newElement]);
    toast.success("Element added!");
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-4 bg-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold">{id === "new" ? "Create New Form" : "Edit Form"}</h1>
      </header>
      <div className="flex flex-grow">
        <LinkEditor onDragStart={handleDragStart} />
        <LinkPreview
          elements={elements}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          styles={styles}
          updateElement={(id, updatedData) => setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updatedData } : el)))}
        />
        <LinkStyle
          styles={styles}
          onChangeStyle={setStyles}
        />
      </div>
    </div>
  );
}
