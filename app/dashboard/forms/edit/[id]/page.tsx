"use client";

import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getFormToEdit } from "@/services/formService";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";
import { FormEditor } from "@/components/forms/form-editor";
import { FormStyles } from "@/components/forms/form-styles";
import { ConditionTabs } from "@/components/forms/conditions/condition-tabs";
import { FormContainer } from "@/components/forms/canvas/form-canvas";
import { PreviewForm } from "@/components/forms/form-preview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ElementToolbar } from "@/components/forms/canvas/element-toolbar";
import { FormCanvasTraditional } from "@/components/forms/canvas/FormCanvasTraditional";

interface EditFormPageProps {
  params: Promise<{ id: string }>;
}

interface Form {
  title: string;
  description: string;
  pages: Pages[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

interface Pages {
  id: string;
  title: string;
  elements: Elements[];
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

export default function EditFormPage({ params }: EditFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formId, setFormId] = useState(id);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("design"); // Modes: "design", "preview", "condition", "publish"
  const [rightTab, setRightTab] = useState("editor"); // Right panel tabs: "editor" or "style"

  const [form, setForm] = useState<Form>({
    title: "New Form",
    description: "Form description",
    pages: [
      {
        id: "1",
        title: "Page 1",
        elements: [],
      },
    ],
    styles: {
      width: "800px",
      height: "auto",
      columns: 1,
    },
    isMultiPage: true,
  });

  useEffect(() => {
    const form = getFormToEdit();
    if (form) {
      console.log("edit form", form);
      setForm(form);
    }
    fetchUser();
  }, []);

  async function fetchUser() {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      setUserId(currentUser.id);
    } else {
      console.error("No authenticated user found.");
    }
  }

  async function saveForm() {
    toast.success("Page saved successfully!");
    const formPayload = {
      user_id: userId,
      title: form.title,
      isMultiPage: form.isMultiPage,
      isActive: form.isActive,
      pages: form.pages,
      styles: form.styles,
    };

    if (formId === "new") {
      const response = await fetch(`/api/forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });
      const newForm = await response.json();
      setFormId(newForm.id);
      toast.success("Page saved successfully!");
    } else {
      const response = await fetch(`/api/forms`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formId, ...formPayload }),
      });
      const updatedForm = await response.json();
      console.log("PUT req", updatedForm);
      toast.success("Page saved successfully!");
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gap-4 p-4 bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow p-4 flex items-center justify-between">
        <Button
          onClick={saveForm}
          className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Back</span>
        </Button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-2xl font-medium">Title</label>
            <input
              type="text"
              value={form?.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-md px-2 py-1 text-sm w-64"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setIsPreviewOpen(true)}>
            <Eye className="h-5 w-5" />
            <span>Preview</span>
          </Button>
          <Button
            onClick={saveForm}
            className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Save Form</span>
          </Button>
        </div>
      </div>

      {/* Main Mode Navigation */}
      <div className="w-full bg-white shadow rounded p-2 flex justify-around">
        <Button
          variant={activeMode === "design" ? "default" : "outline"}
          onClick={() => setActiveMode("design")}>
          Design
        </Button>
        <Button
          variant={activeMode === "preview" ? "default" : "outline"}
          onClick={() => setActiveMode("preview")}>
          Preview
        </Button>
        <Button
          variant={activeMode === "condition" ? "default" : "outline"}
          onClick={() => setActiveMode("condition")}>
          Condition
        </Button>
        <Button
          variant={activeMode === "publish" ? "default" : "outline"}
          onClick={() => setActiveMode("publish")}>
          Publish
        </Button>
      </div>

      {/* Main Content */}
      {activeMode === "design" && (
        <div className="flex flex-1 gap-4">
          {/* Left Column: Element Toolbar */}
          <div className="w-64 bg-white shadow rounded p-2 overflow-auto">
            <ElementToolbar />
          </div>

          {/* Center Column: Form Builder */}
          <FormContainer
            form={form}
            setForm={setForm}
          />

          {/* Right Column: Editor & Style Panel */}
          <div className="w-80 bg-white shadow rounded overflow-hidden">
            <div className="flex border-b">
              <Button
                variant={rightTab === "editor" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRightTab("editor")}>
                Editor
              </Button>
              <Button
                variant={rightTab === "style" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setRightTab("style")}>
                Style
              </Button>
            </div>
            <div className="p-4 overflow-y-auto">
              {rightTab === "editor" && (
                <FormEditor
                  form={form}
                  setForm={setForm}
                  currentPageIndex={currentPageIndex}
                  setCurrentPageIndex={setCurrentPageIndex}
                />
              )}
              {rightTab === "style" && (
                <FormStyles
                  form={form}
                  setForm={setForm}
                  currentPageIndex={currentPageIndex}
                  selectedElement={selectedElement}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {activeMode === "preview" && (
        <div className="flex flex-1 bg-gray-200 rounded p-2 overflow-auto">
          <PreviewForm form={form} />
        </div>
      )}

      {activeMode === "condition" && (
        <div className="flex flex-1 bg-gray-200 rounded p-2 overflow-auto">
          <ConditionTabs
            form={form}
            setForm={setForm}
            currentPageIndex={currentPageIndex}
          />
        </div>
      )}

      {activeMode === "publish" && (
        <div className="flex flex-1 bg-gray-200 rounded p-2 flex-col items-center justify-center">
          <p className="mb-4">Publish your form when you’re ready.</p>
          <Button>Publish Form</Button>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
          </DialogHeader>
          <PreviewForm form={form} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
