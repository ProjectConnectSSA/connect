"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

import LinkEditor from "@/components/links/link-element";
import LinkCanvas from "@/components/links/link-canvas";
import LinkStyle from "@/components/links/link-styles";
import LinkSettings from "@/components/links/link-settings";
import Navbar from "@/components/links/navbar";
import { BioElement, BioElementType, PageData, StyleProps } from "@/app/types/links/types";
import { Palette, Settings, Loader2 } from "lucide-react";
import { defaultStyles } from "@/components/links/constants/styleConstants";

// --- CONSTANTS ---
const DASHBOARD_LINKS_PATH = "/dashboard/links";
const NEW_PAGE_IDENTIFIER = "new";

// Initial state for a new page
const initialNewPageData: PageData = {
  id: undefined,
  slug: "",
  elements: [],
  styles: defaultStyles,
  customDomain: null,
  active: true,
};

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const pageIdOrSlugParam = params?.slug as string | undefined;

  const [pageData, setPageData] = useState<PageData>(initialNewPageData);
  const [isNewPage, setIsNewPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"style" | "settings">("style");

  // --- DATA FETCHING & NEW PAGE HANDLING ---
  useEffect(() => {
    const isExplicitNew = pageIdOrSlugParam === NEW_PAGE_IDENTIFIER;
    setIsNewPage(isExplicitNew);

    if (isExplicitNew) {
      console.log("Initializing a new page.");
      setPageData(initialNewPageData);
      setIsLoading(false);
      toast.info("Creating a new page. Please set details in Settings and Save.", { duration: 5000 });
      return;
    }

    if (!pageIdOrSlugParam) {
      console.error("No page ID or slug provided in URL.");
      toast.error("Invalid page URL.");
      setIsLoading(false);
      router.push(DASHBOARD_LINKS_PATH);
      return;
    }

    const fetchPageData = async () => {
      setIsLoading(true);
      console.log(`Fetching page data for: ${pageIdOrSlugParam}`);
      try {
        // API endpoint assumes it can handle either an ID or a slug
        const response = await fetch(`/api/links/${pageIdOrSlugParam}`);

        if (response.status === 404) {
          toast.error(`Page "${pageIdOrSlugParam}" not found.`);
          router.push(DASHBOARD_LINKS_PATH);
          return;
        }

        if (!response.ok) {
          let errorMsg = `Error loading page: ${response.statusText}`;
          try {
            const errData = await response.json();
            errorMsg = errData.error || errData.message || errorMsg;
          } catch {
            /* Ignore parsing error if body isn't JSON */
          }
          throw new Error(errorMsg);
        }

        const loadedPageData: PageData = await response.json();
        console.log("Page data fetched successfully:", loadedPageData);

        setPageData({
          id: loadedPageData.id,
          slug: loadedPageData.slug || "",
          elements: Array.isArray(loadedPageData.elements) ? loadedPageData.elements : [],
          styles: loadedPageData.styles ? { ...defaultStyles, ...loadedPageData.styles } : defaultStyles,
          customDomain: loadedPageData.customDomain || null,
          active: loadedPageData.active ?? true,
        });
        setIsNewPage(false); // Mark as existing page
        // toast.success("Page data loaded."); // Potentially too noisy if loading is fast
      } catch (error: any) {
        console.error("Failed to fetch page data:", error);
        toast.error(`Error loading page: ${error.message}`);
        // Optionally redirect on critical fetch errors
        // router.push(DASHBOARD_LINKS_PATH);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [pageIdOrSlugParam, router]);

  // --- STATE HANDLERS (IMMUTABLE UPDATES) ---
  const handleUpdateElement = useCallback((id: string, updatedData: Partial<BioElement>) => {
    setPageData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)),
    }));
    // toast.info("Element updated."); // Can be too noisy for every small change
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setPageData((prev) => {
      const updatedElements = prev.elements.filter((el) => el.id !== id);
      // Re-order remaining elements if necessary (optional, depends on desired behavior)
      // const reorderedElements = updatedElements.map((el, index) => ({ ...el, order: index }));
      toast.warning("Element deleted.");
      return { ...prev, elements: updatedElements /* or reorderedElements */ };
    });
  }, []);

  const handleChangeStyle = useCallback((newStyles: Partial<StyleProps>) => {
    setPageData((prev) => ({ ...prev, styles: { ...prev.styles, ...newStyles } }));
  }, []);

  const handleCustomDomainChange = useCallback((domain: string) => {
    setPageData((prev) => ({ ...prev, customDomain: domain.trim() || null }));
  }, []);

  const handleSlugChange = useCallback((newSlug: string) => {
    const validSlug = newSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ""); // Remove invalid characters
    setPageData((prev) => ({ ...prev, slug: validSlug }));
  }, []);

  const handleActiveChange = useCallback((active: boolean) => {
    setPageData((prev) => ({ ...prev, active }));
  }, []);

  // --- DRAG & DROP ---
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, elementType: BioElementType | string) => {
    e.dataTransfer.setData("elementType", elementType as string);
    // e.dataTransfer.effectAllowed = "move"; // Already default for dnd
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const elementType = e.dataTransfer.getData("elementType") as BioElementType;
      if (!elementType) {
        console.warn("No elementType found in dataTransfer during drop.");
        return;
      }

      // Create a new element for the flat list structure
      // Assumes BioElement type no longer has `columns`, `parentId`, `columnIndex`
      const newElement: BioElement = {
        id: crypto.randomUUID(),
        type: elementType,
        order: pageData.elements.length, // Add to the end of the flat list
        // Initialize any other default properties for the specific elementType if needed
        // e.g., content: elementType === 'link' ? { url: '', label: 'My Link'} : {}
      };

      setPageData((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement],
      }));
      toast.success(`"${elementType}" element added to the canvas.`);
    },
    [pageData.elements.length]
  ); // Dependency on length to correctly set order

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; // Indicate it's a move operation
  }, []);

  const handleReorderElements = useCallback((reorderedElements: BioElement[]) => {
    // The reorderedElements from LinkCanvas already have updated 'order' properties.
    setPageData((prev) => ({ ...prev, elements: reorderedElements }));
    // toast.info("Elements reordered."); // Can be chatty
  }, []);

  // --- SAVE PAGE ---
  const handleSave = async () => {
    if (!pageData.slug && isNewPage) {
      toast.error("Please set a Page Slug in Settings before saving a new page.", {
        action: { label: "Go to Settings", onClick: () => setRightPanelTab("settings") },
      });
      return;
    }
    if (!pageData.slug && !isNewPage && !pageData.id) {
      // Edge case: existing page somehow lost its slug and ID (should not happen)
      toast.error("Page details are incomplete. Cannot save.");
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    const savingToastId = toast.loading("Saving page data...");

    const method = isNewPage ? "POST" : "PUT";
    // API handles assigning user_id. Slug is part of payload.
    // For PUT, ID is sent in payload if API expects it, or inferred from URL by API.
    // Here, we send ID in payload for PUT.
    const apiUrl = method === "POST" ? "/api/links" : `/api/links/${pageData.id}`;

    const payload = {
      slug: pageData.slug,
      custom_domain: pageData.customDomain || null,
      elements: pageData.elements, // Elements are now flat
      styles: pageData.styles,
      active: pageData.active,
      ...(method === "PUT" && { id: pageData.id }), // Only include id for PUT requests if your API expects it in body
    };

    console.log(`Attempting to ${method} page data to ${apiUrl}:`, payload);

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("API Save Error Response:", responseData);
        throw new Error(responseData.error || responseData.message || `Save failed: ${response.statusText}`);
      }

      const savedPageData: PageData = responseData;
      console.log("Page saved successfully. API Response:", savedPageData);
      toast.success("Page saved successfully!", { id: savingToastId });

      setPageData((prev) => ({
        ...prev,
        id: savedPageData.id || prev.id, // Essential: Update ID from POST response
        slug: savedPageData.slug || prev.slug, // Update slug if API modifies it
        // Elements and styles might also be returned cleaned/validated by API
        elements: savedPageData.elements || prev.elements,
        styles: savedPageData.styles || prev.styles,
      }));

      if (isNewPage && savedPageData.id) {
        setIsNewPage(false); // No longer a new page
        // Update URL to reflect the new page's ID, without adding to history
        router.replace(`${DASHBOARD_LINKS_PATH}/edit/${savedPageData.id}`, { scroll: false });
      } else if (!isNewPage && pageData.slug !== savedPageData.slug && savedPageData.id) {
        // If slug changed for an existing page, update URL (optional, consider UX)
        // router.replace(`${DASHBOARD_LINKS_PATH}/edit/${savedPageData.id}`, { scroll: false });
      }
    } catch (error: any) {
      console.error("Save operation failed:", error);
      toast.error(`Save failed: ${error.message}`, { id: savingToastId });
    } finally {
      setIsSaving(false);
    }
  };

  const pageTitle = useMemo(() => {
    if (isLoading) return "Loading...";
    if (isNewPage) return "New Page";
    return pageData.slug || "Edit Page";
  }, [isLoading, isNewPage, pageData.slug]);

  // --- RENDER ---
  if (isLoading && !isNewPage) {
    // Don't show full page loader for a "new" page instance
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mr-3" />
        <span className="text-xl text-gray-700">Loading Page Editor...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        onSave={handleSave}
        isSaving={isSaving}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Element Palette */}
        <aside className="w-64 border-r bg-white dark:bg-gray-800 dark:border-gray-700 overflow-y-auto flex-shrink-0 shadow-sm">
          <LinkEditor onDragStart={handleDragStart} />
        </aside>

        {/* Center Panel: Canvas/Preview */}
        <main className="flex-1 flex justify-center items-start overflow-hidden p-0">
          {" "}
          {/* Removed padding from main, LinkCanvas has its own */}
          <LinkCanvas
            elements={pageData.elements}
            styles={pageData.styles}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            updateElement={handleUpdateElement}
            deleteElement={handleDeleteElement}
            onReorderElements={handleReorderElements}
          />
        </main>

        {/* Right Panel: Style & Settings */}
        <aside className="w-72 border-l bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col flex-shrink-0 shadow-sm">
          <div className="flex border-b dark:border-gray-700">
            {(["style", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightPanelTab(tab as "style" | "settings")}
                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  rightPanelTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}>
                {tab === "style" ? <Palette size={16} /> : <Settings size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {rightPanelTab === "style" ? (
              <LinkStyle
                styles={pageData.styles}
                onChangeStyle={handleChangeStyle}
              />
            ) : (
              <LinkSettings
                // key={pageData.id || NEW_PAGE_IDENTIFIER} // Re-mounts if ID changes, useful after first save
                slug={pageData.slug}
                customDomain={pageData.customDomain}
                active={pageData.active}
                isSaving={isSaving} // Pass relevant states
                isLoading={isLoading} // LinkSettings might not need global isLoading
                onSlugChange={handleSlugChange}
                onCustomDomainChange={handleCustomDomainChange}
                onActiveChange={handleActiveChange}
                isNewPage={isNewPage}
              />
            )}
          </div>
        </aside>
      </div>
      <Toaster
        richColors
        position="bottom-right"
        closeButton
        duration={3000}
      />
    </div>
  );
}
