"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, ArrowRight, Trash2, GripVertical, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { ElementToolbar } from "./element-toolbar";
import { motion } from "framer-motion";
import supabase from "@/lib/supabaseClient";

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
  styles?: Record<string, any>;
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

// Motion variants for animations.
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Editable element component with drag handle and selection support.
const EditableElement = ({
  element,
  selectedElement,
  updateElement,
  deleteElement,
  reorderElements,
  setSelectedElement,
  currentPageIndex,
}: {
  element: Elements;
  selectedElement: any;
  updateElement: (id: string, changes: Partial<Elements>) => void;
  deleteElement: (id: string) => void;
  reorderElements: (draggedId: string, targetId: string) => void;
  setSelectedElement: (sel: any) => void;
  currentPageIndex: number;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Delete any existing image.
      if (element.value) {
        try {
          const urlObj = new URL(element.value);
          const parts = urlObj.pathname.split("formImage/");
          if (parts.length === 2) {
            const oldFileName = parts[1];
            const { error: removeError } = await supabase.storage.from("formImage").remove([oldFileName]);
            if (removeError) console.error("Error deleting old image:", removeError);
          }
        } catch (error) {
          console.error("Error parsing old image URL:", error);
        }
      }

      const fileName = `${element.id}-${file.name}`;
      const { error } = await supabase.storage.from("formImage").upload(fileName, file);
      if (error) {
        console.error("Error uploading image:", error);
        return;
      }
      const { data } = supabase.storage.from("formImage").getPublicUrl(fileName);
      updateElement(element.id, { value: data.publicUrl });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (element.type === "image" && element.value) {
      try {
        const urlObj = new URL(element.value);
        const parts = urlObj.pathname.split("formImage/");
        if (parts.length === 2) {
          const oldFileName = parts[1];
          const { error: removeError } = await supabase.storage.from("formImage").remove([oldFileName]);
          if (removeError) console.error("Error deleting image from bucket:", removeError);
        }
      } catch (error) {
        console.error("Error parsing image URL:", error);
      }
    }
    deleteElement(element.id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", element.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId && draggedId !== element.id) {
      reorderElements(draggedId, element.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedElement?.element?.id !== element.id) {
      setSelectedElement({ element, pageIndex: currentPageIndex });
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}>
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={cn(
          "mb-4 p-4 rounded-lg shadow-lg bg-white flex items-start cursor-move",
          selectedElement?.element?.id === element.id && "ring-2 ring-blue-500"
        )}>
        {/* Drag Handle */}
        <div className="mr-4 flex-shrink-0">
          <GripVertical className="h-6 w-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <Input
              value={element.title}
              onChange={(e) => updateElement(element.id, { title: e.target.value })}
              placeholder="Element Label"
              className="flex-1 mr-4 border-none rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
          <div>
            {(() => {
              switch (element.type) {
                case "text":
                  return (
                    <Input
                      placeholder="Enter text"
                      style={{
                        backgroundColor: element.styles.backgroundColor || "#f9f9f9",
                      }}
                      className="border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  );
                case "checkbox":
                  return (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                      />
                      <span className="text-gray-700">Checkbox</span>
                    </label>
                  );
                case "date":
                  return (
                    <input
                      type="date"
                      className="border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  );
                case "rating":
                  return (
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          className="text-gray-400 hover:text-yellow-400 text-xl">
                          ★
                        </motion.button>
                      ))}
                    </div>
                  );
                case "select":
                  return (
                    <select
                      style={{
                        backgroundColor: element.styles.backgroundColor || "#f9f9f9",
                      }}
                      className="border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500">
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  );
                case "phone":
                  return (
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      style={{
                        backgroundColor: element.styles.backgroundColor || "#f9f9f9",
                      }}
                      className="border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  );
                case "email":
                  return (
                    <Input
                      type="email"
                      placeholder="Enter email"
                      style={{
                        backgroundColor: element.styles.backgroundColor || "#f9f9f9",
                      }}
                      className="border-none rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  );
                case "image":
                  return (
                    <div className="space-y-2">
                      {uploading ? (
                        <div className="flex items-center gap-2">
                          <Loader className="animate-spin h-5 w-5 text-gray-500" />
                          <span>Uploading image...</span>
                        </div>
                      ) : element.value ? (
                        <>
                          <img
                            src={element.value}
                            alt="Uploaded"
                            style={{ maxWidth: "100%", height: "auto" }}
                            className="rounded-lg"
                          />
                          <Button
                            size="sm"
                            onClick={triggerFileSelect}>
                            Replace Image
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={triggerFileSelect}>
                          Upload Image
                        </Button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  );
                case "yesno":
                  return (
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg focus:ring-2 focus:ring-green-300">
                        Yes
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg focus:ring-2 focus:ring-red-300">
                        No
                      </motion.button>
                    </div>
                  );
                default:
                  return <div>Unsupported element</div>;
              }
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function FormCanvas({ form, setForm, selectedElement, currentPageIndex, setCurrentPageIndex, setSelectedElement }: FormEditorProps) {
  const [draggedOver, setDraggedOver] = useState(false);
  const currentPage = form.pages[currentPageIndex];

  const updateElement = useCallback(
    (elementId: string, changes: Partial<Elements>) => {
      const updatedElements = currentPage.elements.map((el) => (el.id === elementId ? { ...el, ...changes } : el));
      const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, elements: updatedElements } : page));
      setForm({ ...form, pages: updatedPages });
    },
    [currentPage, currentPageIndex, form, setForm]
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      const updatedElements = currentPage.elements.filter((el) => el.id !== elementId);
      const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, elements: updatedElements } : page));
      setForm({ ...form, pages: updatedPages });
    },
    [currentPage, currentPageIndex, form, setForm]
  );

  const reorderElements = useCallback(
    (draggedId: string, targetId: string) => {
      const elements = [...currentPage.elements];
      const draggedIndex = elements.findIndex((el) => el.id === draggedId);
      const targetIndex = elements.findIndex((el) => el.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return;
      const [draggedItem] = elements.splice(draggedIndex, 1);
      elements.splice(targetIndex, 0, draggedItem);
      const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, elements } : page));
      setForm({ ...form, pages: updatedPages });
    },
    [currentPage, currentPageIndex, form, setForm]
  );

  const updatePageTitle = (title: string) => {
    const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, title } : page));
    setForm({ ...form, pages: updatedPages });
  };

  const renderElements = () => {
    return (
      <div className="flex flex-col gap-4">
        {currentPage.elements.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-500">Drag elements here</div>
        ) : (
          currentPage.elements.map((el) => (
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
    );
  };

  const handleNewElementDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType");
    if (elementType) {
      const newElement: Elements = {
        id: Date.now().toString(),
        type: elementType,
        title: "New " + elementType.charAt(0).toUpperCase() + elementType.slice(1),
        required: true,
        styles: {
          width: "100%",
          height: "40px",
          backgroundColor: "#f0f0f0",
        },
      };
      const updatedPages = form.pages.map((page, index) =>
        index === currentPageIndex ? { ...page, elements: [...page.elements, newElement] } : page
      );
      setForm({ ...form, pages: updatedPages });
    }
    setDraggedOver(false);
  };

  const addNewPage = () => {
    const newPage: Pages = {
      id: Date.now().toString(),
      title: `Page ${form.pages.length + 1}`,
      elements: [],
    };
    setForm({ ...form, pages: [...form.pages, newPage] });
  };

  const navigatePages = (direction: number) => {
    const newIndex = currentPageIndex + direction;
    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-gray-50">
      <ElementToolbar />
      <div className="flex flex-col ">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="rounded-full p-3"
              onClick={() => navigatePages(-1)}
              disabled={currentPageIndex === 0}>
              <ArrowLeft className="h-8 w-8" />
            </Button>
            <span className="text-lg font-medium text-gray-700">
              Page {currentPageIndex + 1} of {form.pages.length}
            </span>
            <Button
              variant="ghost"
              className="rounded-full p-3"
              onClick={() => navigatePages(1)}
              disabled={currentPageIndex === form.pages.length - 1}>
              <ArrowRight className="h-8 w-8" />
            </Button>
          </div>
          {/* Add Page Button placed at the top right (outside card) */}
          <Button
            variant="outline"
            className="rounded-full p-3"
            onClick={addNewPage}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        {/* Form Content Card */}
        <Card
          className="shadow-lg border-0 overflow-auto w-full"
          style={{ maxHeight: "calc(100vh - 400px)", width: "100%", backgroundColor: currentPage.background || "#ffffff" }}>
          <div className="p-6">
            <Input
              value={currentPage.title}
              onChange={(e) => updatePageTitle(e.target.value)}
              className="text-2xl font-bold mb-6 w-full"
              placeholder="Page Title"
              onClick={(e) => e.stopPropagation()}
            />
            {renderElements()}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDraggedOver(true);
              }}
              onDragLeave={() => setDraggedOver(false)}
              onDrop={handleNewElementDrop}
              className={`mt-6 flex items-center justify-center p-4 border-2 border-dashed rounded-lg transition-all ${
                draggedOver ? "ring-2 ring-blue-500" : "border-gray-300"
              }`}>
              Drag element here
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
