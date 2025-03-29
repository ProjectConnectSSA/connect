// src/app/forms/[id]/edit/page.tsx (or your actual path)
"use client";

import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// --- Import Central Types ---
import type { Form, Page, ElementType, Condition } from "@/app/types/form"; // Adjust path if necessary

// --- Import Actions ---
import { getCurrentUser } from "@/app/actions"; // Assuming path is correct

// --- Import UI Components ---
import { FormEditor } from "@/components/forms/form-editor";
import { FormStyles } from "@/components/forms/form-styles";
import { ConditionTabs } from "@/components/forms/conditions/condition-tabs";
import { PreviewForm } from "@/components/forms/form-preview";
import { ElementToolbar } from "@/components/forms/canvas/element-toolbar";
import { FormContainer } from "@/components/forms/canvas/FormCanvas";
import PublishOptions from "@/components/forms/form-publish";

// --- Page Props Interface ---
interface EditFormPageProps {
  params: { id: string };
}

// --- Default Form State ---
const DEFAULT_NEW_FORM: Form = {
  title: "New Form",
  description: "Form description",
  pages: [
    {
      id: Date.now().toString(),
      title: "Page 1",
      elements: [],
    },
  ],
  conditions: [],
  styles: { width: "800px", height: "auto", columns: 1 },
  isMultiPage: true,
  isActive: false,
};

