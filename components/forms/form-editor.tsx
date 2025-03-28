// src/components/forms/form-editor.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner"; // Import toast for feedback

// --- Import Central Types ---
import type { Form, Page, ElementType } from "@/app/types/form"; // Correct path to your types

// --- Import Immer ---
import { produce } from "immer"; // Make sure immer is installed: npm install immer

// --- Update Props Interface ---
interface FormEditorProps {
  form: Form;
  setForm: (updatedForm: Form) => void; // Keep this simple for now
  currentPageIndex: number;
  // --- ADD THESE PROPS --- (Passed from EditFormPage)
  selectedElement: { element: ElementType; pageIndex: number } | null;
  setSelectedElement: (selected: { element: ElementType; pageIndex: number } | null) => void;
  // --- END ADDED PROPS ---
  // setCurrentPageIndex might also be needed depending on your structure
  // setCurrentPageIndex: (index: number) => void;
}

export function FormEditor({
  form,
  setForm,
  currentPageIndex,
  selectedElement, // Destructure
  setSelectedElement, // Destructure
}: // setCurrentPageIndex,
FormEditorProps) {
  // --- State for Global Form Settings ---
  // (Removed local state for width, height etc. - edit directly on 'form' object)

  // --- Helper to Update Form State ---
  // Using Immer for easier nested updates
  const updateForm = (updater: (draft: Form) => void) => {
    try {
      const nextState = produce(form, updater);
      // Only call setForm if the state actually changed
      if (nextState !== form) {
        setForm(nextState);
      }
    } catch (e) {
      console.error("Failed to update form state:", e);
      toast.error("Failed to apply changes.");
    }
  };

  // --- Logic to determine what to edit ---
  const elementToEdit = selectedElement?.element;
  const elementPageIndex = selectedElement?.pageIndex;
  // Check if the selected element is actually on the currently visible page
  // Allow editing even if pageIndex doesn't match currentPageIndex, maybe user selected from conditions tab?
  const isElementSelected = !!elementToEdit;

  // --- Handlers for Property Changes ---

  // Update ELEMENT property
  const handleElementChange = (property: keyof ElementType, value: any) => {
    if (!elementToEdit || typeof elementPageIndex !== "number") return;
    updateForm((draft) => {
      // Find the correct page first based on the selection's pageIndex
      const page = draft.pages[elementPageIndex];
      if (page) {
        const elementIndex = page.elements.findIndex((el) => el.id === elementToEdit.id);
        if (elementIndex !== -1) {
          // Type assertion needed if using dynamic keys, or handle each property explicitly
          (page.elements[elementIndex] as any)[property] = value;
        }
      }
    });
  };

  // Update CURRENT PAGE property
  const handleCurrentPageChange = (property: keyof Omit<Page, "elements">, value: any) => {
    updateForm((draft) => {
      const page = draft.pages[currentPageIndex];
      if (page) {
        (page as any)[property] = value;
      }
    });
  };

  // Update GLOBAL FORM property
  const handleFormChange = (property: keyof Omit<Form, "pages" | "conditions" | "id">, value: any) => {
    updateForm((draft) => {
      // Special handling for styles to merge correctly
      if (property === "styles") {
        draft.styles = { ...(draft.styles || {}), ...value };
      } else {
        (draft as any)[property] = value;
      }

      // --- Logic from your handleApplyChanges ---
      // If multi-page is turned off, consolidate pages
      if (property === "isMultiPage" && value === false && draft.pages.length > 1) {
        draft.pages = [draft.pages[0]];
        // We cannot directly call setCurrentPageIndex here as it's outside the Immer producer
        // This needs to be handled after setForm completes, maybe in a useEffect in the parent?
        // For now, let's assume parent handles navigation if index becomes invalid
        console.warn("Multi-page disabled. Page index might need adjustment in parent component.");
      }
      // --- End logic ---
    });
  };

  // --- Render Logic ---
  return (
    <div className="space-y-6">
      {isElementSelected ? (
        // ================================
        // === ELEMENT PROPERTIES PANEL ===
        // ================================
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-medium text-lg border-b pb-2">
            {/* Display Page index if different from current */}
            {elementPageIndex !== currentPageIndex && <span className="text-xs font-normal text-gray-500 mr-1">(Page {elementPageIndex! + 1})</span>}
            Element: <span className="font-bold">{elementToEdit.title || "Untitled"}</span>{" "}
            <span className="text-sm text-gray-500">({elementToEdit.type})</span>
          </h3>
          <div className="space-y-3">
            {/* --- Common Element Fields --- */}
            <div>
              <Label htmlFor={`element-title-${elementToEdit.id}`}>Label / Title</Label>
              <Input
                id={`element-title-${elementToEdit.id}`}
                value={elementToEdit.title}
                onChange={(e) => handleElementChange("title", e.target.value)}
                placeholder="Enter element label"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`element-required-${elementToEdit.id}`}
                checked={elementToEdit.required}
                onCheckedChange={(checked) => handleElementChange("required", checked)}
              />
              <Label htmlFor={`element-required-${elementToEdit.id}`}>Required</Label>
            </div>

            {/* --- Type Specific Fields --- */}
            {["select", "radio", "checkbox"].includes(elementToEdit.type) && (
              <div>
                <Label htmlFor={`element-options-${elementToEdit.id}`}>Options (comma-separated)</Label>
                <Input
                  id={`element-options-${elementToEdit.id}`}
                  value={(elementToEdit.options || []).join(", ")}
                  onChange={(e) =>
                    handleElementChange(
                      "options",
                      e.target.value
                        .split(",")
                        .map((opt) => opt.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Option 1, Option 2"
                />
              </div>
            )}
            {(elementToEdit.type === "text" ||
              elementToEdit.type === "textarea" ||
              elementToEdit.type === "email" ||
              elementToEdit.type === "phone") && (
              <div>
                <Label htmlFor={`element-value-${elementToEdit.id}`}>Placeholder Text</Label>
                <Input
                  id={`element-value-${elementToEdit.id}`}
                  type={"text"} // Keep type simple, validation happens elsewhere
                  // Value property for inputs often stores placeholder or default, ensure it's a string
                  value={typeof elementToEdit.value === "string" ? elementToEdit.value : ""}
                  onChange={(e) => handleElementChange("value", e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
            )}
            {elementToEdit.type === "link" && (
              <div>
                <Label htmlFor={`element-value-${elementToEdit.id}`}>Link URL</Label>
                <Input
                  id={`element-value-${elementToEdit.id}`}
                  type="url"
                  value={typeof elementToEdit.value === "string" ? elementToEdit.value : ""}
                  onChange={(e) => handleElementChange("value", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            )}
            {/* Add more specific fields as needed */}
          </div>
        </div>
      ) : (
        // ================================
        // === FORM / PAGE PROPERTIES PANEL ===
        // ================================
        <div className="space-y-4">
          {/* --- Global Form Settings --- */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Form Settings</h3>
            <div className="space-y-3">
              {/* Title */}
              <div>
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Enter form title"
                />
              </div>
              {/* Description */}
              <div>
                <Label htmlFor="form-description">Description</Label>
                <Input // Use Textarea if you have one
                  id="form-description"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Enter form description"
                />
              </div>

              {/* Multi-Page Switch */}
              <div className="flex items-center gap-2 pt-1">
                <Switch
                  checked={form.isMultiPage ?? true} // Default to true if undefined
                  onCheckedChange={(checked) => handleFormChange("isMultiPage", checked)}
                  id="multiPageSwitch"
                />
                <Label htmlFor="multiPageSwitch">Multi-Page</Label>
              </div>
              {/* Active Switch */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isActive ?? false} // Default to false if undefined
                  onCheckedChange={(checked) => handleFormChange("isActive", checked)}
                  id="activeSwitch"
                />
                <Label htmlFor="activeSwitch">Form is Active</Label>
              </div>
            </div>
          </div>

          {/* --- Current Page Settings --- */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Current Page Settings (Page {currentPageIndex + 1})</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={form.pages[currentPageIndex]?.title || ""}
                  onChange={(e) => handleCurrentPageChange("title", e.target.value)}
                  placeholder="Enter page title"
                />
              </div>
              {/* Add more page settings here, like background */}
              <div>
                <Label htmlFor="page-background">Page Background</Label>
                <Input
                  id="page-background"
                  value={form.pages[currentPageIndex]?.background || ""}
                  onChange={(e) => handleCurrentPageChange("background", e.target.value)}
                  placeholder="e.g., #ffffff or url(...)"
                />
              </div>
            </div>
          </div>
          {/* Removed Width/Height/Columns here - manage in Style panel */}
          {/* Removed Apply Changes Button - changes are applied directly via onChange */}
        </div>
      )}
    </div>
  );
}
