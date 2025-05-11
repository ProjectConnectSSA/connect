"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
// Removed direct Supabase client import
import LinkEditor from "@/components/links/link-element";
import LinkCanvas from "@/components/links/link-canvas";
import LinkStyle from "@/components/links/link-styles";
import LinkSettings from "@/components/links/link-settings";
import Navbar from "@/components/links/navbar";
import { BioElement, BioElementType, PageData, StyleProps, defaultStyles } from "@/app/types/links/types";
import { Palette, Settings, Loader2 } from "lucide-react"; // Added Loader2

// Initial state for a new page
const initialNewPageData: PageData = {
  id: undefined, // ID is null for a new page until saved
  slug: "", // Slug will be set by user or API
  elements: [],
  styles: defaultStyles,
  customDomain: null,
  active: true,
};

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const pageIdOrSlugParam = params?.slug as string | undefined; // Could be "new", an ID, or a slug

  const [pageData, setPageData] = useState<PageData>(initialNewPageData);
  const [isNewPage, setIsNewPage] = useState(false); // Track if it's a new page scenario
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"style" | "settings">("style");

  // --- Data Fetching & New Page Handling ---
  useEffect(() => {
    // Determine if it's the "new page" route
    const isExplicitNew = pageIdOrSlugParam === "new";
    setIsNewPage(isExplicitNew);

    if (isExplicitNew) {
      console.log("Detected 'new' page route.");
      setPageData(initialNewPageData); // Reset to clean state
      setIsLoading(false);
      toast.info("Creating a new page. Set details in Settings and Save.");
      // No URL change needed here yet
      return; // Stop fetching
    }

    // If not "new", try fetching based on the param (assuming it's an ID or slug)
    if (!pageIdOrSlugParam) {
      console.error("No page ID or slug found in URL.");
      toast.error("Invalid page URL.");
      setIsLoading(false);
      router.push("/dashboard/links"); // Redirect if URL is bad
      return;
    }

    const fetchPageData = async () => {
      setIsLoading(true);
      console.log(`Fetching page data for param: ${pageIdOrSlugParam}`);
      try {
        // Use API route - Pass param which could be ID or slug
        // API needs logic to handle lookup by ID or Slug
        // Let's assume API GET handles lookup by ID primarily,
        // or you could have `/api/links/slug/:slug` vs `/api/links/:id`
        // For simplicity, let's assume GET /api/links can handle an ID param
        // If your API expects slug, use: /api/links?slug=${pageIdOrSlugParam}
        const response = await fetch(`/api/links/${pageIdOrSlugParam}`); // Adjust API path if needed

        if (response.status === 404) {
          console.log("Page not found via API, redirecting or showing error.");
          toast.error(`Page "${pageIdOrSlugParam}" not found.`);
          setIsLoading(false);
          router.push("/dashboard/links"); // Or show a "Not Found" component
          return;
        }

        if (!response.ok) {
          let errorMsg = `Error loading page: ${response.statusText}`;
          try {
            const errData = await response.json();
            errorMsg = errData.error || errData.message || errorMsg;
          } catch {}
          throw new Error(errorMsg);
        }

        const apiData = await response.json();
        // Assuming API returns the single page object directly now, not nested under 'data'
        const loadedPageData: PageData = apiData;

        console.log("Data fetched via API:", loadedPageData);
        const loadedElements = Array.isArray(loadedPageData.elements) ? loadedPageData.elements : [];
        const loadedStyles = loadedPageData.styles ? { ...defaultStyles, ...loadedPageData.styles } : defaultStyles;

        setPageData({
          id: loadedPageData.id, // Set the ID from fetched data
          slug: loadedPageData.slug || "", // Ensure slug is a string
          elements: loadedElements,
          styles: loadedStyles,
          customDomain: loadedPageData.customDomain || null,
          active: loadedPageData.active ?? true,
        });
        setIsNewPage(false); // It's an existing page
        toast.success("Page data loaded.");
      } catch (error: any) {
        console.error("API fetch error:", error);
        toast.error(`Error loading page: ${error.message}`);
        // Maybe redirect on critical fetch errors too
        // router.push("/dashboard/links");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [pageIdOrSlugParam, router]); // Depend on the param from the URL

  // --- State Handlers (Immutable Updates - Remain the same) ---
  const handleUpdateElement = useCallback((id: string, updatedData: Partial<BioElement>) => {
    /* ... no change ... */
    setPageData((prev) => ({ ...prev, elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)) }));
  }, []);
  const handleDeleteElement = useCallback((id: string) => {
    /* ... no change ... */
    setPageData((prev) => {
      const elementToDelete = prev.elements.find((el) => el.id === id);
      if (!elementToDelete) return prev;
      const childrenIdsToRemove: string[] = [];
      if (elementToDelete.type.startsWith("layout-") && elementToDelete.columns) {
        elementToDelete.columns.forEach((column) => {
          if (column) {
            column.forEach((child) => childrenIdsToRemove.push(child.id));
          }
        });
      }
      const allIdsToRemove = new Set([id, ...childrenIdsToRemove]);
      const nextElements = prev.elements.filter((el) => !allIdsToRemove.has(el.id));
      toast.warning(`Element${childrenIdsToRemove.length > 0 ? " and its content" : ""} deleted.`);
      return { ...prev, elements: nextElements };
    });
  }, []);
  const handleChangeStyle = useCallback((newStyles: Partial<StyleProps>) => {
    /* ... no change ... */
    setPageData((prev) => ({ ...prev, styles: { ...prev.styles, ...newStyles } }));
  }, []);
  const handleCustomDomainChange = useCallback((domain: string) => {
    /* ... no change ... */
    setPageData((prev) => ({ ...prev, customDomain: domain.trim() || null }));
  }, []);
  const handleSlugChange = useCallback((newSlug: string) => {
    /* ... no change ... */
    const validSlug = newSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setPageData((prev) => ({ ...prev, slug: validSlug }));
  }, []);
  const handleActiveChange = useCallback((active: boolean) => {
    /* ... no change ... */
    setPageData((prev) => ({ ...prev, active }));
  }, []);

  // --- Drag & Drop (Remain the same) ---
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, elementType: BioElementType | string) => {
    /* ... no change ... */
    e.dataTransfer.setData("elementType", elementType as string);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetLayoutId?: string, targetColumnIndex?: number) => {
    /* ... no change ... */
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType") as BioElementType;
    if (!elementType) return;
    const newElementBase: Omit<BioElement, "order"> = {
      id: crypto.randomUUID(),
      type: elementType,
      ...(elementType.startsWith("layout-") && { columns: elementType === "layout-two-columns" ? [[], []] : [[]] }),
    };
    setPageData((prev) => {
      let finalElements = [...prev.elements];
      if (targetLayoutId !== undefined && targetColumnIndex !== undefined) {
        const parentIndex = finalElements.findIndex((el) => el.id === targetLayoutId);
        if (parentIndex === -1) {
          console.error("Parent layout not found!");
          toast.error("Could not add element: Parent layout not found.");
          return prev;
        }
        const parentElement = finalElements[parentIndex];
        const newElementInColumn: BioElement = {
          ...newElementBase,
          parentId: targetLayoutId,
          columnIndex: targetColumnIndex,
          order: parentElement.columns?.[targetColumnIndex]?.length || 0,
        };
        finalElements = finalElements.map((el) => {
          if (el.id === targetLayoutId) {
            const newColumns = (el.columns || []).map((col, index) =>
              index === targetColumnIndex ? [...(col || []), newElementInColumn] : col || []
            );
            while (newColumns.length <= targetColumnIndex) {
              newColumns.push(targetColumnIndex === newColumns.length ? [newElementInColumn] : []);
            }
            return { ...el, columns: newColumns };
          }
          return el;
        });
        finalElements.push(newElementInColumn);
        toast.success(`${elementType} added to column ${targetColumnIndex + 1}.`);
      } else {
        const rootElements = finalElements.filter((el) => !el.parentId);
        const newElementRoot: BioElement = { ...newElementBase, order: rootElements.length };
        finalElements.push(newElementRoot);
        toast.success(`${elementType} added.`);
      }
      return { ...prev, elements: finalElements };
    });
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    /* ... no change ... */
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const handleReorderElements = useCallback((newElementsState: BioElement[]) => {
    /* ... no change ... */
    setPageData((prev) => ({ ...prev, elements: newElementsState }));
  }, []);

  // --- Save Page using API ---
  const handleSave = async () => {
    if (!pageData.slug) {
      // Basic check: ensure slug is set before saving
      toast.error("Please set a Page Slug in Settings before saving.", {
        action: { label: "Go to Settings", onClick: () => setRightPanelTab("settings") },
      });
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    toast.loading("Saving page data...");

    const method = isNewPage ? "POST" : "PUT";
    const apiUrl = "/api/links"; // Use base URL for both POST and PUT

    // Prepare payload - API handles assigning user_id
    const payload = {
      slug: pageData.slug,
      custom_domain: pageData.customDomain || null,
      elements: pageData.elements,
      styles: pageData.styles,
      active: pageData.active,
      // Include 'id' only for PUT requests
      ...(method === "PUT" && { id: pageData.id }),
    };

    console.log(`Saving (${method}) data to ${apiUrl}:`, payload);

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json(); // Try parsing JSON regardless of status for error details

      if (!response.ok) {
        console.error("API save error response:", responseData);
        throw new Error(responseData.error || responseData.message || `Save failed: ${response.statusText}`);
      }

      // --- Success ---
      const savedPageData: PageData = responseData; // Assuming API returns the saved object
      console.log("Save successful, API response:", savedPageData);
      toast.dismiss();
      toast.success("Page saved successfully!");

      // Update local state with potentially updated data (like ID from POST)
      setPageData((prev) => ({
        ...prev,
        id: savedPageData.id, // ** Crucial: Get ID from response **
        slug: savedPageData.slug || prev.slug, // Use returned slug or keep current
      }));

      // If it was a new page, update the URL and the state flag
      if (isNewPage && savedPageData.id) {
        // Replace URL with the new ID, don't add to history
        router.replace(`/dashboard/links/edit/${savedPageData.id}`, { scroll: false });
        setIsNewPage(false); // It's no longer a new page
      } else if (pageData.slug !== savedPageData.slug) {
        // If slug changed on update, update URL (optional, might be jarring)
        // router.replace(`/dashboard/links/edit/${savedPageData.id}`, { scroll: false });
      }
    } catch (error: any) {
      console.error("API save error:", error);
      toast.dismiss();
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading Editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar passes the current slug for display */}
      <Navbar
        onSave={handleSave}
        isSaving={isSaving}
        pageSlug={pageData.slug || (isNewPage ? "New Page" : "...")} // Display current slug or placeholder
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Element Palette */}
        <div className="w-64 border-r bg-white overflow-y-auto flex-shrink-0">
          <LinkEditor onDragStart={handleDragStart} />
        </div>

        {/* Center Panel: Canvas/Preview */}
        <div className="flex-1 flex justify-center items-start overflow-hidden">
          <LinkCanvas
            elements={pageData.elements}
            styles={pageData.styles}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            updateElement={handleUpdateElement}
            deleteElement={handleDeleteElement}
            onReorderElements={handleReorderElements}
          />
        </div>

        {/* Right Panel: Style & Settings */}
        <div className="w-72 border-l bg-white flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setRightPanelTab("style")}
              className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-1 ${
                rightPanelTab === "style" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:bg-gray-50"
              }`}>
              <Palette size={16} /> Style
            </button>
            <button
              onClick={() => setRightPanelTab("settings")}
              className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-1 ${
                rightPanelTab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:bg-gray-50"
              }`}>
              <Settings size={16} /> Settings
            </button>
          </div>
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === "style" ? (
              <LinkStyle
                styles={pageData.styles}
                onChangeStyle={handleChangeStyle}
              />
            ) : (
              <LinkSettings
                // Key prop forces remount if ID changes (e.g., after first save)
                // ensuring settings reflect the correct page state. Optional but can help.
                // key={pageData.id || 'new'}
                slug={pageData.slug}
                customDomain={pageData.customDomain}
                active={pageData.active}
                isSaving={isSaving}
                isLoading={isLoading} // Pass loading state if needed
                onSlugChange={handleSlugChange}
                onCustomDomainChange={handleCustomDomainChange}
                onActiveChange={handleActiveChange}
                // Removed onSave - triggered by Navbar now
                isNewPage={isNewPage} // Pass isNewPage status
              />
            )}
          </div>
        </div>
      </div>
      <Toaster
        richColors
        position="bottom-right"
        closeButton
      />
    </div>
  );
}
