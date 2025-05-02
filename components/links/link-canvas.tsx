// src/components/links/link-canvas.tsx
"use client";

import React, { useState, useMemo } from "react";
import { BioElement, BioElementType, StyleProps } from "@/app/types/links/types"; // Adjust path if needed
import { Smartphone, Monitor, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// Import the element components (ensure paths are correct)
import ProfileElement from "./canvas-element/ProfileElement";
import SocialsElement from "./canvas-element/SocialsElement";
import LinkElement from "./canvas-element/LinkElement"; // Note: Changed from LinkElementComp to LinkElement to match usage
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
      } as React.CSSProperties & { "--border-radius-val": string }),
    [styles]
  );

  // Root elements (those not inside a layout) are identified and sorted by order
  const rootElements = useMemo(() => {
    const elementIds = new Set(elements.map((el) => el.id));
    // An element is root if it has no parentId, or its parentId doesn't exist in the current elements list
    // Also filter out potential orphans whose parent might have been deleted but not cleaned up fully
    return elements.filter((el) => !el.parentId || !elementIds.has(el.parentId)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [elements]);

  // Helper to get children, always filters the LATEST `elements` prop
  const getChildrenForLayoutColumn = (layoutId: string, colIndex: number): BioElement[] => {
    return elements // Filter the main elements prop from parent
      .filter((el) => el.parentId === layoutId && el.columnIndex === colIndex)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Sort by order
  };

  // --- Drag and Drop Logic (Reordering - Corrected & Simplified) ---
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // 1. Exit if dropped outside a valid droppable or in the same spot
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    console.log("Reorder DragEnd:", { source, destination, draggableId });

    const updatedElements = Array.from(elements); // Create a mutable copy
    const draggedElementIndex = updatedElements.findIndex((el) => el.id === draggableId);

    if (draggedElementIndex === -1) {
      console.error("Dragged element not found for reordering!");
      return;
    }

    // 2. Remove the dragged element from its original position in the copy
    const [draggedElement] = updatedElements.splice(draggedElementIndex, 1);

    // 3. Determine Source and Destination Context
    const sourceColInfo = parseColumnDroppableId(source.droppableId); // Keep for potential future logic, not used directly now
    const destColInfo = parseColumnDroppableId(destination.droppableId);
    const isMovingToRoot = destination.droppableId === "elements-droppable";

    // 4. Update Parent/Column Info on the Dragged Element
    if (isMovingToRoot) {
      delete draggedElement.parentId;
      delete draggedElement.columnIndex;
    } else if (destColInfo) {
      draggedElement.parentId = destColInfo.layoutId;
      draggedElement.columnIndex = destColInfo.colIndex;
    } else {
      // Should not happen with the check at the start, but good safeguard
      console.error("Invalid destination context in handleDragEnd");
      return;
    }

    // 5. Prepare logical lists based on the *current state* of updatedElements
    //    (before inserting the dragged element back)
    const rootElementsList = updatedElements.filter((el) => !el.parentId).sort((a, b) => a.order! - b.order!);
    const columnElementsMap: { [key: string]: BioElement[] } = {};

    updatedElements.forEach((el) => {
      if (el.parentId && el.columnIndex !== undefined) {
        // Ensure the parent layout still exists in the original elements array before adding
        const parentExists = elements.some((parent) => parent.id === el.parentId);
        if (parentExists) {
          const key = getColumnDroppableId(el.parentId, el.columnIndex);
          if (!columnElementsMap[key]) {
            columnElementsMap[key] = [];
          }
          columnElementsMap[key].push(el);
        } else {
          console.warn(`Orphan element found and excluded during reorder: ${el.id}, parent ${el.parentId} missing.`);
          // Optionally handle orphan cleanup here or mark it for later
        }
      }
    });

    // Sort elements within each column map entry based on their existing order
    Object.keys(columnElementsMap).forEach((key) => {
      columnElementsMap[key].sort((a, b) => a.order! - b.order!);
    });

    // 6. Insert the dragged element into the correct logical list at the destination index
    if (isMovingToRoot) {
      rootElementsList.splice(destination.index, 0, draggedElement);
    } else if (destColInfo) {
      const destKey = destination.droppableId; // Already formatted correctly (layoutId-col-colIndex)
      if (!columnElementsMap[destKey]) {
        columnElementsMap[destKey] = []; // Ensure list exists if column was empty
      }
      columnElementsMap[destKey].splice(destination.index, 0, draggedElement);
    }

    // 7. Rebuild the final flat elements array with correct order
    const finalOrderedElements: BioElement[] = [];

    // Add root elements with updated order
    rootElementsList.forEach((el, index) => {
      el.order = index;
      finalOrderedElements.push(el);
    });

    // Add column elements with updated order
    Object.values(columnElementsMap).forEach((columnList) => {
      columnList.forEach((el, index) => {
        el.order = index; // Order within the column
        finalOrderedElements.push(el);
      });
    });

    // Add back the layout containers themselves (ensure they are present)
    const layoutContainers = elements.filter((el) => el.type.startsWith("layout-"));
    layoutContainers.forEach((layout) => {
      if (!finalOrderedElements.find((feo) => feo.id === layout.id)) {
        // Find the original layout object to preserve any specific properties it had
        const originalLayout = elements.find((e) => e.id === layout.id);
        if (originalLayout) {
          console.log(`Re-adding layout container ${layout.id} to final list.`);
          // We need to decide where to put it if it's missing.
          // Ideally, it should remain logically grouped with its (potentially now empty) children.
          // For simplicity now, just add it. A more robust solution might track its original root order.
          finalOrderedElements.push(originalLayout);
          // If it was a root element, ensure its root order is preserved or recalculated
          if (!originalLayout.parentId) {
            // This part is tricky - need to re-integrate into root ordering properly.
            // Simplest might be to just append and rely on a subsequent full root sort if needed.
          }
        }
      }
    });

    // Paranoid check & Reconciliation (Simplified): ensure all original elements are included.
    const finalIds = new Set(finalOrderedElements.map((el) => el.id));
    let missingElementsAdded = false;
    elements.forEach((originalEl) => {
      if (!finalIds.has(originalEl.id)) {
        console.warn(`Element ${originalEl.id} (${originalEl.type}) was missing after reorder, adding back.`);
        finalOrderedElements.push(originalEl); // Add missing element
        missingElementsAdded = true;
        // Note: Its order and parentage might be incorrect now.
        // This signals a potential flaw in the list rebuilding logic above.
      }
    });

    // If elements were missing and re-added, it's safer to recalculate *all* orders again
    // based on the final structure to ensure consistency.
    if (missingElementsAdded) {
      console.warn("Recalculating all orders due to missing elements reconciliation.");
      const reconciledRoot = finalOrderedElements.filter((el) => !el.parentId);
      reconciledRoot.sort((a, b) => elements.findIndex((e) => e.id === a.id) - elements.findIndex((e) => e.id === b.id)); // Attempt to preserve original relative order
      reconciledRoot.forEach((el, index) => (el.order = index));

      const reconciledColumns: { [key: string]: BioElement[] } = {};
      finalOrderedElements.forEach((el) => {
        if (el.parentId && el.columnIndex !== undefined) {
          const key = getColumnDroppableId(el.parentId, el.columnIndex);
          if (!reconciledColumns[key]) reconciledColumns[key] = [];
          reconciledColumns[key].push(el);
        }
      });
      Object.values(reconciledColumns).forEach((colList) => {
        colList.sort((a, b) => elements.findIndex((e) => e.id === a.id) - elements.findIndex((e) => e.id === b.id)); // Attempt sort
        colList.forEach((el, index) => (el.order = index));
      });
    }

    console.log("Final ordered elements count:", finalOrderedElements.length, "Original count:", elements.length);
    // console.log("Final ordered elements:", JSON.stringify(finalOrderedElements.map(e => ({id: e.id, type: e.type, order: e.order, parentId: e.parentId, colIndex: e.columnIndex})), null, 2));

    // 8. Update the state via the callback
    onReorderElements(finalOrderedElements);
  };

  // --- Rendering Logic ---
  const renderElement = (elem: BioElement, isNested: boolean = false): JSX.Element | null => {
    switch (elem.type) {
      // --- Standard Elements ---
      // Pass down props including isNested and styles/handlers
      case "profile":
        return (
          <ProfileElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={updateElement}
            deleteElement={deleteElement}
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
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
            isNested={isNested}
          />
        );

      // --- Layout Elements ---
      case "layout-single-column":
      case "layout-two-columns": {
        const numColumns = elem.type === "layout-single-column" ? 1 : 2;

        return (
          <div
            key={elem.id}
            className={`layout-container bg-gray-500/5 dark:bg-gray-500/10 border border-dashed border-gray-400 dark:border-gray-600 p-2 rounded-md my-2`}>
            {/* Layout Header */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1 flex justify-between items-center">
              <span className="font-medium">{elem.type === "layout-single-column" ? "Single Column Row" : "Two Column Row"}</span>
              {/* Only show delete button for root-level layouts (handled via parent context, not isNested prop) */}
              {!elem.parentId && ( // Check if it's a root element directly
                <button
                  onClick={() => deleteElement(elem.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition"
                  aria-label="Delete Layout Row">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            {/* Columns Grid */}
            <div className={`grid gap-3 ${numColumns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {Array.from({ length: numColumns }).map((_, colIndex) => {
                const columnChildren = getChildrenForLayoutColumn(elem.id, colIndex);

                return (
                  <Droppable
                    key={colIndex}
                    droppableId={getColumnDroppableId(elem.id, colIndex)}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // Drop zone styling
                        className={`column-droppable min-h-[70px] border-2 border-dashed rounded-md p-2 transition-colors duration-150 ease-in-out ${
                          snapshot.isDraggingOver
                            ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                        // Data attributes for the custom drop handler
                        data-layout-id={elem.id}
                        data-column-index={colIndex}>
                        {/* Render nested elements */}
                        {columnChildren.length > 0 ? (
                          columnChildren.map((childElem, index) => (
                            <Draggable
                              key={childElem.id}
                              draggableId={childElem.id}
                              index={index}>
                              {(providedDrag, snapshotDrag) => (
                                <div
                                  ref={providedDrag.innerRef}
                                  {...providedDrag.draggableProps}
                                  // --- STYLE CHANGE FOR NESTED DRAGGABLE (Simplified) ---
                                  className={`flex items-start mb-2 ${
                                    snapshotDrag.isDragging
                                      ? "shadow-md bg-white dark:bg-gray-700 rounded" // Subtle shadow, solid background
                                      : ""
                                  }`}
                                  // --- END STYLE CHANGE ---
                                >
                                  {/* Drag handle */}
                                  <div
                                    {...providedDrag.dragHandleProps}
                                    className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none"
                                    aria-label="Drag element to reorder">
                                    <GripVertical size={18} />
                                  </div>
                                  {/* Render the nested element (pass isNested=true) */}
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
        if (process.env.NODE_ENV === "development") {
          console.warn(`Unknown element type encountered in LinkCanvas: ${elem.type}`, elem);
        }
        return (
          <div
            key={elem.id}
            className={`p-4 my-3 shadow border bg-red-100 border-red-300 text-red-700 rounded-md`}>
            Unknown Element Type: {(elem as any).type || "Undefined"}
          </div>
        );
    }
  };

  // --- Custom Drop Handler for Canvas/Columns (Adding NEW elements) ---
  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default drop behavior
    e.stopPropagation(); // Stop event from bubbling further

    const target = e.target as HTMLElement;

    // 1. Check if the drop target is within a specific column droppable zone
    const columnDroppable = target.closest(".column-droppable");
    let targetId: string | undefined = undefined;
    let targetColumnIndex: number | undefined = undefined;

    if (columnDroppable) {
      // Found a specific column target
      targetId = columnDroppable.getAttribute("data-layout-id") ?? undefined;
      const colIndexStr = columnDroppable.getAttribute("data-column-index");
      targetColumnIndex = colIndexStr ? parseInt(colIndexStr, 10) : undefined;

      // Ensure we actually got valid data attributes
      if (targetId !== undefined && targetColumnIndex !== undefined) {
        console.log("Canvas Drop Event - Target Context (Column):", { targetId, targetColumnIndex });
        onDrop(e, targetId, targetColumnIndex); // Call parent's onDrop with column context
        return; // Drop handled
      } else {
        console.warn("Column droppable detected, but failed to get layout ID or column index. Falling back to root drop.");
        // Fall through to treat as root drop
      }
    }

    // 2. If not dropped in a specific column, check if it's within the main canvas area
    const mainCanvasContainer = target.closest(".preview-scroll-container");
    if (mainCanvasContainer) {
      console.log("Canvas Drop Event - Target Context (Root):", { targetId: undefined, targetColumnIndex: undefined });
      onDrop(e, undefined, undefined); // Call parent's onDrop with root context (no targetId/Index)
    } else {
      // Safeguard: Should not happen if the event handler is on the correct element
      console.log("Dropped outside valid area (failed to find main container).");
    }
  };

  // --- Main Return JSX ---
  return (
    <div className="flex-1 p-4 flex flex-col items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Preview Mode Toggle */}
      <div className="mb-4 flex justify-center space-x-2 flex-shrink-0">
        <button
          onClick={() => setPreviewMode("mobile")}
          className={`p-2 rounded transition-colors ${
            previewMode === "mobile"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-pressed={previewMode === "mobile"}
          aria-label="Switch to Mobile Preview">
          <Smartphone size={20} />
        </button>
        <button
          onClick={() => setPreviewMode("desktop")}
          className={`p-2 rounded transition-colors ${
            previewMode === "desktop"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-pressed={previewMode === "desktop"}
          aria-label="Switch to Desktop Preview">
          <Monitor size={20} />
        </button>
      </div>

      {/* Preview Container */}
      <div
        className={`preview-scroll-container overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out ${
          previewMode === "mobile" ? "w-full max-w-[400px] h-[78vh]" : "w-full max-w-4xl h-[78vh]"
        } rounded-lg`}
        style={{
          backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
          backgroundColor: styles.backgroundColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        // Native HTML5 Drop handlers for adding NEW elements
        onDrop={handleCanvasDrop} // Use the corrected custom handler
        onDragOver={onDragOver} // Allow dropping
      >
        {/* Inner div for styling context and DnD */}
        <div
          style={dynamicStyles}
          className="h-full">
          {" "}
          {/* Apply CSS vars */}
          <DragDropContext onDragEnd={handleDragEnd}>
            {" "}
            {/* DnD context for REORDERING */}
            {/* Main Droppable for Root Elements */}
            <Droppable
              droppableId="elements-droppable"
              direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  // Styling for the root droppable area
                  className={`p-4 min-h-full transition-colors duration-150 ease-in-out ${
                    snapshot.isDraggingOver ? "bg-black/5 dark:bg-white/5" : ""
                  }`}>
                  {rootElements.length === 0 && !snapshot.isDraggingOver ? ( // Show placeholder only if empty AND not dragging over
                    <div
                      className="text-center py-20 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                      style={{ color: styles.textColor, opacity: 0.7 }}>
                      <p className="font-medium">Your canvas is empty!</p>
                      <p className="text-sm mt-1">Drag elements or layouts from the left panel to start building.</p>
                    </div>
                  ) : (
                    // Render Root Elements
                    rootElements.map((elem, index) => (
                      <Draggable
                        key={elem.id}
                        draggableId={elem.id}
                        index={index}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            // --- STYLE CHANGE FOR ROOT DRAGGABLE (Simplified) ---
                            className={`flex items-start mb-2 relative ${
                              snapshotDrag.isDragging
                                ? "shadow-lg bg-white dark:bg-gray-800 rounded" // Keep shadow, remove opacity/rotate
                                : ""
                            }`}
                            // --- END STYLE CHANGE ---
                          >
                            {/* Drag handle for root elements */}
                            <div
                              {...providedDrag.dragHandleProps}
                              className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none"
                              aria-label="Drag element to reorder">
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
