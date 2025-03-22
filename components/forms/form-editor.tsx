"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, Page, ElementType } from "./canvas/FormCanvasTraditional"; // shared interfaces

interface FormEditorProps {
  form: Form;
  setForm: (updatedForm: Form) => void;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
}

export function FormEditor({ form, setForm, currentPageIndex, setCurrentPageIndex }: FormEditorProps) {
  // Local state for style options.
  const [width, setWidth] = useState(form.styles?.width || "800px");
  const [height, setHeight] = useState(form.styles?.height || "auto");
  const [columns, setColumns] = useState<number>(form.styles?.columns || 1);
  const [isMultiPage, setIsMultiPage] = useState(form.isMultiPage !== undefined ? form.isMultiPage : true);
  const [isActive, setIsActive] = useState(form.isActive !== undefined ? form.isActive : true);
  // New local state for form type.
  const [formType, setFormType] = useState(form.formType || "traditional");

  useEffect(() => {
    setWidth(form.styles?.width || "800px");
    setHeight(form.styles?.height || "auto");
    setColumns(form.styles?.columns || 1);
    setIsMultiPage(form.isMultiPage !== undefined ? form.isMultiPage : true);
    setIsActive(form.isActive !== undefined ? form.isActive : true);
    setFormType(form.formType || "traditional");
  }, [form]);

  const handleApplyChanges = () => {
    let updatedPages = [...form.pages];
    if (!isMultiPage && form.pages.length > 1) {
      updatedPages = [form.pages[0]];
      setCurrentPageIndex(0);
    }

    const updatedForm: Form = {
      ...form,
      isMultiPage,
      isActive,
      formType,
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
    <div className="space-y-4 p-4 border rounded bg-white">
      {/* New Title Field */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter form title"
        />
      </div>
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
      {/* Dropdown for selecting the form type */}
      <div>
        <Label htmlFor="formType">Form Type</Label>
        <select
          id="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="border rounded px-2 py-1">
          <option value="traditional">Traditional Form</option>
          <option value="typeform">Typeform Style</option>
          <option value="card">Card Type</option>
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
