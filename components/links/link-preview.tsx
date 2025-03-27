"use client";

import React, { useState, useMemo } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types"; // Adjust path
import { Smartphone, Monitor } from "lucide-react";

// Import the element components
import ProfileElement from "./preview/ProfileElement";
import SocialsElement from "./preview/SocialsElement";
import LinkElement from "./preview/LinkElement";
// Import others when created: CardElement, ButtonElement, HeaderElement, ImageElement

interface LinkPreviewProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  // Add deleteElement prop later if needed
}

export default function LinkPreview({ elements, onDrop, onDragOver, styles, updateElement }: LinkPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  // Apply styles using CSS variables for easier cascading
  const dynamicStyles = useMemo(
    () =>
      ({
        "--bg-color": styles.backgroundColor,
        "--text-color": styles.textColor,
        "--button-color": styles.buttonColor,
        "--button-text-color": styles.buttonTextColor,
        "--border-radius": styles.borderRadius === "none" ? "0px" : `var(--radius-${styles.borderRadius})`, // Map semantic names to actual values or use Tailwind JIT
        fontFamily: styles.fontFamily,
        // Background image handled separately
      } as React.CSSProperties),
    [styles]
  );

  // Tailwind mapping for border radius (adjust values as needed)
  const radiusVars = {
    "--radius-sm": "0.125rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-full": "9999px",
  };

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
      // case "card":
      //   return <CardElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} />;
      // case "button":
      //   return <ButtonElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} />;
      // case "header":
      //    return <h2 key={elem.id} className="text-xl font-semibold my-4" style={{ color: styles.textColor }}>{elem.title}</h2>;
      // case "image":
      //    return <img key={elem.id} src={elem.url || elem.thumbnailUrl} alt={elem.title || 'Image'} className={`w-full my-3 rounded-${styles.borderRadius}`} />;
      default:
        // Fallback for elements not yet fully implemented
        return (
          <div
            key={elem.id}
            className={`p-4 my-3 rounded shadow border bg-gray-100 border-gray-300 rounded-${
              styles.borderRadius === "none" ? "none" : styles.borderRadius
            }`}>
            {elem.title || elem.type} (Not fully implemented)
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100">
      {/* Preview Mode Toggle */}
      <div className="mb-4 flex justify-center space-x-2">
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
          previewMode === "mobile" ? "w-full max-w-[375px] h-[667px]" : "w-full max-w-3xl h-[70vh]" // Example dimensions
        } rounded-lg`}
        style={{
          ...dynamicStyles, // Apply CSS variables
          ...radiusVars, // Provide radius variables
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor, // Direct background color
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}>
        <div className="p-4 md:p-6">
          {" "}
          {/* Inner padding */}
          {sortedElements.length === 0 ? (
            <p
              className="text-center py-20"
              style={{ color: styles.textColor, opacity: 0.7 }}>
              Drop elements here to build your page.
            </p>
          ) : (
            // Render sorted elements
            sortedElements.map(renderElement)
          )}
        </div>
      </div>
    </div>
  );
}
