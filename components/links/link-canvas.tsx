// src/components/links/link-canvas.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BioElement, BioElementType, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Smartphone, Monitor, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Import the element components (ensure paths are correct)
import ProfileElement from "./canvas-element/ProfileElement";
import SocialsElement from "./canvas-element/SocialsElement";
import LinkElement from "./canvas-element/LinkElement";
import CardElement from "./canvas-element/CardElement";
import CalendlyElement from "./canvas-element/CalendlyElement";
import HeaderElement from "./canvas-element/HeaderElement";
import ImageElement from "./canvas-element/ImageElement";
import ShopifyElement from "./canvas-element/ShopifyElement";
import CountdownElement from "./canvas-element/CountdownTimerElement"; // Ensure correct filename
import SubscribeElement from "./canvas-element/SubscribeElement";

interface LinkCanvasProps {
  elements: BioElement[]; // This prop holds the *latest* flat list from EditPage
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId?: string, targetColumnIndex?: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  onReorderElements: (newElements: BioElement[]) => void; // Callback to update the entire elements structure
}

// Helper function to generate droppable ID for columns
const getColumnDroppableId = (layoutElementId: string, columnIndex: number): string => {
  return `${layoutElementId}-col-${columnIndex}`;
};

// Helper function to parse column droppable ID
const parseColumnDroppableId = (droppableId: string): { layoutId: string; colIndex: number } | null => {
  const parts = droppableId.match(/(.+)-col-(\d+)/);
  if (parts && parts.length === 3) {
    return { layoutId: parts[1], colIndex: parseInt(parts[2], 10) };
  }
  return null;
};

