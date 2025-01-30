"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface ConditionBuilderProps {
  form: any;
  setForm: (form: any) => void;
  currentPageIndex: number;
}

export function ConditionBuilder({ form, setForm, currentPageIndex }: ConditionBuilderProps) {
  const currentPage = form.pages[currentPageIndex];

  const getAllElements = () => {
    return form.pages.flatMap((page: any) =>
      page.elements.map((element: any) => ({
        id: element.id,
        label: `${element.title} (Page ${page.title})`,
      }))
    );
  };

  const availableElements = currentPage.elements || [];
  const firstElementId = availableElements.length > 0 ? availableElements[0].id : "";

  const addCondition = () => {
    const updatedPages = form.pages.map((page: any, index: number) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          condition: {
            id: Date.now().toString(),
            elementId: firstElementId, // Automatically select the first element
            operator: "equals",
            value: "",
            targetPageId: form.pages[0]?.id || "",
          },
        };
      }
      return page;
    });

    setForm({ ...form, pages: updatedPages });
  };

  const removeCondition = () => {
    const updatedPages = form.pages.map((page: any, index: number) => {
      if (index === currentPageIndex) {
        return { ...page, condition: null };
      }
      return page;
    });

    setForm({ ...form, pages: updatedPages });
  };

  const updateCondition = (field: string, value: string) => {
    const updatedPages = form.pages.map((page: any, index: number) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          condition: { ...page.condition, [field]: value },
        };
      }
      return page;
    });

    setForm({ ...form, pages: updatedPages });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold">Form Logic</h2>
        <p className="text-sm text-muted-foreground">Set up conditional navigation between pages</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Page {currentPageIndex + 1}: {currentPage.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentPage.condition ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex flex-col space-y-2">
                <Label>If Field</Label>
                <Select
                  value={currentPage.condition.elementId}
                  onValueChange={(value) => updateCondition("elementId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAllElements().map((element: any) => (
                      <SelectItem
                        key={element.id}
                        value={element.id}>
                        {element.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Operator</Label>
                <Select
                  value={currentPage.condition.operator}
                  onValueChange={(value) => updateCondition("operator", value)}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div className="flex flex-col space-y-2">
                <Label>Value</Label>
                <Input
                  value={currentPage.condition.value}
                  onChange={(e) => updateCondition("value", e.target.value)}
                  placeholder="Enter value"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label>Go to Page</Label>
                <Select
                  value={currentPage.condition.targetPageId}
                  onValueChange={(value) => updateCondition("targetPageId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.pages.map((p: any, i: number) => (
                      <SelectItem
                        key={p.id}
                        value={p.id}>
                        Page {i + 1}: {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={addCondition}
              disabled={availableElements.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Add Condition
            </Button>
          )}

          {currentPage.condition && (
            <Button
              variant="ghost"
              className="w-full text-red-500 flex items-center justify-center"
              onClick={removeCondition}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Condition
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
