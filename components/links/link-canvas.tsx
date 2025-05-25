// src/components/links/link-canvas.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { BioElement, BioElementType, StyleProps } from "@/app/types/links/types";
import { Smartphone, Monitor, GripVertical, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId?: string, targetColumnIndex?: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
  onReorderElements: (newElements: BioElement[]) => void;
}

interface DragContext {
  layoutId: string;
  colIndex: number;
}

interface ElementGroups {
  rootElements: BioElement[];
  columnElements: Map<string, BioElement[]>;
  layoutContainers: BioElement[];
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

const BORDER_RADIUS_MAP = {
  None: "0px",
  Small: "0.125rem",
  Medium: "0.375rem",
  Large: "0.5rem",
  Full: "9999px",
} as const;

const DROPPABLE_IDS = {
  ROOT: "elements-droppable",
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getColumnDroppableId = (layoutElementId: string, columnIndex: number): string => {
  return `${layoutElementId}-col-${columnIndex}`;
};

const parseColumnDroppableId = (droppableId: string): DragContext | null => {
  const match = droppableId.match(/(.+)-col-(\d+)/);
  if (match && match.length === 3) {
    return { layoutId: match[1], colIndex: parseInt(match[2], 10) };
  }
  return null;
};

const findElementById = (elements: BioElement[], id: string): { element: BioElement; index: number } | null => {
  const index = elements.findIndex((el) => el.id === id);
  return index !== -1 ? { element: elements[index], index } : null;
};

const createDynamicStyles = (styles: StyleProps): React.CSSProperties =>
  ({
    "--bg-color": styles.backgroundColor,
    "--text-color": styles.textColor,
    "--button-color": styles.buttonColor,
    "--button-text-color": styles.buttonTextColor,
    "--border-radius-val": BORDER_RADIUS_MAP[styles.borderRadius as keyof typeof BORDER_RADIUS_MAP] || BORDER_RADIUS_MAP.Medium,
    fontFamily: styles.fontFamily,
  } as React.CSSProperties);

// ============================================================================
// DRAG AND DROP UTILITIES
// ============================================================================

const validateDragOperation = (result: DropResult): boolean => {
  const { source, destination } = result;
  return !(!destination || (source.droppableId === destination.droppableId && source.index === destination.index));
};

const updateElementParentage = (element: BioElement, isMovingToRoot: boolean, destColInfo: DragContext | null): void => {
  if (isMovingToRoot) {
    delete element.parentId;
    delete element.columnIndex;
  } else if (destColInfo) {
    element.parentId = destColInfo.layoutId;
    element.columnIndex = destColInfo.colIndex;
  }
};

const groupElementsByContext = (elements: BioElement[], originalElements: BioElement[]): ElementGroups => {
  const rootElements = elements.filter((el) => !el.parentId).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const columnElements = new Map<string, BioElement[]>();
  const layoutContainers = originalElements.filter((el) => el.type.startsWith("layout-"));

  elements.forEach((el) => {
    if (el.parentId && el.columnIndex !== undefined) {
      const parentExists = originalElements.some((parent) => parent.id === el.parentId);
      if (parentExists) {
        const key = getColumnDroppableId(el.parentId, el.columnIndex);
        if (!columnElements.has(key)) {
          columnElements.set(key, []);
        }
        columnElements.get(key)!.push(el);
      } else {
        console.warn(`Orphan element excluded: ${el.id}, missing parent ${el.parentId}`);
      }
    }
  });

  columnElements.forEach((columnList) => {
    columnList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });

  return { rootElements, columnElements, layoutContainers };
};

const insertElementAtDestination = (
  groups: ElementGroups,
  draggedElement: BioElement,
  destination: { droppableId: string; index: number },
  isMovingToRoot: boolean
): void => {
  if (isMovingToRoot) {
    groups.rootElements.splice(destination.index, 0, draggedElement);
  } else {
    const destKey = destination.droppableId;
    if (!groups.columnElements.has(destKey)) {
      groups.columnElements.set(destKey, []);
    }
    groups.columnElements.get(destKey)!.splice(destination.index, 0, draggedElement);
  }
};

const assignOrderNumbers = (groups: ElementGroups): void => {
  groups.rootElements.forEach((el, index) => {
    el.order = index;
  });

  groups.columnElements.forEach((columnList) => {
    columnList.forEach((el, index) => {
      el.order = index;
    });
  });
};

const buildFinalElementsArray = (groups: ElementGroups): BioElement[] => [
  ...groups.rootElements,
  ...Array.from(groups.columnElements.values()).flat(),
  ...groups.layoutContainers,
];

const reconcileMissingElements = (
  finalElements: BioElement[],
  originalElements: BioElement[]
): { elements: BioElement[]; hadMissingElements: boolean } => {
  const finalIds = new Set(finalElements.map((el) => el.id));
  let hadMissingElements = false;

  originalElements.forEach((originalEl) => {
    if (!finalIds.has(originalEl.id)) {
      console.warn(`Missing element ${originalEl.id} (${originalEl.type}) added back`);
      finalElements.push(originalEl);
      hadMissingElements = true;
    }
  });

  return { elements: finalElements, hadMissingElements };
};

// ============================================================================
// ELEMENT RENDERER
// ============================================================================

interface ElementRendererProps {
  element: BioElement;
  isNested: boolean;
  styles: StyleProps;
  updateElement: (id: string, updatedData: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isNested, styles, updateElement, deleteElement }) => {
  const commonProps = {
    key: element.id,
    element,
    styles,
    updateElement,
    deleteElement,
    isNested,
  };

  const elementComponents = {
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
  } as const;

  const Component = elementComponents[element.type as keyof typeof elementComponents];

  if (Component) {
    return <Component {...commonProps} />;
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
// LAYOUT COMPONENTS
// ============================================================================

interface LayoutElementProps {
  element: BioElement;
  getChildrenForLayoutColumn: (layoutId: string, colIndex: number) => BioElement[];
  deleteElement: (id: string) => void;
  renderElement: (elem: BioElement, isNested?: boolean) => JSX.Element | null;
}

const LayoutElement: React.FC<LayoutElementProps> = ({ element, getChildrenForLayoutColumn, deleteElement, renderElement }) => {
  const numColumns = element.type === "layout-single-column" ? 1 : 2;
  const layoutTitle = element.type === "layout-single-column" ? "Single Column Row" : "Two Column Row";

  return (
    <div className="layout-container bg-gray-500/5 dark:bg-gray-500/10 border border-dashed border-gray-400 dark:border-gray-600 p-2 rounded-md my-2">
      {/* Layout Header */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1 flex justify-between items-center">
        <span className="font-medium">{layoutTitle}</span>
        {!element.parentId && (
          <button
            onClick={() => deleteElement(element.id)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition"
            aria-label="Delete Layout Row">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Columns Grid */}
      <div className={`grid gap-3 ${numColumns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {Array.from({ length: numColumns }).map((_, colIndex) => {
          const columnChildren = getChildrenForLayoutColumn(element.id, colIndex);

          return (
            <Droppable
              key={colIndex}
              droppableId={getColumnDroppableId(element.id, colIndex)}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`column-droppable min-h-[70px] border-2 border-dashed rounded-md p-2 transition-colors duration-150 ease-in-out ${
                    snapshot.isDraggingOver
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  data-layout-id={element.id}
                  data-column-index={colIndex}>
                  {columnChildren.length > 0
                    ? columnChildren.map((childElem, index) => (
                        <Draggable
                          key={childElem.id}
                          draggableId={childElem.id}
                          index={index}>
                          {(providedDrag, snapshotDrag) => (
                            <div
                              ref={providedDrag.innerRef}
                              {...providedDrag.draggableProps}
                              className={`flex items-start mb-2 ${snapshotDrag.isDragging ? "shadow-md bg-white dark:bg-gray-700 rounded" : ""}`}>
                              <div
                                {...providedDrag.dragHandleProps}
                                className="cursor-grab mr-2 pt-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 touch-none"
                                aria-label="Drag element to reorder">
                                <GripVertical size={18} />
                              </div>
                              <div className="flex-1">{renderElement(childElem, true)}</div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    : !snapshot.isDraggingOver && (
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

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const dynamicStyles = useMemo(() => createDynamicStyles(styles), [styles]);

  const rootElements = useMemo(() => {
    const elementIds = new Set(elements.map((el) => el.id));
    return elements.filter((el) => !el.parentId || !elementIds.has(el.parentId)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [elements]);

  // ============================================================================
  // CALLBACK FUNCTIONS
  // ============================================================================

  const getChildrenForLayoutColumn = useCallback(
    (layoutId: string, colIndex: number): BioElement[] => {
      return elements.filter((el) => el.parentId === layoutId && el.columnIndex === colIndex).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
    [elements]
  );

  const renderElement = useCallback(
    (element: BioElement, isNested: boolean = false): JSX.Element | null => {
      // Handle layout elements
      if (element.type.startsWith("layout-")) {
        return (
          <LayoutElement
            key={element.id}
            element={element}
            getChildrenForLayoutColumn={getChildrenForLayoutColumn}
            deleteElement={deleteElement}
            renderElement={renderElement}
          />
        );
      }

      // Handle standard elements
      return (
        <ElementRenderer
          key={element.id}
          element={element}
          isNested={isNested}
          styles={styles}
          updateElement={updateElement}
          deleteElement={deleteElement}
        />
      );
    },
    [styles, updateElement, deleteElement, getChildrenForLayoutColumn]
  );

  // ============================================================================
  // DRAG AND DROP HANDLERS
  // ============================================================================

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!validateDragOperation(result)) return;

      const { source, destination, draggableId } = result;
      console.log("Drag operation:", { source, destination, draggableId });

      const updatedElements = [...elements];
      const draggedElementData = findElementById(updatedElements, draggableId);

      if (!draggedElementData) {
        console.error("Dragged element not found for reordering!");
        return;
      }

      const [draggedElement] = updatedElements.splice(draggedElementData.index, 1);
      const destColInfo = parseColumnDroppableId(destination!.droppableId);
      const isMovingToRoot = destination!.droppableId === DROPPABLE_IDS.ROOT;

      if (!isMovingToRoot && !destColInfo) {
        console.error("Invalid destination context");
        return;
      }

      updateElementParentage(draggedElement, isMovingToRoot, destColInfo);
      const elementGroups = groupElementsByContext(updatedElements, elements);
      insertElementAtDestination(elementGroups, draggedElement, destination!, isMovingToRoot);
      assignOrderNumbers(elementGroups);

      let finalElements = buildFinalElementsArray(elementGroups);
      const reconciliationResult = reconcileMissingElements(finalElements, elements);
      finalElements = reconciliationResult.elements;

      console.log(`Final elements: ${finalElements.length}, Original: ${elements.length}`);
      onReorderElements(finalElements);
    },
    [elements, onReorderElements]
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      const columnDroppable = target.closest(".column-droppable");

      if (columnDroppable) {
        const targetId = columnDroppable.getAttribute("data-layout-id") ?? undefined;
        const colIndexStr = columnDroppable.getAttribute("data-column-index");
        const targetColumnIndex = colIndexStr ? parseInt(colIndexStr, 10) : undefined;

        if (targetId !== undefined && targetColumnIndex !== undefined) {
          console.log("Canvas Drop Event - Column:", { targetId, targetColumnIndex });
          onDrop(e, targetId, targetColumnIndex);
          return;
        }
      }

      const mainCanvasContainer = target.closest(".preview-scroll-container");
      if (mainCanvasContainer) {
        console.log("Canvas Drop Event - Root");
        onDrop(e, undefined, undefined);
      }
    },
    [onDrop]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

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
          backgroundColor: styles.backgroundColor,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onDrop={handleCanvasDrop}
        onDragOver={onDragOver}>
        <div
          style={dynamicStyles}
          className="h-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId={DROPPABLE_IDS.ROOT}
              direction="vertical">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-full transition-colors duration-150 ease-in-out ${
                    snapshot.isDraggingOver ? "bg-black/5 dark:bg-white/5" : ""
                  }`}>
                  {rootElements.length === 0 && !snapshot.isDraggingOver ? (
                    <div
                      className="text-center py-20 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
                      style={{ color: styles.textColor, opacity: 0.7 }}>
                      <p className="font-medium">Your canvas is empty!</p>
                      <p className="text-sm mt-1">Drag elements or layouts from the left panel to start building.</p>
                    </div>
                  ) : (
                    rootElements.map((elem, index) => (
                      <Draggable
                        key={elem.id}
                        draggableId={elem.id}
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
                            <div className="flex-1">{renderElement(elem, false)}</div>
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
