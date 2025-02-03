"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// If you have a Switch or Toggle from your UI library:
import { Switch } from "@/components/ui/switch";

// Types
interface Form {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  // Add a styles object that can hold form-wide styling info
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  // A simple boolean to track if the form is multi-page
  isMultiPage?: boolean;
  isActive?: boolean;
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
  styles?: {};
  background?: string;
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

interface FormEditorProps {
  form: Form;
  setForm: (updatedForm: Form) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

export function FormEditor({ form, setForm, currentPageIndex, setCurrentPageIndex }: FormEditorProps) {
  // Local states to manage input before applying changes to the main form
  const [width, setWidth] = useState(form.styles?.width || "800px");
  const [height, setHeight] = useState(form.styles?.height || "auto");
  const [columns, setColumns] = useState<number>(form.styles?.columns || 1);
  const [isMultiPage, setIsMultiPage] = useState(form.isMultiPage !== undefined ? form.isMultiPage : true);
  const [isActive, setIsActive] = useState(form.isActive !== undefined ? form.isActive : true);

  // Whenever form changes externally, make sure our local states stay in sync
  useEffect(() => {
    setWidth(form.styles?.width || "800px");
    setHeight(form.styles?.height || "auto");
    setColumns(form.styles?.columns || 1);
    setIsMultiPage(form.isMultiPage !== undefined ? form.isMultiPage : true);
    setIsActive(form.isActive !== undefined ? form.isActive : true);
  }, [form]);

  // Apply any changes back to the main form state
  const handleApplyChanges = () => {
    // If user switched to single-page while there are multiple pages,
    // decide whether to remove extra pages or keep them hidden.
    // Here we remove them for simplicity.
    let updatedPages = [...form.pages];
    if (!isMultiPage && form.pages.length > 1) {
      updatedPages = [form.pages[0]];
      setCurrentPageIndex(0);
    }

    const updatedForm: Form = {
      ...form,
      isMultiPage,
      isActive,
      styles: {
        ...form.styles,
        width,
        height,
        columns,
      },
      pages: updatedPages,
    };

    setForm(updatedForm);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="width">Form Width</Label>
        <Input
          id="width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          placeholder="e.g. 800px or 100%"
        />
      </div>

      <div>
        <Label htmlFor="height">Form Height</Label>
        <Input
          id="height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="e.g. 600px or auto"
        />
      </div>

      <div>
        <Label htmlFor="columns">Columns</Label>
        <select
          id="columns"
          value={columns}
          onChange={(e) => setColumns(parseInt(e.target.value, 10))}
          className="border rounded px-2 py-1">
          <option value={1}>Single Column</option>
          <option value={2}>Double Column</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={isMultiPage}
          onCheckedChange={setIsMultiPage}
          id="multiPageSwitch"
        />
        <Label htmlFor="multiPageSwitch">Multi-Page</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          id="activeSwitch"
        />
        <Label htmlFor="activeSwitch">Active</Label>
      </div>

      <Button onClick={handleApplyChanges}>Apply Changes</Button>
    </div>
  );
}
