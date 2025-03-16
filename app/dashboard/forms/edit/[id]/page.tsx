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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import PublishOptions from "@/components/forms/form-publish";
interface EditFormPageProps {
  params: Promise<{ id: string }>;
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

export default function EditFormPage({ params }: EditFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formId, setFormId] = useState(id);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("design"); // Modes: design, preview, condition, publish
  const [rightTab, setRightTab] = useState("editor"); // Right panel tabs: editor or style

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
    conditions: [],
    styles: {
      width: "800px",
      height: "auto",
      columns: 1,
    },
    isMultiPage: true,
  });

  const router = useRouter();

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
      conditions: form.conditions,
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
    <div className="w-full flex flex-col bg-gray-50">
      {/* Navigation Tabs with Save and Exit Buttons */}
      <Tabs
        value={activeMode}
        onValueChange={setActiveMode}>
        <div className="flex items-center justify-between w-full bg-white shadow rounded p-2">
          <TabsList className="flex space-x-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="condition">Condition</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Button onClick={saveForm}>Save</Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}>
              Exit
            </Button>
          </div>
        </div>

        <TabsContent value="design">
          <div className="w-full flex gap-4 mt-4">
            {/* Left Column: Element Toolbar */}
            <div className="w-64 bg-white shadow rounded p-2 overflow-auto">
              <ElementToolbar />
            </div>

            {/* Center Column: Form Builder (centered) */}
            <div className="flex-1 flex justify-center">
              <FormContainer
                form={form}
                setForm={setForm}
              />
            </div>

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
        </TabsContent>

        <TabsContent value="preview">
          <div className="flex flex-1 bg-gray-200 rounded p-2 overflow-auto">
            <PreviewForm form={form} />
          </div>
        </TabsContent>

        <TabsContent value="condition">
          <div className="flex flex-1 bg-gray-200 rounded p-2 ">
            <ConditionTabs
              form={form}
              setForm={setForm}
            />
          </div>
        </TabsContent>

        <TabsContent value="publish">
          <div className="flex flex-1 bg-gray-200 rounded p-2 flex-col items-center justify-center">
            <PublishOptions formId={formId} />
          </div>
        </TabsContent>
      </Tabs>

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
