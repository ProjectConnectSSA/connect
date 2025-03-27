"use client";

import { useState, useCallback } from "react"; // Removed useRef as it's now in EditableElement
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react"; // Removed unused icons
// import { cn } from "@/lib/utils"; // Removed if not used directly here
// import { motion } from "framer-motion"; // Removed if not used directly here
// import { supabase } from "@/lib/supabaseClient"; // Removed, handled in EditableElement

// --- Import the separated component ---
import { EditableElement } from "./EditableElement";
import { toast } from "sonner"; // Added for potential user feedback

// --- Original Interfaces ---
// NOTE: These should ideally be moved to a central types file.
export interface Form {
  id?: string; // Added ID based on previous suggestions
  title: string;
  description: string;
  pages: Page[];
  background?: string;
  formType?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

export interface Page {
  id: string;
  title: string;
  elements: ElementType[];
  styles?: Record<string, any>;
  background?: string;
}

export interface ElementType {
  id: string;
  title: string;
  // Added options based on previous suggestions
  options?: string[];
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
    // Allow other style props
    [key: string]: any;
  };
  type: string;
  required: boolean;
  value?: string | number | boolean | string[]; // Allow different value types
  column?: "left" | "right";
}
// --- End Original Interfaces ---

// Props for the container component
export interface FormContainerProps {
  // Renamed interface to match component
  form: Form;
  setForm: (form: Form) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

// Renamed component to FormContainer as requested
export function FormContainer({ form, setForm, selectedElement, setSelectedElement, currentPageIndex, setCurrentPageIndex }: FormContainerProps) {
  const [draggedOverDropZone, setDraggedOverDropZone] = useState(false); // State for the main drop zone

  // Guard against invalid currentPageIndex
  if (currentPageIndex < 0 || currentPageIndex >= form.pages.length) {
    console.error("Invalid currentPageIndex:", currentPageIndex, "Form pages:", form.pages.length);
    // Optionally reset to 0 or show error
    // setCurrentPageIndex(0);
    return <div className="p-4 text-red-500">Error: Invalid page index detected.</div>;
  }
  const currentPage = form.pages[currentPageIndex];

  // --- Element/Page Update Functions (using Immer for safety/simplicity) ---
  // npm install immer
  // yarn add immer
  // If you don't want immer, revert to the map-based updates as before.
  const updateElement = useCallback(
    (elementId: string, changes: Partial<ElementType>) => {
      try {
        const nextState = produce(form, (draft) => {
          const page = draft.pages[currentPageIndex];
          if (!page) return;
          const elementIndex = page.elements.findIndex((el) => el.id === elementId);
          if (elementIndex !== -1) {
            // Merge styles carefully
            const existingStyles = page.elements[elementIndex].styles || {};
            const newStyles = { ...existingStyles, ...(changes.styles || {}) };
            page.elements[elementIndex] = {
              ...page.elements[elementIndex],
              ...changes,
              styles: newStyles, // Ensure styles are merged
            };
          }
        });
        setForm(nextState);
      } catch (error) {
        console.error("Failed to update element:", error);
        toast.error("Failed to update element properties.");
      }
    },
    [currentPageIndex, form, setForm]
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      try {
        const nextState = produce(form, (draft) => {
          const page = draft.pages[currentPageIndex];
          if (!page) return;
          page.elements = page.elements.filter((el) => el.id !== elementId);
        });
        setForm(nextState);
        // Clear selection if the deleted element was selected
        if (selectedElement?.element.id === elementId && selectedElement.pageIndex === currentPageIndex) {
          setSelectedElement(null);
        }
      } catch (error) {
        console.error("Failed to delete element:", error);
        toast.error("Failed to delete element.");
      }
    },
    [currentPageIndex, form, setForm, selectedElement, setSelectedElement] // Add dependencies
  );

  const reorderElements = useCallback(
    (draggedId: string, targetId: string) => {
      try {
        const nextState = produce(form, (draft) => {
          const page = draft.pages[currentPageIndex];
          if (!page) return;

          const elements = page.elements;
          const draggedIndex = elements.findIndex((el) => el.id === draggedId);
          const targetIndex = elements.findIndex((el) => el.id === targetId);

          if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

          const [draggedItem] = elements.splice(draggedIndex, 1);
          // Insert *before* the target element
          elements.splice(targetIndex > draggedIndex ? targetIndex - 1 : targetIndex, 0, draggedItem);
          // If you want to insert *after*, adjust the splice index:
          // elements.splice(targetIndex > draggedIndex ? targetIndex : targetIndex + 1, 0, draggedItem);
        });
        setForm(nextState);
      } catch (error) {
        console.error("Failed to reorder elements:", error);
        toast.error("Failed to reorder elements.");
      }
    },
    [currentPageIndex, form, setForm]
  );

  const updatePageTitle = (title: string) => {
    try {
      const nextState = produce(form, (draft) => {
        const page = draft.pages[currentPageIndex];
        if (page) {
          page.title = title;
        }
      });
      setForm(nextState);
    } catch (error) {
      console.error("Failed to update page title:", error);
      toast.error("Failed to update page title.");
    }
  };

  const addElement = useCallback(
    (element: ElementType) => {
      try {
        const nextState = produce(form, (draft) => {
          const page = draft.pages[currentPageIndex];
          if (page) {
            page.elements.push(element);
          }
        });
        setForm(nextState);
      } catch (error) {
        console.error("Failed to add element:", error);
        toast.error("Failed to add element.");
      }
    },
    [currentPageIndex, form, setForm]
  );

