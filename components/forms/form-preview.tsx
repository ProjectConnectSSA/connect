"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PreviewFormProps {
  form: any; // Adjust to your actual Form interface if you have one
}

export function PreviewForm({ form }: PreviewFormProps) {
  // Make sure form.pages is defined and has pages:
  if (!form || !Array.isArray(form.pages) || form.pages.length === 0) {
    return <div className="flex items-center justify-center h-screen">No pages to preview</div>;
  }

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  // Toggle between desktop (wide) and mobile (narrow) view:
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  // Direction for the animation
  const [direction, setDirection] = useState(0);

  // The current page:
  const currentPage = form.pages[currentPageIndex];

  // Update the value of a given element:
  const handleInputChange = (elementId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  };

  // Get current value of an element:
  const getElementValue = (elementId: string) => formData[elementId] || "";

  // Check if the condition on the current page is met:
  const isConditionMet = () => {
    if (!currentPage.condition) return false;

    const { elementId, operator, value, targetPageId } = currentPage.condition;
    const elementValue = getElementValue(elementId);

    switch (operator) {
      case "equals":
        return elementValue === value;
      case "not_equals":
        return elementValue !== value;
      case "contains":
        return elementValue.includes(value);
      case "greater_than":
        return parseFloat(elementValue) > parseFloat(value);
      case "less_than":
        return parseFloat(elementValue) < parseFloat(value);
      default:
        return false;
    }
  };

  // Navigate pages, considering any condition:
  const navigatePages = (direction: number) => {
    setDirection(direction);
    let newIndex = currentPageIndex + direction;

    // If there's a condition and it's met, jump to the target page:
    if (currentPage.condition && isConditionMet()) {
      const targetIndex = form.pages.findIndex((p: any) => p.id === currentPage.condition.targetPageId);
      if (targetIndex !== -1) {
        newIndex = targetIndex;
      }
    }

    // Ensure newIndex is in range:
    if (newIndex >= 0 && newIndex < form.pages.length) {
      setCurrentPageIndex(newIndex);
    }
  };

  // Render each element based on its type:
  const renderElements = () => {
    return currentPage.elements.map((element: any) => {
      let renderedElement;

      switch (element.type) {
        case "text":
          renderedElement = (
            <Input
              placeholder="Enter text"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              style={{ backgroundColor: element.styles.backgroundColor || "#f9f9f9" }}
              className="w-full mt-2"
            />
          );
          break;

        case "checkbox":
          renderedElement = (
            <label className="flex items-center space-x-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={getElementValue(element.id) === "true"}
                onChange={(e) => handleInputChange(element.id, e.target.checked.toString())}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Checkbox</span>
            </label>
          );
          break;

        case "date":
          renderedElement = (
            <Input
              type="date"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              style={{ backgroundColor: element.styles.backgroundColor || "#f9f9f9" }}
              className="w-full mt-2"
            />
          );
          break;

        case "select":
          renderedElement = (
            <select
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              style={{ backgroundColor: element.styles.backgroundColor || "#f9f9f9" }}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 h-10 mt-2">
              <option value="">Select</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          );
          break;

        case "phone":
          renderedElement = (
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              style={{ backgroundColor: element.styles.backgroundColor || "#f9f9f9" }}
              className="w-full mt-2"
            />
          );
          break;

        case "email":
          renderedElement = (
            <Input
              type="email"
              placeholder="Enter email"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              style={{ backgroundColor: element.styles.backgroundColor || "#f9f9f9" }}
              className="w-full mt-2"
            />
          );
          break;

        case "image":
          // If there's a stored value, show the image; otherwise show file input:
          renderedElement = getElementValue(element.id) ? (
            <img
              src={getElementValue(element.id)}
              alt={element.title}
              style={{ maxWidth: "100%", height: "auto" }}
              className="rounded-lg mt-2"
            />
          ) : (
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const fileUrl = URL.createObjectURL(e.target.files[0]);
                  handleInputChange(element.id, fileUrl);
                }
              }}
              className="w-full mt-2"
            />
          );
          break;

        case "yesno":
          renderedElement = (
            <div className="flex space-x-4 mt-2">
              <Button
                variant={getElementValue(element.id) === "Yes" ? "default" : "outline"}
                onClick={() => handleInputChange(element.id, "Yes")}
                className="flex-1">
                Yes
              </Button>
              <Button
                variant={getElementValue(element.id) === "No" ? "default" : "outline"}
                onClick={() => handleInputChange(element.id, "No")}
                className="flex-1">
                No
              </Button>
            </div>
          );
          break;

        case "rating":
          {
            const currentRating = parseInt(getElementValue(element.id)) || 0;
            renderedElement = (
              <div className="flex space-x-2 justify-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const starNumber = index + 1;
                  return (
                    <button
                      key={index}
                      onClick={() => handleInputChange(element.id, starNumber.toString())}
                      className={`text-2xl transition-colors duration-200 ${starNumber <= currentRating ? "text-yellow-400" : "text-gray-300"}`}>
                      ★
                    </button>
                  );
                })}
              </div>
            );
          }
          break;

        default:
          renderedElement = <div className="mt-2">Unsupported element</div>;
      }

      // Wrap each element in a container with the user-defined styles:
      return (
        <motion.div
          key={element.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full rounded p-4 mb-6"
          style={{
            width: element.styles.width || "100%",
            height: element.styles.height || "auto",
          }}>
          {/* Label styled as normal text, not an input field */}
          <div className="pt-4">
            <div className="font-medium text-gray-800">{element.title}</div>
            {renderedElement}
          </div>
        </motion.div>
      );
    });
  };

  // Container class toggles between mobile (narrow) and desktop (wide) widths.
  const containerClass = previewMode === "desktop" ? "w-full max-w-4xl" : "w-[375px]"; // typical mobile width

  // Animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-6">
      {/* Mobile/Desktop Toggle Buttons */}
      <div className="flex justify-end w-full max-w-4xl mb-6">
        <Button
          variant={previewMode === "mobile" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode("mobile")}
          className="mr-2">
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile
        </Button>
        <Button
          variant={previewMode === "desktop" ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode("desktop")}>
          <Monitor className="h-4 w-4 mr-2" />
          Desktop
        </Button>
      </div>

      {/* Form Preview Container */}
      <div className={`${containerClass} flex-grow flex flex-col`}>
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait">
          <motion.div
            key={currentPageIndex}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="w-full flex-grow">
            <Card
              className="p-8 w-full h-full overflow-auto"
              style={{ background: currentPage.background || "#ffffff", ...currentPage.styles }}>
              <h2 className="text-xl font-semibold mb-8">{currentPage.title}</h2>

              {/* Render the elements */}
              <div className="flex flex-col mt-6">{renderElements()}</div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 w-full">
          <Button
            variant="outline"
            onClick={() => navigatePages(-1)}
            disabled={currentPageIndex === 0}
            className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            {currentPageIndex + 1} of {form.pages.length}
          </span>
          <Button
            variant="outline"
            onClick={() => navigatePages(1)}
            disabled={currentPageIndex === form.pages.length - 1}
            className="flex items-center">
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
