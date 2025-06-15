// src/components/forms/ElementPreview.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Use Label for better accessibility
import { Checkbox } from "@/components/ui/checkbox"; // Use shadcn Checkbox
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Use shadcn RadioGroup
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Use shadcn Select
import type { ElementType } from "@/app/types/form"; // Adjust path

interface ElementPreviewProps {
  element: ElementType;
  value: string | number | boolean | string[] | undefined; // Current value from formData
  onChange: (elementId: string, value: string | boolean | number | string[]) => void; // Handler to update formData
}

export function ElementPreview({ element, value, onChange }: ElementPreviewProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onChange(element.id, e.target.value);
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    // Store boolean directly for checkboxes
    onChange(element.id, !!checked); // Ensure it's boolean
  };

  const handleRadioChange = (radioValue: string) => {
    onChange(element.id, radioValue);
  };

  const handleRatingClick = (ratingValue: number) => {
    onChange(element.id, ratingValue);
  };

  let renderedElement: React.ReactNode;

  switch (element.type) {
    case "text":
    case "email":
    case "phone":
    case "number": // Add number type if needed
      renderedElement = (
        <Input
          id={element.id}
          type={element.type === "number" ? "number" : element.type}
          placeholder={typeof element.value === "string" ? element.value : `Enter ${element.type}`} // Use element.value as placeholder if it's a string
          value={typeof value === "string" || typeof value === "number" ? value : ""} // Bind to string/number value
          onChange={handleInputChange}
          className="w-full mt-1"
          required={element.required}
        />
      );
      break;
    case "textarea": // Add textarea if needed
      renderedElement = (
        <textarea
          id={element.id}
          placeholder={typeof element.value === "string" ? element.value : `Enter ${element.type}`}
          value={typeof value === "string" || typeof value === "number" ? value : ""}
          onChange={handleInputChange}
          className="w-full mt-1"
          required={element.required}
        />
      );
      break;

    case "checkbox":
      // Single Checkbox
      renderedElement = (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id={element.id}
            checked={!!value} // Bind checked state to boolean value
            onCheckedChange={handleCheckboxChange}
          />
          {/* Label associated with checkbox */}
          <Label
            htmlFor={element.id}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
            {element.options?.[0] || element.title} {/* Use first option or title as label */}
          </Label>
        </div>
      );
      break;
    case "radio": // Assuming radio group
      renderedElement = (
        <RadioGroup
          value={typeof value === "string" ? value : ""}
          onValueChange={handleRadioChange}
          className="mt-1 space-y-1"
          required={element.required}>
          {(element.options || []).map((option, index) => (
            <div
              key={`${element.id}-${index}`}
              className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                id={`${element.id}-${index}`}
              />
              <Label
                htmlFor={`${element.id}-${index}`}
                className="text-sm font-normal">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
      break;

    case "date":
      renderedElement = (
        <Input
          id={element.id}
          type="date"
          value={typeof value === "string" ? value : ""} // Date value is string 'YYYY-MM-DD'
          onChange={handleInputChange}
          className="w-full mt-1"
          required={element.required}
        />
      );
      break;

    case "select":
      renderedElement = (
        <Select
          value={typeof value === "string" ? value : ""}
          onValueChange={(selectValue) => onChange(element.id, selectValue)}
          required={element.required}>
          <SelectTrigger className="w-full mt-1 h-10 text-sm">
            <SelectValue placeholder={`Select ${element.title || "an option"}...`} />
          </SelectTrigger>
          <SelectContent>
            {(element.options || []).map((option, index) => (
              <SelectItem
                key={`${element.id}-${index}`}
                value={option}
                className="text-sm">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;

    case "image":
      // Preview only displays the image based on value (URL string)
      renderedElement =
        typeof element.value === "string" && element.value ? (
          <img
            src={element.value}
            alt={element.title || "Image preview"}
            style={{ maxWidth: "100%", maxHeight: "300px", height: "auto", ...element.styles }}
            className="rounded-lg mt-2 border"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"; /* Optionally show placeholder */
            }}
          />
        ) : (
          <div className="text-xs text-gray-400 mt-1">(No image provided)</div>
        );
      break;

    case "yesno":
      renderedElement = (
        <div className="flex space-x-4 mt-2">
          <Button
            variant={value === "Yes" ? "default" : "outline"}
            onClick={() => onChange(element.id, "Yes")}
            className="flex-1">
            {" "}
            Yes{" "}
          </Button>
          <Button
            variant={value === "No" ? "default" : "outline"}
            onClick={() => onChange(element.id, "No")}
            className="flex-1">
            {" "}
            No{" "}
          </Button>
        </div>
      );
      break;
    case "rating":
      {
        const currentRating = typeof value === "number" ? value : 0;
        renderedElement = (
          <div className="flex space-x-2 justify-start mt-2">
            {" "}
            {/* Adjust alignment */}
            {Array.from({ length: 5 }).map((_, index) => {
              const starNumber = index + 1;
              return (
                <button
                  key={index}
                  type="button" // Prevent form submission if inside form
                  onClick={() => handleRatingClick(starNumber)}
                  className={`text-2xl transition-colors duration-150 hover:text-yellow-400 ${
                    starNumber <= currentRating ? "text-yellow-400" : "text-gray-300"
                  }`}>
                  ★
                </button>
              );
            })}
          </div>
        );
      }
      break;
    case "link":
      renderedElement = (
        <a
          href={typeof element.value === "string" ? element.value : "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={element.styles}
          className="inline-block mt-1 text-blue-600 hover:text-blue-800 underline break-all">
          {element.title || "Link"}
        </a>
      );
      break;
    case "button":
      // Buttons in preview are typically not interactive unless simulating submission
      renderedElement = (
        <Button
          style={element.styles}
          disabled // Disable in preview usually
          className="mt-2">
          {element.title || "Button"}
        </Button>
      );
      break;

    default:
      renderedElement = <div className="mt-1 text-xs text-red-500 italic">(Preview not available for type: {element.type})</div>;
  }

  // Wrap element with label and apply main element styles to this container
  return (
    <div
      className="w-full mb-4" // Spacing between elements
      style={{
        width: element.styles?.width || "100%",
        height: element.styles?.height || "auto",
        // Add other container styles from element.styles if needed
      }}>
      <Label
        htmlFor={element.id}
        className="block text-sm font-medium text-gray-700 mb-1">
        {element.title} {element.required && <span className="text-red-500">*</span>}
      </Label>
      {renderedElement}
    </div>
  );
}