  const addNewPage = () => {
    try {
      const nextState = produce(form, (draft) => {
        const newPage: Page = {
          id: Date.now().toString(), // Consider uuid for more robust IDs
          title: `Page ${draft.pages.length + 1}`,
          elements: [],
        };
        draft.pages.push(newPage);
      });
      setForm(nextState);
      // Optionally navigate to the new page
      setCurrentPageIndex(form.pages.length); // Index will be length before push
      setSelectedElement(null); // Clear selection when adding page
    } catch (error) {
      console.error("Failed to add page:", error);
      toast.error("Failed to add new page.");
    }
  };
  // --- End Update Functions ---

  // Helper to get default styles
  const getDefaultElementStyles = (type: string): ElementType["styles"] => {
    // Basic default styles, customize as needed
    switch (type) {
      case "text":
      case "email":
      case "phone":
      case "date":
      case "select":
        return { width: "100%", padding: "8px", border: "1px solid #d1d5db", borderRadius: "4px" };
      case "button":
        return {
          width: "auto",
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        };
      case "image":
        return { width: "150px", height: "auto", objectFit: "contain" };
      default:
        return { width: "100%" };
    }
  };

  // Drop handler for the main drop zone (adds new elements)
  const handleNewElementDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverDropZone(false);
    const elementType = e.dataTransfer.getData("elementType"); // Type from toolbar
    const elementId = e.dataTransfer.getData("elementId"); // ID if dragging existing element

    // Only add if it's a NEW element type from the toolbar
    if (elementType && !elementId) {
      const newElement: ElementType = {
        id: Date.now().toString(), // Consider uuid
        type: elementType,
        title: `New ${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`,
        required: false, // Default required to false
        styles: getDefaultElementStyles(elementType),
        // Add default options for relevant types
        options: ["select", "radio", "checkbox"].includes(elementType) ? ["Option 1", "Option 2"] : undefined,
        value: elementType === "link" ? "#" : "", // Default value for link
      };
      addElement(newElement); // Use the addElement action
    }
  };

  const navigatePages = (direction: number) => {
    const newIndex = currentPageIndex + direction;
    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
      setSelectedElement(null); // Clear selection on page change
    }
  };

  // Clear selection when clicking canvas background
  const handleCanvasBackgroundClick = () => {
    setSelectedElement(null);
  };

  return (
    // Removed outer div, adjust layout in parent component (EditFormPage)
    // Page Navigation (conditional on multi-page)
    <>
      {form.isMultiPage && (
        <div className="bg-gray-100 border-b p-2 flex items-center justify-center gap-4 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigatePages(-1)}
            disabled={currentPageIndex === 0}
            title="Previous Page">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPageIndex + 1} / {form.pages.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigatePages(1)}
            disabled={currentPageIndex === form.pages.length - 1}
            title="Next Page">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto" // Push Add Page button to the right
            onClick={addNewPage}
            title="Add New Page">
            <Plus className="h-4 w-4 mr-1" /> Add Page
          </Button>
        </div>
      )}

      {/* Form Canvas Area - Make it scrollable and clear selection on click */}
      <div
        className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50" // Allow canvas content to scroll
        style={{ background: currentPage?.background || form.background || "#f9fafb" }} // Apply page or form background
        onClick={handleCanvasBackgroundClick}>
        {/* Inner container for the form appearance */}
        <div
          className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]" // Added min-height
          style={{ ...form.styles, ...currentPage?.styles }} // Apply form/page styles (width, etc.)
          onClick={(e) => e.stopPropagation()} // Prevent background click when clicking form area itself
        >
          {/* Page Title Input */}
          <Input
            value={currentPage?.title || ""}
            onChange={(e) => updatePageTitle(e.target.value)}
            className="text-2xl font-semibold mb-6 w-full border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 px-1 rounded-none bg-transparent"
            placeholder="Page Title"
          />

          {/* Render Elements */}
          <div className="space-y-1">
            {" "}
            {/* Adjust spacing as needed */}
            {currentPage?.elements?.length === 0 ? (
              // Placeholder when empty, also acts as part of the drop zone
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggedOverDropZone(true);
                  e.dataTransfer.dropEffect = "copy";
                }}
                onDragLeave={() => setDraggedOverDropZone(false)}
                onDrop={handleNewElementDrop}
                className={`h-32 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg transition-colors ${
                  draggedOverDropZone ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}>
                Drag your first element here
              </div>
            ) : (
              currentPage?.elements?.map((el) => (
                <EditableElement
                  key={el.id}
                  element={el}
                  selectedElement={selectedElement}
                  updateElement={updateElement}
                  deleteElement={deleteElement}
                  reorderElements={reorderElements}
                  setSelectedElement={setSelectedElement}
                  currentPageIndex={currentPageIndex}
                />
              ))
            )}
          </div>

          {/* Drop Zone for adding new elements (only shown if elements exist) */}
          {currentPage?.elements?.length > 0 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOverDropZone(true);
                e.dataTransfer.dropEffect = "copy";
              }}
              onDragLeave={() => setDraggedOverDropZone(false)}
              onDrop={handleNewElementDrop}
              className={`mt-6 p-6 border-2 border-dashed rounded-lg text-center text-gray-400 transition-colors duration-200 ${
                draggedOverDropZone ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}>
              Drag new elements here
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// --- Utility or Hook for Immer (Optional but recommended) ---
// You can place this in a separate hooks file or keep it here if simple
import { produce, enableMapSet } from "immer";

enableMapSet(); // If you use Maps or Sets in your state

// --- End Immer Utility ---
