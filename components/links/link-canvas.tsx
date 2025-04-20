// src/components/link-preview.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Smartphone, Monitor, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// Import the element components
import ProfileElement from "./canvas-element/ProfileElement";
import SocialsElement from "./canvas-element/SocialsElement";
import LinkElement from "./canvas-element/LinkElement";
import CardElement from "./canvas-element/CardElement";
import CalendlyElement from "./canvas-element/CalendlyElement";
import HeaderElement from "./canvas-element/HeaderElement";
import ImageElement from "./canvas-element/ImageElement";
import ShopifyElement from "./canvas-element/ShopifyElement";
import CountdownElement from "./canvas-element/CountdownTimerElement";
import SubscribeElement from "./canvas-element/SubscribeElement";
interface LinkPreviewProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  onReorderElements: (newOrder: BioElement[]) => void; // New callback prop
}

export default function LinkCanvas({ elements, onDrop, onDragOver, styles, updateElement, deleteElement, onReorderElements }: LinkPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // Apply styles using CSS variables for easier cascading
  const dynamicStyles = useMemo(
    () =>
      ({
        "--bg-color": styles.backgroundColor,
        "--text-color": styles.textColor,
        "--button-color": styles.buttonColor,
        "--button-text-color": styles.buttonTextColor,
        "--border-radius-val":
          styles.borderRadius === "none"
            ? "0px"
            : styles.borderRadius === "sm"
            ? "0.125rem"
            : styles.borderRadius === "md"
            ? "0.375rem"
            : styles.borderRadius === "lg"
            ? "0.5rem"
            : styles.borderRadius === "full"
            ? "9999px"
            : "0.375rem", // Default md
        fontFamily: styles.fontFamily,
      } as React.CSSProperties & { "--border-radius-val": string }),
    [styles]
  );

  const sortedElements = useMemo(() => {
    // Basic sorting - replace with drag-and-drop order later
    return [...elements].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [elements]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // dropped outside the list

    const newElements = Array.from(sortedElements);
    // Remove the item from its original position
    const [movedElement] = newElements.splice(result.source.index, 1);
    // Insert it into its new position
    newElements.splice(result.destination.index, 0, movedElement);

    // (Optional) Update each element's order property, if you're relying on it.
    newElements.forEach((el, index) => {
      el.order = index;
    });
    onReorderElements(newElements);
  };

  const renderElement = (elem: BioElement) => {
    switch (elem.type) {
      case "profile":
        return (
          <ProfileElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "socials":
        return (
          <SocialsElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "link":
        return (
          <LinkElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "card":
        return (
          <CardElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );

      case "header":
        return (
          <HeaderElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "image":
        return (
          <ImageElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "calendly":
        return (
          <CalendlyElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "shopify":
        return (
          <ShopifyElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "countdown":
        return (
          <CountdownElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      case "subscribe":
        return (
          <SubscribeElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        );
      default:
        return (
          <div
            key={elem.id}
            className={`p-4 my-3 shadow border bg-gray-100 border-gray-300 rounded-${styles.borderRadius === "none" ? "none" : styles.borderRadius}`}>
            Unknown Element Type: {elem.type}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100 overflow-hidden">
      {/* Preview Mode Toggle */}
      <div className="mb-4 flex justify-center space-x-2 flex-shrink-0">
        <button
          onClick={() => setPreviewMode("mobile")}
          className={`p-2 rounded ${previewMode === "mobile" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}>
          <Smartphone size={20} />
        </button>
        <button
          onClick={() => setPreviewMode("desktop")}
          className={`p-2 rounded ${previewMode === "desktop" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}>
          <Monitor size={20} />
        </button>
      </div>
      {/* Preview Container */}
      <div
        className={`overflow-y-auto overflow-x-hidden border border-gray-300 shadow-lg transition-all duration-300 ease-in-out ${
          previewMode === "mobile" ? "w-full max-w-[375px] h-[75vh]" : "w-full max-w-3xl h-[75vh]"
        } rounded-lg`}
        style={{
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="elements-droppable"
            direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4">
                {sortedElements.length === 0 ? (
                  <p
                    className="text-center py-20"
                    style={{ color: styles.textColor, opacity: 0.7 }}>
                    Drop elements here to build your page.
                  </p>
                ) : (
                  sortedElements.map((elem, index) => (
                    <Draggable
                      key={elem.id}
                      draggableId={elem.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          // No extra border; only the grip icon will serve as the drag handle.
                          className={`flex items-center mb-2 ${snapshot.isDragging ? "opacity-80" : ""}`}>
                          {/* Only the vertical grip icon is clickable for dragging */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab mr-2">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1">{renderElement(elem)}</div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
