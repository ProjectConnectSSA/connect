"use client";

import { Button } from "@/components/ui/button";
import { Plus, Paintbrush, Settings, GitBranch, Save, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { UUID } from "crypto";
import { getFormToEdit } from "@/services/formService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";
import { FormEditor } from "@/components/forms/form-editor";
import { FormStyles } from "@/components/forms/form-styles";
import { ConditionBuilder } from "@/components/forms/conditions/condition-builder";
import { FormCanvas } from "@/components/forms/canvas/form-canvas";
import { PreviewForm } from "@/components/forms/form-preview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface Conditions {}

export default function EditFormPage({ params }: EditFormPageProps) {
  const unwrappedParams = React.use(params);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { id } = unwrappedParams;
  const [formId, setFormId] = useState(id);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    // Control single/multi-page
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
    toast.success("page saved successfully!");
    const formPayload = {
      user_id: userId,
    };
    console.log("payload", form);
    /*
    if (formId === "new") {
      const response = await fetch(`/api/forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });
      toast.success("page saved successfully!");
      const newForm = await response.json();
      setFormId(newForm.id);
    } else {
      const response = await fetch(`/api/forms`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formId,
        }),
      });
      const updatedForm = await response.json();
      console.log("put req", updatedForm);
      toast.success("page saved successfully!");
    }*/
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Header */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{id === "new" ? "Create New Form" : "Edit Form"}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-2x1 font-medium">Title</label>
                <input
                  type="text"
                  value={form?.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="border rounded-md px-2 py-1 text-sm w-64"
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

          <FormCanvas
            form={form}
            setForm={setForm}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
          />
        </div>
      </div>
      {/* Righ Side: Editor */}
      <div className="w-80 border-l">
        <Tabs
          defaultValue="editor"
          className="h-full">
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between p-4">
              <TabsList className="flex">
                <TabsTrigger
                  value="editor"
                  className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger
                  value="styles"
                  className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Styles
                </TabsTrigger>
                <TabsTrigger
                  value="Logic"
                  className="flex items-center gap-2">
                  <GitBranch className="mr-2 h-4 w-4" />
                  Logic
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <TabsContent
            value="editor"
            className="p-4 overflow-y-auto h-full">
            <FormEditor
              form={form}
              setForm={setForm}
              currentPageIndex={currentPageIndex}
              setCurrentPageIndex={setCurrentPageIndex}
            />
          </TabsContent>
          <TabsContent
            value="styles"
            className="p-4 overflow-y-auto h-full">
            <FormStyles
              form={form}
              setForm={setForm}
              currentPageIndex={currentPageIndex}
              selectedElement={selectedElement}
            />
          </TabsContent>
          <TabsContent
            value="Logic"
            className="p-4 overflow-y-auto h-full">
            <ConditionBuilder
              form={form}
              setForm={setForm}
              currentPageIndex={currentPageIndex}
            />
          </TabsContent>
        </Tabs>
      </div>

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
