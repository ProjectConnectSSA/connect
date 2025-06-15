"use client";

import React, { useEffect } from "react"; // Removed useState, useRef as they are no longer needed for local state/carousel
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowRight } from "lucide-react"; // Changed icons for clarity
import { toast } from "sonner"; // For potential feedback

// --- Import Immer ---
import { produce } from "immer"; // Make sure immer is installed

// --- Import Types (Assuming they are in a central location) ---
// If not, keep the inline definitions but centralizing is better
import type { Form, Page, ElementType, Condition } from "@/app/types/form"; // Adjust path if needed

interface ConditionBuilderProps {
  form: Form;
  setForm: (updatedForm: Form) => void; // Or React.Dispatch<React.SetStateAction<Form>>
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
      console.error("Failed to update form state:", e);
      toast.error("An error occurred while updating conditions.");
    }
  };
  return updateForm;
};

export function ConditionBuilder({ form, setForm }: ConditionBuilderProps) {
  // Use the Immer update helper
  const updateForm = useUpdateForm(form, setForm);
  const conditions = form.conditions || []; // Directly reference conditions from the form prop

  // Returns the elements eligible for conditions on a given page id
  const getElementsForPage = (pageId: string): ElementType[] => {
    if (!pageId) return [];
    const page = form.pages.find((p) => p.id === pageId);
    if (!page) return [];
    // Filter elements that can reasonably be used in conditions (e.g., inputs, selects, radios)
    // Exclude purely display elements like 'image', 'heading', 'button' for conditions
    return (page.elements || []).filter((el) =>
      ["text", "select", "radio", "checkbox", "date", "number", "email", "phone", "rating", "yesno"].includes(el.type)
    );
  };

  // Adds a new condition
  const addCondition = () => {
    // Ensure there are at least 2 pages to create meaningful navigation logic
    if (form.pages.length < 2) {
      toast.error("You need at least two pages to add conditional logic.");
      return;
    }

    updateForm((draft) => {
      const firstPage = draft.pages[0];
      const eligibleElements = getElementsForPage(firstPage.id);
      const firstElementId = eligibleElements.length > 0 ? eligibleElements[0].id : "";
      // Default target page to the *next* page if possible
      const defaultTargetPageId = draft.pages.length > 1 ? draft.pages[1].id : firstPage.id;

      const newCondition: Condition = {
        id: Date.now().toString(), // Consider uuid for better IDs
        sourcePageId: firstPage.id,
        elementId: firstElementId,
        operator: "equals", // Default operator
        value: "",
        targetPageId: defaultTargetPageId,
      };
      // Initialize conditions array if it doesn't exist
      if (!draft.conditions) {
        draft.conditions = [];
      }
      draft.conditions.push(newCondition);
    });
  };

  // Removes a condition by its id
  const removeCondition = (conditionId: string) => {
    updateForm((draft) => {
      draft.conditions = (draft.conditions || []).filter((cond) => cond.id !== conditionId);
    });
  };

  // Updates a field for a given condition
  const updateConditionField = (conditionId: string, field: keyof Condition, value: string) => {
    updateForm((draft) => {
      const conditionIndex = (draft.conditions || []).findIndex((cond) => cond.id === conditionId);
      if (conditionIndex !== -1) {
        // Handle source page change specifically to reset element
        if (field === "sourcePageId") {
          const eligibleElements = getElementsForPage(value); // 'value' is the new pageId
          const defaultElementId = eligibleElements.length > 0 ? eligibleElements[0].id : "";
          draft.conditions![conditionIndex].sourcePageId = value;
          draft.conditions![conditionIndex].elementId = defaultElementId; // Reset element
        } else {
          // Type assertion needed for dynamic key assignment
          (draft.conditions![conditionIndex] as any)[field] = value;
        }
      }
    });
  };

  // --- Render Logic ---
  return (
    <div className="w-full flex flex-col space-y-6 p-1">
      {" "}
      {/* Added padding and vertical space */}
      {/* Fixed Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">Form Logic</h2>
          <p className="text-sm text-muted-foreground">Define rules to navigate users between pages based on their answers.</p>
        </div>
        <Button
          onClick={addCondition}
          disabled={form.pages.length < 2} // Disable if less than 2 pages
          title={form.pages.length < 2 ? "Add more pages to enable logic" : "Add New Condition"}>
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>
      {/* Conditions List or Placeholder */}
      {conditions.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg">
          <p>No conditional logic added yet.</p>
          {form.pages.length >= 2 ? (
            <Button
              variant="link"
              onClick={addCondition}
              className="mt-2">
              Add your first rule
            </Button>
          ) : (
            <p className="text-xs mt-2">(Add at least two pages to the form to create logic rules)</p>
          )}
        </div>
      ) : (
        // --- Vertical List of Conditions ---
        <div className="space-y-4">
          {conditions.map((cond, index) => (
            <Card
              key={cond.id}
              className="bg-gray-50/50 border shadow-sm">
              {" "}
              {/* Subtle background */}
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Rule {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCondition(cond.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    title="Remove this rule">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* IF Part */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 p-3 border rounded bg-white">
                  <Label className="text-sm font-semibold w-10 flex-shrink-0">IF</Label>
                  {/* Source Page */}
                  <div className="flex-1 min-w-[150px]">
                    <Select
                      value={cond.sourcePageId}
                      onValueChange={(val) => updateConditionField(cond.id, "sourcePageId", val)}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Select source page" />
                      </SelectTrigger>
                      <SelectContent>
                        {form.pages.map((p, i) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="text-xs">
                            Page {i + 1}: {p.title || "Untitled"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Element */}
                  <div className="flex-1 min-w-[150px]">
                    <Select
                      value={cond.elementId}
                      onValueChange={(val) => updateConditionField(cond.id, "elementId", val)}
                      disabled={!cond.sourcePageId || getElementsForPage(cond.sourcePageId).length === 0}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue
                          placeholder={
                            !cond.sourcePageId
                              ? "Select page first"
                              : getElementsForPage(cond.sourcePageId).length === 0
                              ? "No eligible fields"
                              : "Select field"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cond.sourcePageId &&
                          getElementsForPage(cond.sourcePageId).map((element) => (
                            <SelectItem
                              key={element.id}
                              value={element.id}
                              className="text-xs">
                              {element.title || "Untitled"} ({element.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Operator */}
                  <div className="flex-1 min-w-[120px]">
                    <Select
                      value={cond.operator}
                      onValueChange={(val) => updateConditionField(cond.id, "operator", val)}
                      disabled={!cond.elementId} // Disable if no element selected
                    >
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Consider filtering operators based on element type later */}
                        <SelectItem
                          value="equals"
                          className="text-xs">
                          Equals
                        </SelectItem>
                        <SelectItem
                          value="not_equals"
                          className="text-xs">
                          Does not equal
                        </SelectItem>
                        <SelectItem
                          value="contains"
                          className="text-xs">
                          Contains
                        </SelectItem>
                        <SelectItem
                          value="greater_than"
                          className="text-xs">
                          Greater than
                        </SelectItem>
                        <SelectItem
                          value="less_than"
                          className="text-xs">
                          Less than
                        </SelectItem>
                        <SelectItem
                          value="is_empty"
                          className="text-xs">
                          Is Empty
                        </SelectItem>
                        <SelectItem
                          value="is_not_empty"
                          className="text-xs">
                          Is Not Empty
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Value */}
                  <div className="flex-1 min-w-[120px]">
                    <Input
                      value={cond.value}
                      onChange={(e) => updateConditionField(cond.id, "value", e.target.value)}
                      placeholder="Value"
                      className="text-xs h-9"
                      disabled={!cond.elementId} // Disable if no element selected
                    />
                  </div>
                </div>

                {/* THEN Part */}
                <div className="flex items-center space-x-2 p-3 border rounded bg-white">
                  <Label className="text-sm font-semibold w-16 flex-shrink-0">THEN GO TO</Label>
                  <div className="flex-1">
                    <Select
                      value={cond.targetPageId}
                      onValueChange={(val) => updateConditionField(cond.id, "targetPageId", val)}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Select target page" />
                      </SelectTrigger>
                      <SelectContent>
                        {form.pages.map((p, i) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="text-xs">
                            Page {i + 1}: {p.title || "Untitled"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              {/* Remove button was moved to the top right of the card */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
