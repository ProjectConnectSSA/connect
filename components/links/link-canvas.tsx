// src/components/link-preview.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Smartphone, Monitor } from "lucide-react";

// Import the element components
import ProfileElement from "./canvas-element/ProfileElement";
import SocialsElement from "./canvas-element/SocialsElement";
import LinkElement from "./canvas-element/LinkElement";
import CardElement from "./canvas-element/CardElement";
import ButtonElement from "./canvas-element/ButtonElement";
import HeaderElement from "./canvas-element/HeaderElement";
import ImageElement from "./canvas-element/ImageElement";

interface LinkPreviewProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function LinkCanvas({ elements, onDrop, onDragOver, styles, updateElement, deleteElement }: LinkPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

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

  const renderElement = (elem: BioElement) => {
    switch (elem.type) {
      case "profile":
        return (
          <ProfileElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "socials":
        return (
          <SocialsElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
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
          />
        );
      case "button":
        return (
          <ButtonElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "header":
        return (
          <HeaderElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "image":
        return (
          <ImageElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
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

  // Logic to group elements for potential two-column layout for cards
  const renderedElementGroups = useMemo(() => {
    const groups: React.ReactNode[][] = [];
    let currentGroup: React.ReactNode[] = [];
    let isDoubleColumnGroup = false;

    sortedElements.forEach((elem) => {
      const rendered = renderElement(elem);

      if (elem.type === "card" && elem.layout === "double") {
        if (!isDoubleColumnGroup) {
          if (currentGroup.length > 0) groups.push(currentGroup);
          currentGroup = [rendered];
          isDoubleColumnGroup = true;
        } else {
          currentGroup.push(rendered);
        }
      } else {
        if (isDoubleColumnGroup) {
          groups.push(currentGroup);
          currentGroup = [rendered];
          isDoubleColumnGroup = false;
        } else {
          currentGroup.push(rendered);
        }
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [sortedElements, styles, updateElement]);

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
          ...dynamicStyles,
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: dynamicStyles["--border-radius-val"],
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}>
        <div className="p-4 md:p-6">
          {elements.length === 0 ? (
            <p
              className="text-center py-20"
              style={{ color: styles.textColor, opacity: 0.7 }}>
              Drop elements here to build your page.
            </p>
          ) : (
            // Render grouped elements
            renderedElementGroups.map((group, groupIndex) => {
              const isDouble = sortedElements.find((el) => el.id === (group[0] as React.ReactElement)?.key)?.layout === "double";

              if (isDouble) {
                return (
                  // Render double column cards in a flex container
                  <div
                    key={`group-${groupIndex}`}
                    className="flex flex-wrap gap-4 mb-3">
                    {group}
                  </div>
                );
              } else {
                // Render single column elements sequentially
                return group.map((el, elIndex) => (
                  <React.Fragment key={(el as React.ReactElement)?.key || `el-${groupIndex}-${elIndex}`}>{el}</React.Fragment>
                ));
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}