export default function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  // --- State Variables ---
  const [form, setForm] = useState<Form>(DEFAULT_NEW_FORM);
  const [formId, setFormId] = useState<string | null>(id === "new" ? null : id);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<{ element: ElementType; pageIndex: number } | null>(null);
  const [activeMode, setActiveMode] = useState("design");
  const [rightTab, setRightTab] = useState<"editor" | "style">("editor");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Effects ---
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadInitialData() {
      try {
        // Fetch user ID first
        const currentUser = await getCurrentUser();
        if (isMounted) {
          if (currentUser) {
            setUserId(currentUser.id);
          } else {
            console.error("No authenticated user found.");
            toast.error("Authentication error. Cannot load or save form.");
            // return; // Prevent further loading if user is required
          }
        } else {
          return;
        } // Exit if unmounted

        // Load form data
        if (id && id !== "new") {
          // --- Direct API Fetch for Existing Form ---
          console.log(`Fetching form data for ID: ${id}`);
          try {
            // **ASSUMPTION:** Your API has an endpoint like GET /api/forms?id=your_form_id
            // Adjust the URL and method if your API structure is different.
            const response = await fetch(`/api/forms?id=${id}`, { method: "GET" });

            if (!response.ok) {
              let errorMsg = `HTTP error ${response.status}`;
              try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
              } catch (_) {}
              throw new Error(`Failed to fetch form: ${errorMsg}`);
            }

            const loadedForm: Form = await response.json();

            if (isMounted) {
              if (loadedForm && loadedForm.id) {
                // Check if form and ID exist in response
                setForm(loadedForm);
                setFormId(loadedForm.id);
                setCurrentPageIndex(0); // Reset page index on load
              } else {
                // Handle case where API returns success but no valid form data
                throw new Error("Invalid form data received from API.");
              }
            }
          } catch (fetchError) {
            console.error("Error fetching form:", fetchError);
            if (isMounted) {
              toast.error(`Failed to load form ${id}: ${fetchError instanceof Error ? fetchError.message : "Unknown fetch error"}`);
              // router.replace('/dashboard'); // Optional: Redirect on fetch failure
            }
          }
          // --- End Direct API Fetch ---
        } else {
          // It's a new form, use default
          if (isMounted) {
            setForm(DEFAULT_NEW_FORM);
            setFormId(null);
            setCurrentPageIndex(0);
          }
        }
      } catch (error) {
        // Catch errors from getCurrentUser or unexpected issues
        console.error("Error during initial data load:", error);
        if (isMounted) {
          toast.error("An error occurred while loading initial data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [id, router]); // Dependency: id (from route)

  // --- Actions ---
  async function saveForm() {
    if (!userId) {
      toast.error("Cannot save form. User not identified.");
      return;
    }
    setIsSaving(true);
    toast.info("Saving form...");

    const formPayload: Partial<Form> & { user_id: string; id?: string } = {
      user_id: userId,
      title: form.title,
      description: form.description,
      isMultiPage: form.isMultiPage,
      isActive: form.isActive,
      pages: form.pages,
      conditions: form.conditions,
      styles: form.styles,
      background: form.background,
    };

    let response: Response | null = null;
    let savedOrUpdatedForm: Form | null = null;
    const apiUrl = "/api/forms"; // Your API endpoint

    try {
      let method: "POST" | "PUT";
      let body: string;

      if (formId) {
        // Update
        method = "PUT";
        formPayload.id = formId; // Include ID for PUT
        body = JSON.stringify(formPayload);
      } else {
        // Create
        method = "POST";
        body = JSON.stringify(formPayload); // Don't send ID for POST
      }

      response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) {
        let errorMsg = `HTTP error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (_) {}
        throw new Error(`Failed to save form: ${errorMsg}`);
      }

      savedOrUpdatedForm = await response.json();

      if (savedOrUpdatedForm && savedOrUpdatedForm.id) {
        toast.success("Form saved successfully!");
        setForm(savedOrUpdatedForm); // Update state with response data

        if (!formId) {
          // If it was a new form
          setFormId(savedOrUpdatedForm.id);
          router.replace(`/forms/${savedOrUpdatedForm.id}/edit`, { scroll: false }); // Update URL
        }
      } else {
        throw new Error("Invalid response received after saving form.");
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error(`Error saving form: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  }

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading Form Builder...</span>
      </div>
    );
  }

  return (
    // Main container takes full screen height
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {" "}
      {/* Prevent body scroll */}
      <Tabs
        value={activeMode}
        onValueChange={setActiveMode}
        // Use flex layout to make Tabs fill remaining space
        className="flex flex-col flex-1 overflow-hidden">
        {" "}
        {/* Prevent Tabs scroll */}
        {/* Header (Fixed Height) */}
        <div className="flex items-center justify-between w-full bg-white shadow-md border-b p-2 sticky top-0 z-20 flex-shrink-0">
          {/* ... header content ... */}
          <span
            className="text-sm font-medium text-gray-700 hidden md:block truncate max-w-[200px] pl-2"
            title={form.title}>
            {form.title || "Untitled Form"}
          </span>
          <TabsList className="mx-auto bg-gray-100">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="condition">Conditions</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button
              onClick={saveForm}
              disabled={isSaving}
              size="sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Form"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}>
              Exit
            </Button>
          </div>
        </div>
        {/* Tab Content Area (Takes remaining space and handles its own scroll) */}
        {/* Use flex-1 to make this div take remaining vertical space */}
        {/* Use overflow-hidden to contain child overflows */}
        <div className="flex-1 overflow-hidden">
          {/* Design Tab */}
          {/* Ensure h-full is applied and children manage their own overflow */}
          <TabsContent
            value="design"
            className="h-full p-0 m-0 outline-none focus:ring-0">
            <div className="flex h-full gap-4 p-4 overflow-hidden">
              {/* Toolbar */}
              <div className="w-60 flex-shrink-0 bg-white shadow-lg rounded-lg border overflow-y-auto">
                <ElementToolbar />
              </div>
              {/* Canvas */}
              <div className="flex-1 flex flex-col bg-white shadow-lg rounded-lg border overflow-hidden">
                <FormContainer
                  form={form}
                  setForm={setForm}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  currentPageIndex={currentPageIndex}
                  setCurrentPageIndex={setCurrentPageIndex}
                />
              </div>
              {/* Properties Panel */}
              <div className="w-80 flex-shrink-0 bg-white shadow-lg rounded-lg border overflow-hidden flex flex-col">
                {/* ... Properties Panel Tabs ... */}
                <div className="flex border-b flex-shrink-0">
                  <Button
                    variant={rightTab === "editor" ? "secondary" : "ghost"}
                    onClick={() => setRightTab("editor")} /* ... */
                  >
                    {" "}
                    Properties{" "}
                  </Button>
                  <Button
                    variant={rightTab === "style" ? "secondary" : "ghost"}
                    onClick={() => setRightTab("style")} /* ... */
                  >
                    {" "}
                    Style{" "}
                  </Button>
                </div>
                {/* Make content area scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  {rightTab === "editor" && (
                    <FormEditor
                      form={form}
                      setForm={setForm}
                      currentPageIndex={currentPageIndex}
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
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
                  {!selectedElement && <div /* ...placeholder... */ />}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          {/* Apply h-full and overflow-auto to the direct child div */}
          <TabsContent
            value="preview"
            className="h-full p-0 m-0 outline-none focus:ring-0">
            {/* This div takes full height and scrolls its content */}
            <div className="h-full overflow-y-auto bg-gray-200 p-4 md:p-8 flex justify-center">
              {/* Max-width container for the preview itself */}
              <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl border">
                {/* Let PreviewForm manage its internal structure */}
                <PreviewForm form={form} />
              </div>
            </div>
          </TabsContent>

          {/* Condition Tab */}
          {/* Apply h-full and overflow-auto to the direct child div */}
          <TabsContent
            value="condition"
            className="h-full p-0 m-0 outline-none focus:ring-0">
            {/* This div takes full height and scrolls its content */}
            <div className="h-full overflow-y-auto bg-gray-200 p-4 md:p-8">
              {/* Centered max-width container */}
              <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto p-6 border">
                {/* Let ConditionTabs/ConditionFlow manage internal structure */}
                {/* Choose one: */}
                <ConditionTabs
                  form={form}
                  setForm={setForm}
                />
                {/* <ConditionFlow form={form} setForm={setForm} /> */}
              </div>
            </div>
          </TabsContent>

          {/* Publish Tab */}
          {/* Apply h-full and overflow-auto to the direct child div */}
          <TabsContent
            value="publish"
            className="h-full p-0 m-0 outline-none focus:ring-0">
            {/* This div takes full height and scrolls its content */}
            <div className="h-full overflow-y-auto bg-gray-200 p-4 md:p-8">
              {/* Centered max-width container */}
              <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6 border">
                <h2 className="text-xl font-semibold mb-4">Publish & Share</h2>
                {formId ? (
                  <PublishOptions formId={formId} />
                ) : (
                  <div className="text-center text-gray-600 py-8">Please save the form first to get publishing options.</div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
