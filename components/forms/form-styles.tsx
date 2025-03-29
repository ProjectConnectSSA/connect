// src/components/forms/form-styles.tsx (Adjust path if needed)
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { produce } from "immer";

// --- Import Central Types ---
// Make sure this path points to your actual types file
import type { Form, Page, ElementType } from "@/app/types/form";

interface FormStylesProps {
  form: Form;
  setForm: (updatedForm: Form) => void; // Or React.Dispatch<React.SetStateAction<Form>>
  currentPageIndex: number;
  // SelectedElement type defined inline for clarity, or import if defined elsewhere
  selectedElement: { element: ElementType; pageIndex: number } | null;
}

// --- Helper to Update Form State using Immer ---
const useUpdateForm = (form: Form, setForm: (updatedForm: Form) => void) => {
  const updateForm = (updater: (draft: Form) => void) => {
    try {
      const nextState = produce(form, updater);
      if (nextState !== form) {
        // Only update if Immer produced a new state
        setForm(nextState);
      }
    } catch (e) {
      console.error("Failed to update form style state:", e);
      toast.error("An error occurred while applying styles.");
    }
  };
  return updateForm;
};

export function FormStyles({ form, setForm, currentPageIndex, selectedElement }: FormStylesProps) {
  const updateForm = useUpdateForm(form, setForm);

  // Determine the target for styling
  const elementToEdit = selectedElement?.element;
  const elementPageIndex = selectedElement?.pageIndex;
  // Style the element only if it's selected AND on the currently viewed page in the editor
  const styleTarget: "element" | "page" = elementToEdit && elementPageIndex === currentPageIndex ? "element" : "page";
  const targetPage = form.pages[currentPageIndex]; // Page being viewed in editor

  if (!targetPage) {
    return <div className="p-4 text-sm text-red-500">Error: Current page data not found.</div>;
  }

  // --- Consolidated Style Update Handler ---
  const handleStyleChange = (property: keyof React.CSSProperties | string, value: string | number | undefined) => {
    let finalValue = value;
    if (property === "opacity" && typeof value === "number") {
      finalValue = value / 100; // Convert opacity percentage to decimal
    }
    if ((property === "width" || property === "height") && value !== "" && value !== undefined && !isNaN(Number(value))) {
      finalValue = `${value}px`; // Add 'px' suffix
    }

    updateForm((draft) => {
      if (styleTarget === "element" && elementToEdit) {
        const pageDraft = draft.pages[elementPageIndex!];
        if (!pageDraft) return;
        const elementIndex = pageDraft.elements.findIndex((el) => el.id === elementToEdit.id);
        if (elementIndex !== -1) {
          const elDraft = pageDraft.elements[elementIndex];
          if (!elDraft.styles) elDraft.styles = {};
          (elDraft.styles as any)[property] = finalValue;
        }
      } else {
        // Update page styles
        const pageDraft = draft.pages[currentPageIndex];
        if (!pageDraft.styles) pageDraft.styles = {};
        if (property === "backgroundColor") {
          // Page background is top-level property
          pageDraft.background = typeof finalValue === "string" ? finalValue : undefined;
          // Optionally clear page style background if setting page background directly
          // if (pageDraft.styles?.backgroundColor) delete pageDraft.styles.backgroundColor;
        } else {
          // Other page styles go in 'styles' object
          (pageDraft.styles as any)[property] = finalValue;
          // If setting page opacity, maybe clear page background color? Depends on desired behavior
          // if (property === 'opacity' && pageDraft.background) {
          //    pageDraft.background = undefined; // Example: Prefer styles.backgroundColor if opacity is set
          // }
        }
      }
    });
  };

  // --- Derive Controlled Values from State ---
  const targetStyles = styleTarget === "element" ? elementToEdit?.styles : targetPage?.styles;
  const targetBackground = styleTarget === "element" ? elementToEdit?.styles?.backgroundColor : targetPage?.background;

  // Width/Height only applicable to elements in this setup
  const currentWidth = styleTarget === "element" ? parseInt(elementToEdit?.styles?.width?.replace("px", "") || "0") || "" : "";
  const currentHeight = styleTarget === "element" ? parseInt(elementToEdit?.styles?.height?.replace("px", "") || "0") || "" : "";

  // Opacity (get from target, convert to 0-100 for slider/input)
  const currentOpacityValue = targetStyles?.opacity ?? 1; // Default to 1 (100%) if undefined
  const currentOpacityPercent = Math.round(currentOpacityValue * 100);

  // Background Color
  const currentBgColor = targetBackground || "#ffffff"; // Default to white

  // --- Color Palettes (Explicitly Typed) ---
  const colorPalette: Record<string, string[]> = {
    primary: ["#FF0000", "#FF6A00", "#FFD700", "#00BF5F", "#0099FF", "#172554", "#000000"],
    neutral: ["#F5F5F5", "#E5E5E5", "#D4D4D4", "#A3A3A3", "#737373", "#404040", "#171717"],
    accent: ["#FF69B4", "#9747FF", "#00C7B0", "#FF5630", "#36B37E", "#00B8D9", "#6554C0"],
  };

  return (
    <div className="space-y-6 p-1">
      {" "}
      {/* Added padding */}
      {/* --- Title --- */}
      <div className="pb-2 border-b">
        <Label className="text-base font-semibold">
          {styleTarget === "element" ? `Element Styles (${elementToEdit?.title || "Untitled"})` : `Page Styles (Page ${currentPageIndex + 1})`}
        </Label>
        <p className="text-xs text-muted-foreground">
          {styleTarget === "element" ? "Modify appearance of the selected element." : "Modify appearance of the current page."}
        </p>
      </div>
      {/* --- Dimensions (Element Only) --- */}
      {styleTarget === "element" && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Dimensions</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="style-width"
                className="text-xs">
                Width (px)
              </Label>
              <Input
                id="style-width"
                type="number"
                min={10}
                placeholder="auto"
                className="h-9 text-sm"
                value={currentWidth}
                onChange={(e) => handleStyleChange("width", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="style-height"
                className="text-xs">
                Height (px)
              </Label>
              <Input
                id="style-height"
                type="number"
                min={10}
                placeholder="auto"
                className="h-9 text-sm"
                value={currentHeight}
                onChange={(e) => handleStyleChange("height", e.target.value)}
              />
            </div>
          </div>
          <Separator />
        </div>
      )}
      {/* --- Background Color --- */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Background Color</h4>
        <div className="flex items-center gap-4">
          <div className="space-y-1.5 flex-1">
            <Label
              htmlFor="background-color"
              className="text-xs">
              Custom Color
            </Label>
            <Input
              type="color"
              id="background-color"
              value={currentBgColor}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              className="h-9 w-full p-1 cursor-pointer" // Added cursor-pointer
            />
          </div>
          <div className="pt-5">
            {" "}
            {/* Align preview box */}
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: currentBgColor }}></div>
          </div>
        </div>

        {/* Palette */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs text-muted-foreground block mb-1">Color Palette</Label>
          {Object.entries(colorPalette).map(
            (
              [group, colors] // Type inference works now
            ) => (
              <div
                key={group}
                className="space-y-1">
                <Label className="text-[10px] capitalize text-muted-foreground">{group}</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(
                    (
                      color // colors is string[]
                    ) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border border-gray-300 shadow-sm transition-transform duration-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                          currentBgColor === color ? "ring-2 ring-offset-1 ring-blue-600" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleStyleChange("backgroundColor", color)}
                        title={color}
                      />
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <Separator />
      {/* --- Opacity --- */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label
            htmlFor="style-opacity"
            className="text-sm font-medium text-muted-foreground">
            Opacity
          </Label>
          <span className="text-xs text-muted-foreground">{currentOpacityPercent}%</span>
        </div>
        <Slider
          id="style-opacity"
          min={0}
          max={100}
          step={1}
          value={[currentOpacityPercent]} // Slider expects an array value
          onValueChange={(value) => handleStyleChange("opacity", value[0])} // Pass the single number value
          className="w-full"
        />
      </div>
      {/* --- Add more style properties here as needed --- */}
      {/* Example: Padding (Element Only) */}
      {/* {styleTarget === 'element' && (
         <>
            <Separator />
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Padding</h4>
                 <div className="grid grid-cols-4 gap-2">
                     // Add inputs for Top, Right, Bottom, Left padding
                 </div>
            </div>
         </>
       )} */}
    </div>
  );
}
