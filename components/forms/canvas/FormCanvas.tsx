"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { produce, enableMapSet } from "immer";

// --- Import types from the central definition ---
import type { Form, Page, ElementType } from "@/app/types/form";

// --- Import the separated component ---
import { EditableElement } from "./EditableElement";

enableMapSet(); // If you use Maps or Sets in your state

// --- Define Prop Types using Imported Types ---
export interface FormContainerProps {
  form: Form;
  setForm: (form: Form) => void; // Or React.Dispatch<React.SetStateAction<Form>> if using useState directly
  selectedElement: { element: ElementType; pageIndex: number } | null; // Use imported ElementType
  setSelectedElement: (selected: { element: ElementType; pageIndex: number } | null) => void; // Use imported ElementType
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

// Renamed component to FormContainer
export function FormContainer({ form, setForm, selectedElement, setSelectedElement, currentPageIndex, setCurrentPageIndex }: FormContainerProps) {
  const [draggedOverDropZone, setDraggedOverDropZone] = useState(false);

  // Guard against invalid currentPageIndex
  if (currentPageIndex < 0 || currentPageIndex >= form.pages.length) {
    console.error("Invalid currentPageIndex:", currentPageIndex, "Form pages:", form.pages.length);
    // setCurrentPageIndex(0); // Option: Reset to first page
    return <div className="p-4 text-red-500">Error: Invalid page index detected.</div>;
  }
  // Now safely access currentPage
  const currentPage = form.pages[currentPageIndex];

  // --- Element/Page Update Functions ---
  const updateElement = useCallback(
    (elementId: string, changes: Partial<ElementType>) => {
      try {
        const nextState = produce(form, (draft) => {
          // Added checks for draft validity
          if (!draft || !draft.pages || !draft.pages[currentPageIndex]) return;
          const page = draft.pages[currentPageIndex];
          const elementIndex = page.elements.findIndex((el) => el.id === elementId);
          if (elementIndex !== -1) {
            const existingStyles = page.elements[elementIndex].styles || {};
            const newStyles = { ...existingStyles, ...(changes.styles || {}) };
            // Safely merge properties onto the draft element
            page.elements[elementIndex] = {
              ...page.elements[elementIndex],
              ...changes,
              styles: newStyles,
            };
          }
        });
        // Only update state if produce returned a new state
        if (nextState !== form) {
          setForm(nextState);
        }
      } catch (error) {
        console.error("Failed to update element:", error);
        toast.error("Failed to update element properties.");
      }
    },
    [currentPageIndex, form, setForm] // Keep dependencies
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      try {
        const nextState = produce(form, (draft) => {
          if (!draft || !draft.pages || !draft.pages[currentPageIndex]) return;
          const page = draft.pages[currentPageIndex];
          page.elements = page.elements.filter((el) => el.id !== elementId);
        });
        if (nextState !== form) {
          setForm(nextState);
          if (selectedElement?.element.id === elementId && selectedElement.pageIndex === currentPageIndex) {
            setSelectedElement(null);
          }
        }
      } catch (error) {
        console.error("Failed to delete element:", error);
        toast.error("Failed to delete element.");
      }
    },
    [currentPageIndex, form, setForm, selectedElement, setSelectedElement]
  );

  const reorderElements = useCallback(
    (draggedId: string, targetId: string) => {
      try {
        const nextState = produce(form, (draft) => {
          if (!draft || !draft.pages || !draft.pages[currentPageIndex]) return;
          const page = draft.pages[currentPageIndex];
          const elements = page.elements;
          const draggedIndex = elements.findIndex((el) => el.id === draggedId);
          const targetIndex = elements.findIndex((el) => el.id === targetId);

          if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return;

          const [draggedItem] = elements.splice(draggedIndex, 1);
          elements.splice(targetIndex > draggedIndex ? targetIndex - 1 : targetIndex, 0, draggedItem);
        });
        if (nextState !== form) {
          setForm(nextState);
        }
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
        if (!draft || !draft.pages || !draft.pages[currentPageIndex]) return;
        const page = draft.pages[currentPageIndex];
        page.title = title;
      });
      if (nextState !== form) {
        setForm(nextState);
      }
    } catch (error) {
      console.error("Failed to update page title:", error);
      toast.error("Failed to update page title.");
    }
  };

  const addElement = useCallback(
    (element: ElementType) => {
      // Use imported ElementType
      try {
        const nextState = produce(form, (draft) => {
          if (!draft || !draft.pages || !draft.pages[currentPageIndex]) return;
          const page = draft.pages[currentPageIndex];
          page.elements.push(element);
        });
        if (nextState !== form) {
          setForm(nextState);
        }
      } catch (error) {
        console.error("Failed to add element:", error);
        toast.error("Failed to add element.");
      }
    },
    [currentPageIndex, form, setForm]
  );

  const addNewPage = () => {
    try {
      // Store length *before* mutation for navigation
      const nextPageIndex = form.pages.length;
      const nextState = produce(form, (draft) => {
        if (!draft) return;
        const newPage: Page = {
          // Use imported Page type
          id: Date.now().toString(), // Consider uuid
          title: `Page ${draft.pages.length + 1}`,
          elements: [],
        };
        draft.pages.push(newPage);
      });
      if (nextState !== form) {
        setForm(nextState);
        setCurrentPageIndex(nextPageIndex); // Navigate to the new page index
        setSelectedElement(null);
      }
    } catch (error) {
      console.error("Failed to add page:", error);
      toast.error("Failed to add new page.");
    }
  };

  // --- End Update Functions ---

  // Helper to get default styles
  const getDefaultElementStyles = (type: string): ElementType["styles"] => {
    // Use imported ElementType
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

  // Drop handler for the main drop zone
  const handleNewElementDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOverDropZone(false);
    const elementType = e.dataTransfer.getData("elementType");
    const elementId = e.dataTransfer.getData("elementId");

    if (elementType && !elementId) {
      const newElement: ElementType = {
        // Use imported ElementType
        id: Date.now().toString(),
        type: elementType,
        title: `New ${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`,
        required: false,
        styles: getDefaultElementStyles(elementType),
        options: ["select", "radio", "checkbox"].includes(elementType) ? ["Option 1", "Option 2"] : undefined,
        value: elementType === "link" ? "#" : "",
      };
      addElement(newElement);
    }
  };

  const navigatePages = (direction: number) => {
    const newIndex = currentPageIndex + direction;
    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
      setSelectedElement(null);
    }
  };

  const handleCanvasBackgroundClick = () => {
    setSelectedElement(null);
  };

  return (
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
            className="ml-auto"
            onClick={addNewPage}
            title="Add New Page">
            <Plus className="h-4 w-4 mr-1" /> Add Page
          </Button>
        </div>
      )}

      <div
        className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50"
        style={{}}
        onClick={handleCanvasBackgroundClick}>
        <div
          className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[300px]"
          style={{ background: currentPage?.background || form.background || "#f9fafb" }}
          onClick={(e) => e.stopPropagation()}>
          <Input
            value={currentPage?.title || ""}
            onChange={(e) => updatePageTitle(e.target.value)}
            className="text-2xl font-semibold mb-6 w-full border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 px-1 rounded-none bg-transparent"
            placeholder="Page Title"
          />

          <div className="space-y-1">
            {currentPage?.elements?.length === 0 ? (
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
              // Pass props matching EditableElementProps
              currentPage?.elements?.map((el) => (
                <EditableElement
                  key={el.id}
                  element={el} // This 'el' is now correctly typed via imported ElementType
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
