"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PreviewFormProps {
  form: any;
}

export function PreviewForm({ form }: PreviewFormProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const currentPage = form.pages[currentPageIndex];

  // Handle input change
  const handleInputChange = (elementId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [elementId]: value,
    }));
  };

  // Get element value
  const getElementValue = (elementId: string) => formData[elementId] || "";

  // Check if condition is met
  const isConditionMet = () => {
    if (!currentPage.condition) return false;
    const { elementId, operator, value } = currentPage.condition;
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

  // Navigate pages
  const navigatePages = (direction: number) => {
    let newIndex = currentPageIndex + direction;

    if (currentPage.condition && isConditionMet()) {
      const targetIndex = form.pages.findIndex((p: any) => p.id === currentPage.condition.targetPageId);
      if (targetIndex !== -1) {
        newIndex = targetIndex;
      }
    }

    if (newIndex >= 0 && newIndex < form.pages.length) {
      console.log("Navigating to page", newIndex);
      setCurrentPageIndex(newIndex);
    }
  };

  // Render elements
  const renderElements = () =>
    currentPage.elements.map((element: any) => {
      let renderedElement;
      switch (element.type) {
        case "text":
          renderedElement = (
            <Input
              placeholder="Enter text"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
            />
          );
          break;
        case "checkbox":
          renderedElement = (
            <input
              type="checkbox"
              checked={getElementValue(element.id) === "true"}
              onChange={(e) => handleInputChange(element.id, e.target.checked.toString())}
            />
          );
          break;
        case "date":
          renderedElement = (
            <Input
              type="date"
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
            />
          );
          break;
        case "select":
          renderedElement = (
            <select
              value={getElementValue(element.id)}
              onChange={(e) => handleInputChange(element.id, e.target.value)}>
              <option value="">Select</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          );
          break;
        default:
          renderedElement = <div>Unsupported element</div>;
      }

      return (
        <div
          key={element.id}
          className="space-y-2">
          <Label>{element.title}</Label>
          {renderedElement}
        </div>
      );
    });

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          Page {currentPageIndex + 1}: {currentPage.title}
        </h2>
        <div className="space-y-4">{renderElements()}</div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigatePages(-1)}
          disabled={currentPageIndex === 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigatePages(1)}
          disabled={currentPageIndex === form.pages.length - 1}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
