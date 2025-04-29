// src/components/forms/form-preview.tsx (or your path)
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Use Card components
import { ArrowLeft, ArrowRight, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ElementPreview } from "./ElementPreview"; // Import the new component
import type { Form, Page, ElementType, Condition } from "@/app/types/form"; // Adjust path

interface PreviewFormProps {
  form: Form;
}

// Helper function to evaluate a single condition
const evaluateCondition = (operator: string, elementValue: any, conditionValue: string): boolean => {
  // Handle boolean from checkbox
  const elValue = typeof elementValue === "boolean" ? elementValue.toString() : (elementValue ?? "").toString().toLowerCase();
  const condValue = conditionValue.toLowerCase();

  switch (operator) {
    case "equals":
      return elValue === condValue;
    case "not_equals":
      return elValue !== condValue;
    case "contains":
      return elValue.includes(condValue);
    case "greater_than":
      return !isNaN(parseFloat(elValue)) && !isNaN(parseFloat(condValue)) && parseFloat(elValue) > parseFloat(condValue);
    case "less_than":
      return !isNaN(parseFloat(elValue)) && !isNaN(parseFloat(condValue)) && parseFloat(elValue) < parseFloat(condValue);
    case "is_empty":
      return elValue === "";
    case "is_not_empty":
      return elValue !== "";
    default:
      return false;
  }
};

export function PreviewForm({ form }: PreviewFormProps) {
  // Basic validation
  if (!form || !Array.isArray(form.pages) || form.pages.length === 0) {
    return <div className="p-6 text-center text-gray-500">Form data is invalid or missing pages.</div>;
  }

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // Store various data types
  const [formData, setFormData] = useState<Record<string, string | boolean | number | string[]>>({});
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  const currentPage = form.pages[currentPageIndex];

  // Update formData state, handling different value types
  const handleInputChange = useCallback((elementId: string, value: string | boolean | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  }, []);

  // Function to determine the next page index based on conditions
  const getNextPageIndex = useCallback((): number => {
    const conditions = form.conditions || [];
    const applicableConditions = conditions.filter((c) => c.sourcePageId === currentPage.id);

    for (const condition of applicableConditions) {
      if (condition.elementId) {
        const elementValue = formData[condition.elementId];
        if (evaluateCondition(condition.operator, elementValue, condition.value)) {
          const targetIndex = form.pages.findIndex((p) => p.id === condition.targetPageId);
          // Only jump if target page exists
          if (targetIndex !== -1) {
            console.log(`Condition met (${condition.id}), jumping to page ${targetIndex + 1}`);
            return targetIndex;
          } else {
            console.warn(`Condition target page ${condition.targetPageId} not found.`);
          }
        }
      }
    }

    // If no conditions met or no applicable conditions, go to the next sequential page
    const nextSequentialIndex = currentPageIndex + 1;
    return nextSequentialIndex < form.pages.length ? nextSequentialIndex : currentPageIndex; // Stay on last page if no next
  }, [currentPage, form.conditions, form.pages, formData, currentPageIndex]);

  // Navigate pages
  const navigatePages = (navDirection: number) => {
    setDirection(navDirection); // For animation direction

    let newIndex: number;
    if (navDirection > 0) {
      // Moving forward
      newIndex = getNextPageIndex();
    } else {
      // Moving backward - typically just go back one step
      newIndex = currentPageIndex - 1;
    }

    // Ensure newIndex is within bounds
    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
    }
  };

  // --- Render Logic ---
  const containerClass =
    previewMode === "desktop"
      ? "w-full max-w-3xl mx-auto" // Centered desktop view
      : "w-[375px] mx-auto"; // Centered mobile view

  const pageVariants = {
    /* ... (variants remain the same) ... */
  };
  const pageTransition = {
    /* ... (transition remains the same) ... */
  };

  if (!currentPage) {
    return <div className="p-6 text-center text-red-500">Error: Current page data not found.</div>;
  }

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-100 min-h-[600px]">
      {" "}
      {/* Ensure background and min height */}
      {/* Mobile/Desktop Toggle */}
      <div className="flex justify-center w-full max-w-3xl mb-4">
        <Button
          variant={previewMode === "mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode("mobile")}
          className="mr-2 rounded-r-none">
          <Smartphone className="h-4 w-4 mr-1" /> Mobile{" "}
        </Button>
        <Button
          variant={previewMode === "desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode("desktop")}
          className="rounded-l-none">
          <Monitor className="h-4 w-4 mr-1" /> Desktop{" "}
        </Button>
      </div>
      {/* Form Preview Container */}
      <div className={`${containerClass} flex flex-col flex-grow overflow-hidden rounded-lg shadow-lg border bg-white`}>
        {" "}
        {/* Added styles */}
        {/* Animated Page Area */}
        <div className="flex-grow overflow-hidden relative">
          {" "}
          {/* Needed for AnimatePresence positioning */}
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait">
            <motion.div
              key={currentPageIndex} // Key change triggers animation
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute inset-0 overflow-y-auto p-6 md:p-8" // Make content scrollable, add padding
              style={{ background: currentPage.background || form.background || "#ffffff" }} // Apply background
            >
              <CardHeader className="p-0 mb-6">
                {" "}
                {/* Use CardHeader for title consistency */}
                <CardTitle className="text-2xl font-semibold">{currentPage.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {" "}
                {/* Use CardContent */}
                {/* Render the elements */}
                {currentPage.elements?.map((element) => (
                  <ElementPreview
                    key={element.id}
                    element={element}
                    value={formData[element.id]}
                    onChange={handleInputChange}
                  />
                ))}
                {/* Add a submit button preview on the last page? */}
                {currentPageIndex === form.pages.length - 1 && (
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    onClick={() => alert("Form Submitted (Preview)")}>
                    Submit (Preview)
                  </Button>
                )}
              </CardContent>
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Navigation Fixed Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => navigatePages(-1)}
            disabled={currentPageIndex === 0}
            className="flex items-center text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-xs text-gray-500">
            Page {currentPageIndex + 1} of {form.pages.length}
          </span>
          {/* Show Next or Submit based on page */}
          {currentPageIndex < form.pages.length - 1 ? (
            <Button
              variant="default"
              onClick={() => navigatePages(1)}
              className="flex items-center text-sm">
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex items-center text-sm"
              onClick={() => alert("Form Submitted (Preview)")}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
