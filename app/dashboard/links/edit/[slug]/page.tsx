"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import LinkEditor from "@/components/links/link-element"; // Palette of draggable elements
import LinkCanvas from "@/components/links/link-canvas"; // Preview/Canvas area
import LinkStyle from "@/components/links/link-styles";
import LinkSettings from "@/components/links/link-settings";
import Navbar from "@/components/links/navbar";
import { BioElement, BioElementType, PageData, StyleProps, defaultStyles } from "@/app/types/links/types"; // Ensure path is correct
import { Palette, Settings } from "lucide-react";

// Initialize Supabase Client (ensure environment variables are set)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const pageSlug = params?.slug as string | undefined;

  const [pageData, setPageData] = useState<PageData>({
    slug: "", // Initialize empty, will be set in useEffect
    elements: [],
    styles: defaultStyles,
    customDomain: null,
    active: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"style" | "settings">("style");

  // --- Data Fetching ---
  useEffect(() => {
    const isNewPageScenario = !pageSlug || ["new", "new-bio-page"].includes(pageSlug);

    if (isNewPageScenario) {
      const initialSlug = `new-page-${Date.now().toString().slice(-4)}`;
      setPageData({
        slug: initialSlug,
        elements: [],
        styles: defaultStyles,
        customDomain: null,
        active: true,
      });
      setIsLoading(false);
      toast.info("Creating a new page.", { description: `Set a permanent slug in Settings (current: ${initialSlug}).` });
      if (pageSlug && ["new", "new-bio-page"].includes(pageSlug)) {
        window.history.replaceState(null, "", `/links/edit/${initialSlug}`);
      }
      return;
    }

    const fetchPageData = async () => {
      setIsLoading(true);
      console.log(`Fetching data for slug: ${pageSlug}`);
      const { data, error } = await supabase.from("link_forms").select("*").eq("slug", pageSlug).single();

      if (error && error.code !== "PGRST116") {
        console.error("Supabase fetch error:", error);
        toast.error(`Error loading page: ${error.message}`);
      } else if (data) {
        console.log("Data fetched:", data);
        const loadedElements = Array.isArray(data.elements) ? data.elements : [];
        const loadedStyles = data.styles ? { ...defaultStyles, ...data.styles } : defaultStyles;

        setPageData({
          id: data.id, // Keep ID internally for saving/upsert
          slug: data.slug,
          elements: loadedElements,
          styles: loadedStyles,
          customDomain: data.custom_domain || null,
          active: data.active ?? true,
        });
        toast.success("Page data loaded.");
      } else {
        console.log("No data found for slug, starting fresh with:", pageSlug);
        setPageData({
          slug: pageSlug,
          elements: [],
          styles: defaultStyles,
          customDomain: null,
          active: true,
        });
        toast.info(`No saved data for "${pageSlug}". Starting fresh.`);
      }
      setIsLoading(false);
    };

    if (pageSlug) {
      fetchPageData();
    }
  }, [pageSlug]);

  // --- State Handlers (Immutable Updates) ---

  const handleUpdateElement = useCallback((id: string, updatedData: Partial<BioElement>) => {
    setPageData((prev) => ({
      ...prev,
      // Use map for immutable update
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)),
    }));
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setPageData((prev) => {
      const elementToDelete = prev.elements.find((el) => el.id === id);
      if (!elementToDelete) return prev; // Not found

      // 1. Find IDs of all direct children if the deleted element is a layout container
      const childrenIdsToRemove: string[] = [];
      if (elementToDelete.type.startsWith("layout-") && elementToDelete.columns) {
        elementToDelete.columns.forEach((column) => {
          if (column) {
            column.forEach((child) => childrenIdsToRemove.push(child.id));
          }
        });
      }

      // 2. Create a set of all IDs to remove (element + its children)
      const allIdsToRemove = new Set([id, ...childrenIdsToRemove]);

      // 3. Filter the flat elements list immutably
      const nextElements = prev.elements.filter((el) => !allIdsToRemove.has(el.id));

      // Note: We are not explicitly modifying the parent's `columns` array here.
      // The filtered flat list (`nextElements`) is passed to LinkCanvas.
      // LinkCanvas's rendering logic should correctly display the structure based on
      // the remaining elements and their `parentId`/`columnIndex`.
      // The `handleReorderElements` callback from LinkCanvas is responsible for
      // providing the fully consistent state after drag operations.

      toast.warning(`Element${childrenIdsToRemove.length > 0 ? " and its content" : ""} deleted.`);
      return { ...prev, elements: nextElements };
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
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setPageData((prev) => ({ ...prev, slug: validSlug }));
  }, []);

  const handleActiveChange = useCallback((active: boolean) => {
    setPageData((prev) => ({ ...prev, active }));
  }, []);

  // --- Drag & Drop ---
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, elementType: BioElementType | string) => {
    e.dataTransfer.setData("elementType", elementType as string);
  }, []);

  // MODIFIED handleDrop to support nesting (Immutable Update)
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetLayoutId?: string, targetColumnIndex?: number) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType") as BioElementType;
    if (!elementType) return;

    const newElementBase: Omit<BioElement, "order"> = {
      // Base object without order yet
      id: crypto.randomUUID(),
      type: elementType,
      ...(elementType.startsWith("layout-") && { columns: elementType === "layout-two-columns" ? [[], []] : [[]] }),
    };

    setPageData((prev) => {
      let finalElements = [...prev.elements]; // Start with a shallow copy

      if (targetLayoutId !== undefined && targetColumnIndex !== undefined) {
        // --- Dropped into a layout column ---
        const parentIndex = finalElements.findIndex((el) => el.id === targetLayoutId);
        if (parentIndex === -1) {
          console.error("Parent layout element not found!");
          toast.error("Could not add element: Parent layout not found.");
          return prev; // Abort state update
        }

        const parentElement = finalElements[parentIndex];

        // Ensure columns and target column exist immutably (if needed)
        // Note: This structure assumes parentElement.columns is already initialized when the layout is dropped
        if (!parentElement.columns || parentElement.columns.length <= targetColumnIndex) {
          console.error("Target column structure missing on parent");
          // Attempt recovery (might be needed if initial layout drop didn't create full structure)
          const currentColumns = parentElement.columns || [];
          while (currentColumns.length <= targetColumnIndex) {
            currentColumns.push([]);
          }
          // This mutates the element within the shallow copy `finalElements`, which is acceptable here
          // before we potentially replace the parent entirely.
          parentElement.columns = currentColumns;
          // Alternatively, handle this within the map below more robustly
        }

        // Create the new element with nesting info and order *within the column*
        const newElementInColumn: BioElement = {
          ...newElementBase,
          parentId: targetLayoutId,
          columnIndex: targetColumnIndex,
          // Calculate order based on *current* state before potential updates
          order: parentElement.columns[targetColumnIndex]?.length || 0,
        };

        // Update the parent element immutably and add the new element to the flat list
        finalElements = finalElements.map((el) => {
          if (el.id === targetLayoutId) {
            // Create a new columns array
            const newColumns = (el.columns || []).map((col, index) => {
              if (index === targetColumnIndex) {
                // Create a new column array with the new element appended
                return [...(col || []), newElementInColumn];
              }
              return col || []; // Return existing column or empty array
            });
            // Ensure enough columns exist if target index was out of bounds initially
            while (newColumns.length <= targetColumnIndex) {
              newColumns.push(targetColumnIndex === newColumns.length ? [newElementInColumn] : []);
            }

            // Return the updated parent element
            return { ...el, columns: newColumns };
          }
          return el; // Return other elements unchanged
        });

        // Add the new element to the end of the flat list as well
        finalElements.push(newElementInColumn);

        toast.success(`${elementType} added to column ${targetColumnIndex + 1}.`);
      } else {
        // --- Dropped onto the main canvas (root level) ---
        const rootElements = finalElements.filter((el) => !el.parentId);
        const newElementRoot: BioElement = {
          ...newElementBase,
          order: rootElements.length, // Order among root elements
        };
        // Add to the end of the flat list
        finalElements.push(newElementRoot);
        toast.success(`${elementType} added.`);
      }

      // Recalculate order just to be safe? Optional, as D&D handles it primarily.
      // finalElements = recalculateOrder(finalElements.filter(el => !el.parentId)).concat(finalElements.filter(el => el.parentId));

      return { ...prev, elements: finalElements };
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Callback for reordering managed entirely by LinkCanvas
  const handleReorderElements = useCallback((newElementsState: BioElement[]) => {
    // LinkCanvas passes the complete new state of elements after reordering
    // This state should be internally consistent (correct parentId, columnIndex, order, columns)
    setPageData((prev) => ({
      ...prev,
      elements: newElementsState,
    }));
  }, []);

  // --- Save Page ---
  const handleSave = async () => {
    if (!pageData.slug || pageData.slug.startsWith("new-page-")) {
      toast.error("Please set a valid, permanent Page Slug in Settings before saving.", {
        action: { label: "Go to Settings", onClick: () => setRightPanelTab("settings") },
      });
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    toast.loading("Saving page data...");

    const dataToSave = {
      slug: pageData.slug,
      custom_domain: pageData.customDomain || null,
      elements: pageData.elements, // Save the flat array
      styles: pageData.styles,
      active: pageData.active,
      ...(pageData.id && { id: pageData.id }), // Include internal ID if exists
    };

    console.log("Saving data:", JSON.stringify(dataToSave.elements, null, 2)); // Log elements being saved

    const { data, error } = await supabase.from("link_forms").upsert(dataToSave, { onConflict: "slug" }).select().single();

    setIsSaving(false);
    toast.dismiss();

    if (error) {
      console.error("Supabase save error:", error);
      toast.error(`Save failed: ${error.message}`);
    } else if (data) {
      console.log("Save successful, response data:", data);
      setPageData((prev) => ({ ...prev, id: data.id, slug: data.slug })); // Update internal ID and confirmed slug
      toast.success("Page saved successfully!");
      if (pageSlug !== data.slug) {
        router.push(`/links/edit/${data.slug}`, { scroll: false });
      }
    } else {
      console.error("Supabase save error: No data returned after upsert.");
      toast.error("Save failed: An unexpected error occurred.");
    }
  };

  // --- Render ---
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading Editor...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar
        onSave={handleSave}
        isSaving={isSaving}
        pageSlug={pageData.slug}
        // pageId removed
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Element Palette */}
        <div className="w-64 border-r bg-white overflow-y-auto flex-shrink-0">
          <LinkEditor onDragStart={handleDragStart} />
        </div>

        {/* Center Panel: Canvas/Preview */}
        <div className="flex-1 flex justify-center items-start overflow-hidden">
          <LinkCanvas elements={pageData.elements} styles={pageData.styles} onDrop={handleDrop} onDragOver={handleDragOver} updateElement={handleUpdateElement} deleteElement={handleDeleteElement} onReorderElements={handleReorderElements} />
        </div>

        {/* Right Panel: Style & Settings */}
        <div className="w-72 border-l bg-white flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b">
            <button onClick={() => setRightPanelTab("style")} className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-1 ${rightPanelTab === "style" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
              <Palette size={16} /> Style
            </button>
            <button onClick={() => setRightPanelTab("settings")} className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-1 ${rightPanelTab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:bg-gray-50"}`}>
              <Settings size={16} /> Settings
            </button>
          </div>
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === "style" ? (
              <LinkStyle styles={pageData.styles} onChangeStyle={handleChangeStyle} />
            ) : (
              <LinkSettings
                slug={pageData.slug}
                customDomain={pageData.customDomain}
                active={pageData.active}
                isSaving={isSaving}
                isLoading={isLoading} // Keep isLoading for potential checks within settings
                onSlugChange={handleSlugChange}
                onCustomDomainChange={handleCustomDomainChange}
                onActiveChange={handleActiveChange}
                onSave={handleSave}
                // pageId removed
              />
            )}
          </div>
        </div>
      </div>
      <Toaster richColors position="bottom-right" closeButton />
    </div>
  );
}
