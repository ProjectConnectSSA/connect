"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ElementToolbar } from "./element-toolbar";
import { motion } from "framer-motion";

// Interfaces
interface FormEditorProps {
  form: Form;
  setForm: (form: Form) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

interface Form {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  condition?: Condition;
  styles?: {};
  background?: string;
}

interface Elements {
  id: string;
  title: string;
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
  };
  type: string;
  required: boolean;
  value?: string;
  column?: "left" | "right";
}

interface Condition {
  id: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
}

export function FormCanvas({ form, setForm, selectedElement, currentPageIndex, setCurrentPageIndex, setSelectedElement }: FormEditorProps) {
  const [draggedOver, setDraggedOver] = useState(false);
  const currentPage = form.pages[currentPageIndex];
  const showPageNavigation = form.isMultiPage !== false;

  // Framer Motion variants for element animations.
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  // Get the value of the condition element from user input
  const getElementValue = (elementId: string) => {
    const foundElement = currentPage.elements.find((element) => element.id === elementId);
    return foundElement?.value || "";
  };

  // Check if condition is met
  const isConditionMet = (condition: Condition) => {
    if (!condition || !condition.elementId) return false;
    const elementValue = getElementValue(condition.elementId);

    switch (condition.operator) {
      case "equals":
        return elementValue === condition.value;
      case "not_equals":
        return elementValue !== condition.value;
      case "contains":
        return elementValue.includes(condition.value);
      case "greater_than":
        return parseFloat(elementValue) > parseFloat(condition.value);
      case "less_than":
        return parseFloat(elementValue) < parseFloat(condition.value);
      default:
        return false;
    }
  };

  // Navigate between pages based on condition
  const navigatePages = (direction: number) => {
    const newIndex = currentPageIndex + direction;

    if (currentPage.condition && isConditionMet(currentPage.condition)) {
      const targetPageIndex = form.pages.findIndex((page) => page.id === currentPage.condition?.targetPageId);
      if (targetPageIndex !== -1) {
        setCurrentPageIndex(targetPageIndex);
        return;
      }
    }

    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
    }
  };

  // Add a new page
  const addNewPage = () => {
    const newPage: Pages = {
      id: Date.now().toString(),
      title: `Page ${form.pages.length + 1}`,
      elements: [],
    };

    setForm({ ...form, pages: [...form.pages, newPage] });
    setCurrentPageIndex(form.pages.length);
  };

  // Handle element drop with optional column assignment
  const handleElementDrop = (e: React.DragEvent<HTMLDivElement>, column?: "left" | "right") => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType");

    if (elementType) {
      const newElement: Elements = {
        id: Date.now().toString(),
        type: elementType,
        title: `New ${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`,
        required: true,
        styles: {
          width: "400px",
          height: "100px",
          backgroundColor: "#ffffff",
        },
        ...(column ? { column } : {}),
      };

      const updatedPages = [...form.pages];
      updatedPages[currentPageIndex].elements.push(newElement);
      setForm({ ...form, pages: updatedPages });
    }
    setDraggedOver(false);
    console.log("Element dropped", form);
  };

  // Handle page title change
  const updatePageTitle = (title: string) => {
    const updatedPages = [...form.pages];
    updatedPages[currentPageIndex].title = title;
    setForm({ ...form, pages: updatedPages });
  };

  // Render a single element wrapped in a motion.div for animation
  const renderElement = (element: Elements) => (
    <motion.div
      key={element.id}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={() => setSelectedElement({ element, pageIndex: currentPageIndex })}
      className={cn(
        "p-4 rounded-lg border transition-all cursor-pointer hover:border-blue-500",
        selectedElement?.element.id === element.id && "ring-2 ring-blue-500"
      )}
      style={element.styles}>
      <div className="flex flex-col gap-2">
        <Label>{element.type}</Label>
        {(() => {
          switch (element.type) {
            case "text":
              return <Input placeholder="Enter text" />;
            case "checkbox":
              return <input type="checkbox" />;
            case "date":
              return <input type="date" />;
            case "rating":
              return <div>⭐ Rating Field</div>;
            case "select":
              return (
                <select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              );
            case "phone":
              return (
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                />
              );
            case "email":
              return (
                <Input
                  type="email"
                  placeholder="Enter email"
                />
              );
            case "image":
              return (
                <input
                  type="file"
                  accept="image/*"
                />
              );
            default:
              return <div>Unsupported element</div>;
          }
        })()}
      </div>
    </motion.div>
  );

  // Render elements differently based on number of columns.
  const renderElements = () => {
    if (form.styles?.columns === 2) {
      const leftElements = currentPage.elements.filter((el) => !el.column || el.column === "left");
      const rightElements = currentPage.elements.filter((el) => el.column === "right");
      return (
        <div className="grid grid-cols-2 gap-4">
          {/* Left Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDraggedOver(true);
            }}
            onDragLeave={() => setDraggedOver(false)}
            onDrop={(e) => handleElementDrop(e, "left")}
            className={cn("min-h-[200px] border-2 border-dashed rounded-lg p-4 transition-all", draggedOver && "ring-2 ring-blue-500")}>
            {leftElements.length === 0 ? (
              <div className="text-center text-gray-500">Drop element here (Left Column)</div>
            ) : (
              leftElements.map(renderElement)
            )}
          </div>
          {/* Right Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDraggedOver(true);
            }}
            onDragLeave={() => setDraggedOver(false)}
            onDrop={(e) => handleElementDrop(e, "right")}
            className={cn("min-h-[200px] border-2 border-dashed rounded-lg p-4 transition-all", draggedOver && "ring-2 ring-blue-500")}>
            {rightElements.length === 0 ? (
              <div className="text-center text-gray-500">Drop element here (Right Column)</div>
            ) : (
              rightElements.map(renderElement)
            )}
          </div>
        </div>
      );
    }
    // Single column layout
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDraggedOver(true);
        }}
        onDragLeave={() => setDraggedOver(false)}
        onDrop={(e) => handleElementDrop(e)}
        className={cn("min-h-[400px] border-2 border-dashed rounded-lg p-6 transition-all", draggedOver && "ring-2 ring-blue-500")}>
        {currentPage.elements.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-500">Drag elements here</div>
        ) : (
          currentPage.elements.map(renderElement)
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <ElementToolbar />

      {/* Navigation */}
      {showPageNavigation && (
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigatePages(-1)}
                disabled={currentPageIndex === 0}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPageIndex + 1} of {form.pages.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigatePages(1)}
                disabled={currentPageIndex === form.pages.length - 1}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={addNewPage}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <div
          className="max-w-2xl mx-auto"
          style={{
            width: form.styles?.width || "100%",
            height: form.styles?.height || "auto",
          }}>
          <div className={`${form.styles?.columns === 2 ? "" : "grid-cols-1"}`}>
            <Card
              className={cn("min-h-[400px] transition-all")}
              style={{
                ...currentPage.styles,
                backgroundColor: currentPage.background || "#ffffff",
              }}>
              <div className="p-6 space-y-6">
                <Input
                  value={currentPage.title}
                  onChange={(e) => updatePageTitle(e.target.value)}
                  className="text-xl font-semibold"
                />
                {renderElements()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
