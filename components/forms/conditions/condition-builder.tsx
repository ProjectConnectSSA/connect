"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface ConditionBuilderProps {
  form: Form;
  setForm: (form: Form) => void;
}

interface Condition {
  id: string;
  sourcePageId: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
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
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  background?: string;
}

interface Form {
  title: string;
  description: string;
  pages: Pages[];
  conditions?: Condition[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

export function ConditionBuilder({ form, setForm }: ConditionBuilderProps) {
  // Ensure conditions is initialized as an array - FIXED: use useState to track conditions
  const [conditions, setConditions] = useState<Condition[]>(form.conditions || []);

  // Reference to the inner carousel container
  const carouselRef = useRef<HTMLDivElement>(null);
  // Track if we can scroll left/right
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Update local state whenever form.conditions changes
  useEffect(() => {
    setConditions(form.conditions || []);
  }, [form.conditions]);

  // Returns the elements for a given page id
  const getElementsForPage = (pageId: string): Elements[] => {
    if (!pageId) return [];

    const page = form.pages.find((p) => p.id === pageId);
    if (!page) {
      console.warn(`Page with id ${pageId} not found`);
      return [];
    }

    return page.elements || [];
  };

  // Adds a new condition
  const addCondition = () => {
    // Make sure we have at least one page
    if (form.pages.length === 0) return;

    const firstPage = form.pages[0];
    const firstElement = firstPage.elements && firstPage.elements.length > 0 ? firstPage.elements[0].id : "";

    const newCondition: Condition = {
      id: Date.now().toString(),
      sourcePageId: firstPage.id,
      elementId: firstElement,
      operator: "equals",
      value: "",
      targetPageId: form.pages.length > 1 ? form.pages[1].id : firstPage.id,
    };

    const updatedConditions = [...conditions, newCondition];
    setForm({ ...form, conditions: updatedConditions });
  };

  // Removes a condition by its id
  const removeCondition = (conditionId: string) => {
    const updatedConditions = conditions.filter((cond) => cond.id !== conditionId);
    setForm({ ...form, conditions: updatedConditions });
  };

  // Updates a field for a given condition
  const updateCondition = (conditionId: string, field: keyof Condition, value: string) => {
    const updatedConditions = conditions.map((cond) => (cond.id === conditionId ? { ...cond, [field]: value } : cond));
    setForm({ ...form, conditions: updatedConditions });
  };

  // Special update function for source page to also update element selection
  const updateSourcePage = (conditionId: string, pageId: string) => {
    const elementsForPage = getElementsForPage(pageId);
    const defaultElementId = elementsForPage.length > 0 ? elementsForPage[0].id : "";

    const updatedConditions = conditions.map((cond) =>
      cond.id === conditionId ? { ...cond, sourcePageId: pageId, elementId: defaultElementId } : cond
    );

    setForm({ ...form, conditions: updatedConditions });
  };

  // Scroll functions for the carousel
  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  // Check scroll possibility
  const checkScrollable = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Small buffer for rounding errors
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollable);
      // Check on initial render
      checkScrollable();

      return () => {
        carousel.removeEventListener("scroll", checkScrollable);
      };
    }
  }, [conditions.length]); // Re-run when conditions change

  // Check scroll possibility after render/resize
  useEffect(() => {
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [conditions.length]);

  // Debug - log what we have in conditions
  useEffect(() => {
    console.log("Current conditions:", conditions);
    console.log("Form conditions:", form.conditions);
  }, [conditions, form.conditions]);

  return (
    <div className="w-full flex flex-col">
      {/* Fixed header with add button - this stays in place */}
      <div className="w-full flex items-center justify-between mb-4 sticky top-0 bg-background z-10">
        <div>
          <h2 className="text-lg font-semibold">Form Logic</h2>
          <p className="text-sm text-muted-foreground">Set up conditional navigation between pages</p>
        </div>
        <Button
          variant="outline"
          onClick={addCondition}
          disabled={form.pages.length === 0}
          className="h-10 w-10 flex-shrink-0 rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* If there are no conditions */}
      {conditions.length === 0 ? (
        <div className="text-sm text-muted-foreground">No conditions added yet.</div>
      ) : (
        <div className="w-full relative">
          {/* Carousel container with overflow control */}
          <div
            ref={carouselRef}
            className="w-full overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {/* Inner container with spacing */}
            <div className="flex space-x-4 w-max">
              {conditions.map((cond, index) => (
                <Card
                  key={cond.id}
                  className="w-80 flex-shrink-0">
                  <CardHeader>
                    <CardTitle className="text-sm">Condition {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Source Page selection */}
                    <div className="flex flex-col space-y-1">
                      <Label className="text-xs">Source Page</Label>
                      <Select
                        value={cond.sourcePageId}
                        onValueChange={(val) => updateSourcePage(cond.id, val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source page" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.pages.map((p, i) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}>
                              Page {i + 1}: {p.title || "Untitled Page"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* If Field selection */}
                    <div className="flex flex-col space-y-1">
                      <Label className="text-xs">If Field</Label>
                      <Select
                        value={cond.elementId}
                        onValueChange={(val) => updateCondition(cond.id, "elementId", val)}
                        disabled={!cond.sourcePageId}>
                        <SelectTrigger>
                          <SelectValue placeholder={!cond.sourcePageId ? "Select source page first" : "Select field"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cond.sourcePageId &&
                            getElementsForPage(cond.sourcePageId).map((element) => (
                              <SelectItem
                                key={element.id}
                                value={element.id}>
                                {element.title || "Untitled Element"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Operator selection */}
                    <div className="flex flex-col space-y-1">
                      <Label className="text-xs">Operator</Label>
                      <Select
                        value={cond.operator}
                        onValueChange={(val) => updateCondition(cond.id, "operator", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Does not equal</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greater_than">Greater than</SelectItem>
                          <SelectItem value="less_than">Less than</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value input */}
                    <div className="flex flex-col space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input
                        value={cond.value}
                        onChange={(e) => updateCondition(cond.id, "value", e.target.value)}
                        placeholder="Enter value"
                      />
                    </div>

                    {/* Target Page selection */}
                    <div className="flex flex-col space-y-1">
                      <Label className="text-xs">Go to Page</Label>
                      <Select
                        value={cond.targetPageId}
                        onValueChange={(val) => updateCondition(cond.id, "targetPageId", val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select page" />
                        </SelectTrigger>
                        <SelectContent>
                          {form.pages.map((p, i) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}>
                              Page {i + 1}: {p.title || "Untitled Page"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      onClick={() => removeCondition(cond.id)}
                      className="w-full text-red-500 flex items-center justify-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation buttons - shown only when scrolling is possible */}
          {conditions.length > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              <Button
                onClick={scrollPrev}
                variant="ghost"
                disabled={!canScrollLeft}
                className={!canScrollLeft ? "opacity-50" : ""}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={scrollNext}
                variant="ghost"
                disabled={!canScrollRight}
                className={!canScrollRight ? "opacity-50" : ""}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
