// src/components/link-preview.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Smartphone, Monitor } from "lucide-react";

// Import the element components
import ProfileElement from "./canvas-element/ProfileElement";
import SocialsElement from "./canvas-element/SocialsElement";
import LinkElement from "./canvas-element/LinkElement";
import CardElement from "./canvas-element/CardElement"; // Import CardElement
import ButtonElement from "./canvas-element/ButtonElement"; // Import ButtonElement
import HeaderElement from "./canvas-element/HeaderElement"; // Import HeaderElement
import ImageElement from "./canvas-element/ImageElement"; // Import ImageElement

interface LinkPreviewProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  // Add deleteElement prop later if needed
}

export default function LinkCanvas({ elements, onDrop, onDragOver, styles, updateElement }: LinkPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  // Apply styles using CSS variables for easier cascading
  const dynamicStyles = useMemo(
    () =>
      ({
        "--bg-color": styles.backgroundColor,
        "--text-color": styles.textColor,
        "--button-color": styles.buttonColor,
        "--button-text-color": styles.buttonTextColor,
        // Map semantic names to actual values for use in style attr if needed
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
        // Background image handled separately
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
          />
        );
      case "card": // Add CardElement case
        return (
          <CardElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "button": // Add ButtonElement case
        return (
          <ButtonElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "header": // Add HeaderElement case
        return (
          <HeaderElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      case "image": // Add ImageElement case
        return (
          <ImageElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
          />
        );
      default:
        // Fallback for any unexpected types
        return (
          <div
            key={elem.id}
            className={`p-4 my-3 rounded shadow border bg-gray-100 border-gray-300 rounded-${
              styles.borderRadius === "none" ? "none" : styles.borderRadius
            }`}>
            Unknown Element Type: {elem.type}
          </div>
        );
    }
  };

  // Logic to group elements for potential two-column layout for cards
  // This is a basic approach. More robust grid logic might be needed.
  const renderedElementGroups = useMemo(() => {
    const groups: React.ReactNode[][] = [];
    let currentGroup: React.ReactNode[] = [];
    let isDoubleColumnGroup = false;

    sortedElements.forEach((elem, index) => {
      const rendered = renderElement(elem);

      if (elem.type === "card" && elem.layout === "double") {
        if (!isDoubleColumnGroup) {
          // Start a new double column group
          if (currentGroup.length > 0) groups.push(currentGroup); // Push previous single group
          currentGroup = [rendered];
          isDoubleColumnGroup = true;
        } else {
          // Add to existing double column group
          currentGroup.push(rendered);
        }
      } else {
        if (isDoubleColumnGroup) {
          // End the double column group
          groups.push(currentGroup);
          currentGroup = [rendered]; // Start new single group
          isDoubleColumnGroup = false;
        } else {
          // Add to existing single column group (or start one)
          currentGroup.push(rendered);
        }
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup); // Add the last group
    }

    return groups;
  }, [sortedElements, styles, updateElement]); // Recompute if elements or styles change

  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100 overflow-hidden">
      {" "}
      {/* Added overflow-hidden */}
      {/* Preview Mode Toggle */}
      <div className="mb-4 flex justify-center space-x-2 flex-shrink-0">
        {/* ... toggle buttons ... */}
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
          previewMode === "mobile" ? "w-full max-w-[375px] h-[75vh]" : "w-full max-w-3xl h-[75vh]" // Adjusted height slightly
        } rounded-lg`}
        style={{
          ...dynamicStyles, // Apply CSS variables
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor, // Direct background color
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: dynamicStyles["--border-radius-val"], // Apply overall border radius too
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}>
        <div className="p-4 md:p-6">
          {" "}
          {/* Inner padding */}
          {elements.length === 0 ? (
            <p
              className="text-center py-20"
              style={{ color: styles.textColor, opacity: 0.7 }}>
              Drop elements here to build your page.
            </p>
          ) : (
            // Render grouped elements
            renderedElementGroups.map((group, groupIndex) => {
              // Check if the first element suggests it's a double column group
              const isDouble = sortedElements.find((el) => el.id === (group[0] as React.ReactElement)?.key)?.layout === "double";

              if (isDouble) {
                return (
                  // Render double column cards in a flex container
                  <div
                    key={`group-${groupIndex}`}
                    className="flex flex-wrap gap-4 mb-3">
                    {group} {/* CardElement already has width styles */}
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
