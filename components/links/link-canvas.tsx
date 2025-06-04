"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types"; // BioElementType might be removed if not used directly here
import { Smartphone, Monitor, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { RADIUS_OPTIONS } from "./constants/styleConstants";

// Element Components
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

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface LinkCanvasProps {
  elements: BioElement[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  onReorderElements: (newElements: BioElement[]) => void;
}

type PreviewMode = "mobile" | "desktop";

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const PREVIEW_CONFIG = {
  mobile: {
    containerClass: "w-full max-w-[400px] h-[78vh]",
    iconSize: 20,
  },
  desktop: {
    containerClass: "w-full max-w-4xl h-[78vh]",
    iconSize: 20,
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const createDynamicStyles = (styles: StyleProps): React.CSSProperties =>
  ({
    "--bg-color": styles.backgroundColor,
    "--text-color": styles.textColor,
    "--button-color": styles.buttonColor,
    "--button-text-color": styles.buttonTextColor,
    "--border-radius-val": RADIUS_OPTIONS[styles.borderRadius as keyof typeof RADIUS_OPTIONS] || RADIUS_OPTIONS.md,
    fontFamily: styles.fontFamily,
  } as React.CSSProperties);

// ============================================================================
// ELEMENT RENDERER
// ============================================================================

interface ElementRendererProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  // isNested prop removed as column/nesting functionality is removed from canvas
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, styles, updateElement, deleteElement }) => {
  const commonProps = {
    element,
    styles,
    updateElement,
    deleteElement,
    // isNested: false, // Removed: No longer relevant for a flat canvas structure
  };

  // Ensure BioElementType is imported if used for keys here, or element.type is specific enough
  const elementComponents: Record<string, React.ComponentType<any>> = {
    profile: ProfileElement,
    socials: SocialsElement,
    link: LinkElement,
    card: CardElement,
    header: HeaderElement,
    image: ImageElement,
    calendly: CalendlyElement,
    shopify: ShopifyElement,
    countdown: CountdownElement,
    subscribe: SubscribeElement,
  };

  const Component = elementComponents[element.type];

  if (Component) {
    // Pass only necessary props; if commonProps had 'isNested', it's now gone
    return (
      <Component
        key={element.id}
        {...commonProps}
      />
    );
  }

  // Fallback for unknown types
  if (process.env.NODE_ENV === "development") {
    console.warn(`Unknown element type: ${element.type}`, element);
  }

  return (
    <div className="p-4 my-3 shadow border bg-red-100 border-red-300 text-red-700 rounded-md">
      Unknown Element Type: {element.type || "Undefined"}
    </div>
  );
};

// ============================================================================
// PREVIEW MODE TOGGLE
// ============================================================================

interface PreviewModeToggleProps {
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
}

const PreviewModeToggle: React.FC<PreviewModeToggleProps> = ({ previewMode, setPreviewMode }) => (
  <div className="mb-4 flex justify-center space-x-2 flex-shrink-0">
    {(["mobile", "desktop"] as const).map((mode) => (
      <button
        key={mode}
        onClick={() => setPreviewMode(mode)}
        className={`p-2 rounded transition-colors ${
          previewMode === mode
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
        aria-pressed={previewMode === mode}
        aria-label={`Switch to ${mode.charAt(0).toUpperCase() + mode.slice(1)} Preview`}>
        {mode === "mobile" ? <Smartphone size={PREVIEW_CONFIG[mode].iconSize} /> : <Monitor size={PREVIEW_CONFIG[mode].iconSize} />}
      </button>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LinkCanvas: React.FC<LinkCanvasProps> = ({ elements, onDrop, onDragOver, styles, updateElement, deleteElement, onReorderElements }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("mobile");

  const dynamicStyles = useMemo(() => createDynamicStyles(styles), [styles]);

  // Sort elements by order for rendering a flat list
  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [elements]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
        return;
      }

      // Reorder elements in the flat list
      const newElements = Array.from(sortedElements);
      const [reorderedItem] = newElements.splice(source.index, 1);
      newElements.splice(destination.index, 0, reorderedItem);

      // Update order values for the flat list
      const updatedElementsWithOrder = newElements.map((element, index) => ({
        ...element,
        order: index,
      }));

      onReorderElements(updatedElementsWithOrder);
    },
    [sortedElements, onReorderElements]
  );

  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <PreviewModeToggle
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
      />

      <div
        className={`preview-scroll-container overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out ${PREVIEW_CONFIG[previewMode].containerClass} rounded-lg`}
        style={{
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor, // This should be just the color string
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onDrop={onDrop} // For dropping new elements from palette onto the canvas
        onDragOver={onDragOver} // For dropping new elements from palette onto the canvas
      >
        <div
          style={dynamicStyles} // Applies custom theme styles
          className="h-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="elements-list" // Single droppable area for the flat list
              direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-full transition-colors duration-150 ease-in-out ${
                    snapshot.isDraggingOver ? "bg-black/5 dark:bg-white/5" : ""
                  }`}>
                  {sortedElements.length === 0 && !snapshot.isDraggingOver ? (
                    <div
                      className="text-center py-20 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                      style={{ color: styles.textColor, opacity: 0.7 }}>
                      <p className="font-medium">Your canvas is empty!</p>
                      <p className="text-sm mt-1">Drag elements from the left panel to start building.</p>
                    </div>
                  ) : (
                    sortedElements.map((element, index) => (
                      <Draggable
                        key={element.id}
                        draggableId={element.id}
                        index={index}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            className={`flex items-start mb-2 relative ${
                              snapshotDrag.isDragging ? "shadow-lg bg-white dark:bg-gray-800 rounded" : ""
                            }`}>
                            <div
                              {...providedDrag.dragHandleProps}
                              className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none"
                              aria-label="Drag element to reorder">
                              <GripVertical size={20} />
                            </div>
                            <div className="flex-1">
                              <ElementRenderer
                                element={element}
                                styles={styles}
                                updateElement={updateElement}
                                deleteElement={deleteElement}
                              />
                            </div>
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
    </div>
  );
};

export default LinkCanvas;
