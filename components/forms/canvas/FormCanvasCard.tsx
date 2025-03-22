"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ElementToolbar } from "./element-toolbar";
import { Form, Page, ElementType, FormCanvasProps } from "./FormCanvasTraditional"; // shared interfaces

const EditableElement = ({
  element,
  selectedElement,
  updateElement,
  deleteElement,
  setSelectedElement,
  currentPageIndex,
}: {
  element: ElementType;
  selectedElement: any;
  updateElement: (id: string, changes: Partial<ElementType>) => void;
  deleteElement: (id: string) => void;
  setSelectedElement: (sel: any) => void;
  currentPageIndex: number;
}) => {
  const handleDelete = () => {
    deleteElement(element.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedElement?.element?.id !== element.id) {
      setSelectedElement({ element, pageIndex: currentPageIndex });
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`mb-4 p-4 rounded-lg shadow-md bg-white cursor-pointer ${
        selectedElement?.element?.id === element.id ? "ring-2 ring-green-500" : ""
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between">
        <Input
          value={element.title}
          onChange={(e) => updateElement(element.id, { title: e.target.value })}
          placeholder="Element Label"
          className="flex-1 mr-4 border-none rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}>
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </motion.div>
  );
};

export function FormCanvasCard({ form, setForm, selectedElement, setSelectedElement, currentPageIndex, setCurrentPageIndex }: FormCanvasProps) {
  const currentPage = form.pages[currentPageIndex];

  const updateElement = useCallback(
    (elementId: string, changes: Partial<ElementType>) => {
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

  const updatePageTitle = (title: string) => {
    const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, title } : page));
    setForm({ ...form, pages: updatedPages });
  };

  const addNewElement = () => {
    const newElement: ElementType = {
      id: Date.now().toString(),
      type: "text",
      title: "New Element",
      required: true,
      styles: {
        width: "100%",
        height: "40px",
        backgroundColor: "#fff",
      },
    };
    const updatedPages = form.pages.map((page, index) => (index === currentPageIndex ? { ...page, elements: [...page.elements, newElement] } : page));
    setForm({ ...form, pages: updatedPages });
  };

  const addNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: `Card Page ${form.pages.length + 1}`,
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
    <div className="h-full flex flex-col gap-4 p-4 bg-gray-100">
      <ElementToolbar />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full p-3"
            onClick={() => navigatePages(-1)}
            disabled={currentPageIndex === 0}>
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <span className="text-lg font-medium text-green-700">
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
        <Button
          variant="outline"
          className="rounded-full p-3"
          onClick={addNewPage}>
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <Card className="shadow-md border-0 w-96 mx-auto bg-white">
        <div className="p-4">
          <Input
            value={currentPage.title}
            onChange={(e) => updatePageTitle(e.target.value)}
            className="text-xl font-bold mb-4 w-full"
            placeholder="Page Title"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="space-y-4">
            {currentPage.elements.length === 0 ? (
              <div className="h-24 flex items-center justify-center text-gray-500">Add elements</div>
            ) : (
              currentPage.elements.map((el) => (
                <EditableElement
                  key={el.id}
                  element={el}
                  selectedElement={selectedElement}
                  updateElement={updateElement}
                  deleteElement={deleteElement}
                  setSelectedElement={setSelectedElement}
                  currentPageIndex={currentPageIndex}
                />
              ))
            )}
          </div>
          <Button
            className="mt-4"
            onClick={addNewElement}>
            Add Element
          </Button>
        </div>
      </Card>
    </div>
  );
}