export default function LinkCanvas({ elements, onDrop, onDragOver, styles, updateElement, deleteElement, onReorderElements }: LinkCanvasProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");

  // Apply styles using CSS variables
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
            ? "0.125rem" // 2px
            : styles.borderRadius === "md"
            ? "0.375rem" // 6px
            : styles.borderRadius === "lg"
            ? "0.5rem" // 8px
            : styles.borderRadius === "full"
            ? "9999px"
            : "0.375rem", // Default md
        fontFamily: styles.fontFamily,
        // Add a subtle background for the canvas itself if the main background is transparent/image
        // To ensure contrast for elements if the page background is an image
        // backgroundColor: styles.backgroundImage ? 'rgba(255, 255, 255, 0.1)' : styles.backgroundColor, // Removed this as it might overlay background color unexpectedly
      } as React.CSSProperties & { "--border-radius-val": string }),
    [styles]
  );

  // Root elements (those not inside a layout) are identified and sorted by order
  const rootElements = useMemo(() => {
    const elementIds = new Set(elements.map((el) => el.id));
    // An element is root if it has no parentId, or its parentId doesn't exist in the current elements list
    return elements.filter((el) => !el.parentId || !elementIds.has(el.parentId)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [elements]);

  // --- Drag and Drop Logic ---
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // 1. Dropped outside any droppable area
    if (!destination) {
      return;
    }

    // Avoid unnecessary updates if dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // 2. Parse source and destination IDs
    const sourceColInfo = parseColumnDroppableId(source.droppableId);
    const destColInfo = parseColumnDroppableId(destination.droppableId);
    const isMovingToRoot = destination.droppableId === "elements-droppable";
    const isMovingFromRoot = source.droppableId === "elements-droppable";

    console.log("DragEnd:", { source, destination, sourceColInfo, destColInfo, isMovingToRoot, isMovingFromRoot });

    // Use a mutable copy to easily reorder/update properties before setting final state
    const currentElements = [...elements];
    const draggedElIndex = currentElements.findIndex((el) => el.id === draggableId);
    if (draggedElIndex === -1) {
      console.error("Dragged element not found in state!");
      return;
    }

    // 1. Remove the element from its current position
    const [draggedElement] = currentElements.splice(draggedElIndex, 1);

    // 2. Update parentId and columnIndex based on destination
    let targetParentId: string | undefined = undefined;
    let targetColumnIndex: number | undefined = undefined;

    if (isMovingToRoot) {
      delete draggedElement.parentId;
      delete draggedElement.columnIndex;
    } else if (destColInfo) {
      targetParentId = destColInfo.layoutId;
      targetColumnIndex = destColInfo.colIndex;
      draggedElement.parentId = targetParentId;
      draggedElement.columnIndex = targetColumnIndex;
    } else {
      console.error("Invalid destination droppable ID during drag end.");
      return; // Should not happen
    }

    // 3. Insert the element logically into the new position in the mutable array
    // We can't directly use destination.index across different lists (root vs columns)
    // Instead, we insert it back and then re-calculate order for *all* elements.
    // Find the reference element to insert before (if any)
    let targetIndex = destination.index;
    if (isMovingToRoot) {
      const rootEls = currentElements.filter((el) => !el.parentId).sort((a, b) => a.order! - b.order!);
      if (targetIndex < rootEls.length) {
        const elementToInsertBefore = rootEls[targetIndex];
        targetIndex = currentElements.findIndex((el) => el.id === elementToInsertBefore.id);
      } else {
        targetIndex = currentElements.length; // Add to end if index is out of bounds
      }
    } else if (destColInfo) {
      const columnEls = currentElements.filter((el) => el.parentId === destColInfo.layoutId && el.columnIndex === destColInfo.colIndex).sort((a, b) => a.order! - b.order!);
      if (targetIndex < columnEls.length) {
        const elementToInsertBefore = columnEls[targetIndex];
        targetIndex = currentElements.findIndex((el) => el.id === elementToInsertBefore.id);
      } else {
        // Find last element of the column or the parent layout itself to insert after
        const lastElInCol = columnEls[columnEls.length - 1];
        if (lastElInCol) {
          targetIndex = currentElements.findIndex((el) => el.id === lastElInCol.id) + 1;
        } else {
          // Column is empty, insert after parent layout element
          const parentIdx = currentElements.findIndex((el) => el.id === destColInfo.layoutId);
          targetIndex = parentIdx + 1;
        }
      }
    }
    // Ensure targetIndex is valid
    targetIndex = Math.max(0, Math.min(currentElements.length, targetIndex));
    currentElements.splice(targetIndex, 0, draggedElement);

    // 4. Recalculate order for ALL elements based on their parent and position
    const finalOrderedElements: BioElement[] = [];
    const layouts: Record<string, BioElement[]> = {}; // Temp store for layout children

    // First pass: assign order to root elements and identify children
    currentElements.forEach((el) => {
      if (el.parentId) {
        const key = `${el.parentId}-${el.columnIndex}`;
        if (!layouts[key]) layouts[key] = [];
        layouts[key].push(el);
      } else {
        finalOrderedElements.push(el); // Add root elements directly
      }
    });

    // Sort root elements by their current index in the array
    finalOrderedElements.sort((a, b) => currentElements.indexOf(a) - currentElements.indexOf(b));
    finalOrderedElements.forEach((el, index) => (el.order = index)); // Assign root order

    // Second pass: sort and assign order to children within each layout column
    Object.values(layouts).forEach((children) => {
      children.sort((a, b) => currentElements.indexOf(a) - currentElements.indexOf(b)); // Sort by array index
      children.forEach((child, index) => {
        child.order = index; // Assign order within the column
        finalOrderedElements.push(child); // Add sorted children to the final flat list
      });
    });

    // Ensure all elements are included (paranoid check)
    if (finalOrderedElements.length !== elements.length) {
      console.warn("Element count mismatch after reorder - potential issue in logic.");
      // Fallback or error handling might be needed
    }

    // 5. Update the state via the callback
    onReorderElements(finalOrderedElements);
  };

  // --- Rendering Logic ---

  // Helper to get children, always filters the LATEST `elements` prop
  const getChildrenForLayoutColumn = (layoutId: string, colIndex: number): BioElement[] => {
    return elements // Filter the main elements prop from parent
      .filter((el) => el.parentId === layoutId && el.columnIndex === colIndex)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Sort by order
  };

  const renderElement = (elem: BioElement, isNested: boolean = false): JSX.Element | null => {
    switch (elem.type) {
      // --- Standard Elements ---
      // Pass down props including isNested
      case "profile":
        return <ProfileElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "socials":
        return <SocialsElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "link":
        return <LinkElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "card":
        return <CardElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "header":
        return <HeaderElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "image":
        return <ImageElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "calendly":
        return <CalendlyElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "shopify":
        return <ShopifyElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "countdown":
        return <CountdownElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;
      case "subscribe":
        return <SubscribeElement key={elem.id} element={elem} styles={styles} updateElement={updateElement} deleteElement={deleteElement} isNested={isNested} />;

      // --- Layout Elements ---
      case "layout-single-column":
      case "layout-two-columns": {
        const numColumns = elem.type === "layout-single-column" ? 1 : 2;

        return (
          <div key={elem.id} className={`layout-container bg-gray-500/5 dark:bg-gray-500/10 border border-dashed border-gray-400 dark:border-gray-600 p-2 rounded-md my-2`}>
            {/* Layout Header (Type Label & Delete Button for root layouts) */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1 flex justify-between items-center">
              <span className="font-medium">{elem.type === "layout-single-column" ? "Single Column Row" : "Two Column Row"}</span>
              {/* Only show delete button for root-level layouts */}
              {!isNested && (
                <button onClick={() => deleteElement(elem.id)} className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition" aria-label="Delete Layout Row">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            {/* Columns Grid */}
            <div className={`grid gap-3 ${numColumns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {Array.from({ length: numColumns }).map((_, colIndex) => {
                // Fetch children for this column using the helper
                const columnChildren = getChildrenForLayoutColumn(elem.id, colIndex);

                return (
                  <Droppable key={colIndex} droppableId={getColumnDroppableId(elem.id, colIndex)}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // Add drop zone styling and highlighting
                        className={`column-droppable min-h-[70px] border-2 border-dashed rounded-md p-2 transition-colors duration-150 ease-in-out ${
                          snapshot.isDraggingOver
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600" // Highlight when dragging over
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500" // Default state
                        }`}
                        // Pass layout ID and column index for the main onDrop handler
                        data-layout-id={elem.id}
                        data-column-index={colIndex}
                      >
                        {/* Render elements within this column */}
                        {columnChildren.length > 0 ? (
                          columnChildren.map((childElem, index) => (
                            <Draggable key={childElem.id} draggableId={childElem.id} index={index}>
                              {(providedDrag, snapshotDrag) => (
                                <div
                                  ref={providedDrag.innerRef}
                                  {...providedDrag.draggableProps}
                                  className={`flex items-start mb-2 ${snapshotDrag.isDragging ? "opacity-70 scale-[1.02]" : ""} transition-transform duration-150 ease-in-out`}
                                  style={{ transform: snapshotDrag.isDragging ? "rotate(-1deg)" : "none" }} // Slight tilt effect
                                >
                                  {/* Drag handle for nested elements */}
                                  <div
                                    {...providedDrag.dragHandleProps}
                                    className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none" // Added touch-none
                                    aria-label="Drag element to reorder"
                                  >
                                    <GripVertical size={18} />
                                  </div>
                                  {/* Render the nested element */}
                                  <div className="flex-1">{renderElement(childElem, true)}</div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : // Placeholder text when column is empty
                        snapshot.isDraggingOver ? null : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-4 px-2 pointer-events-none">Drop element here</p>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        );
      }

      // --- Fallback for Unknown Types ---
      default:
        // Log error for unknown type in development
        if (process.env.NODE_ENV === "development") {
          console.warn(`Unknown element type encountered in LinkCanvas: ${elem.type}`, elem);
        }
        return (
          <div key={elem.id} className={`p-4 my-3 shadow border bg-red-100 border-red-300 text-red-700 rounded-md`}>
            Unknown Element Type: {(elem as any).type || "Undefined"}
          </div>
        );
    }
  };

  // --- Custom Drop Handler for Canvas/Columns ---
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    // Find the closest droppable column element or the main canvas
    const columnDroppable = target.closest(".column-droppable");
    let targetId: string | undefined = undefined;
    let targetColumnIndex: number | undefined = undefined;

    if (columnDroppable) {
      targetId = columnDroppable.getAttribute("data-layout-id") ?? undefined;
      const colIndexStr = columnDroppable.getAttribute("data-column-index");
      targetColumnIndex = colIndexStr ? parseInt(colIndexStr, 10) : undefined;
    } else {
      // Check if dropping directly onto the root droppable area
      const rootDroppable = target.closest('[data-rbd-droppable-id="elements-droppable"]');
      if (!rootDroppable) {
        // Dropped outside any valid area (e.g., on controls), do nothing or provide feedback
        console.log("Dropped outside valid area");
        return;
      }
    }

    console.log("Canvas Drop Event - Target Context:", { targetId, targetColumnIndex });
    onDrop(e, targetId, targetColumnIndex); // Call parent's onDrop with context
  };

  // --- Main Return JSX ---
  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Preview Mode Toggle */}
      <div className="mb-4 flex justify-center space-x-2 flex-shrink-0">
        <button onClick={() => setPreviewMode("mobile")} className={`p-2 rounded transition-colors ${previewMode === "mobile" ? "bg-blue-600 text-white shadow-md" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`} aria-pressed={previewMode === "mobile"} aria-label="Switch to Mobile Preview">
          <Smartphone size={20} />
        </button>
        <button onClick={() => setPreviewMode("desktop")} className={`p-2 rounded transition-colors ${previewMode === "desktop" ? "bg-blue-600 text-white shadow-md" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`} aria-pressed={previewMode === "desktop"} aria-label="Switch to Desktop Preview">
          <Monitor size={20} />
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={`preview-scroll-container overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out ${
          previewMode === "mobile" ? "w-full max-w-[400px] h-[78vh]" : "w-full max-w-4xl h-[78vh]" // Slightly adjusted sizes
        } rounded-lg`}
        style={{
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor, // Apply direct background color
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        // Use the custom drop handler for adding NEW elements
        onDrop={handleCanvasDrop}
        onDragOver={onDragOver} // Keep the original onDragOver for allowing drop
      >
        {/* Apply dynamic styles (CSS variables) to this inner div for cascading */}
        <div style={dynamicStyles} className="h-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Main Droppable for Root Elements */}
            <Droppable droppableId="elements-droppable" direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  // Styling for the root droppable area
                  className={`p-4 min-h-full transition-colors duration-150 ease-in-out ${snapshot.isDraggingOver ? "bg-black/5 dark:bg-white/5" : ""}`}
                >
                  {rootElements.length === 0 ? (
                    // Placeholder when canvas is empty
                    <div className="text-center py-20 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg" style={{ color: styles.textColor, opacity: 0.7 }}>
                      <p className="font-medium">Your canvas is empty!</p>
                      <p className="text-sm mt-1">Drag elements or layouts from the left panel to start building.</p>
                    </div>
                  ) : (
                    // Render Root Elements (standard elements or layout containers)
                    rootElements.map((elem, index) => (
                      <Draggable key={elem.id} draggableId={elem.id} index={index}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            className={`flex items-start mb-2 relative ${snapshotDrag.isDragging ? "opacity-80 shadow-xl" : ""}`}
                            style={{ transform: snapshotDrag.isDragging ? "rotate(-1deg)" : "none" }} // Tilt effect
                          >
                            {/* Drag handle for root elements */}
                            <div
                              {...providedDrag.dragHandleProps}
                              className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none" // Added touch-none
                              aria-label="Drag element to reorder"
                            >
                              <GripVertical size={20} />
                            </div>
                            {/* Render the root element (could be standard or layout) */}
                            <div className="flex-1">{renderElement(elem, false)}</div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {/* Placeholder pushes content up when dragging */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
