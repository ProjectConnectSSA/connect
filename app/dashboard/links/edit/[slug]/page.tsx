"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Toaster, toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import LinkEditor from "@/components/links/link-element";
import LinkCanvas from "@/components/links/link-canvas";
import LinkStyle from "@/components/links/link-styles";
import LinkSettings from "@/components/links/link-settings";
import Navbar from "@/components/links/navbar";
import { BioElement, BioElementType, PageData, StyleProps, defaultStyles } from "@/app/types/links/types";
import { Palette, Settings } from "lucide-react";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditPage() {
  const params = useParams();
  const pageSlug = params?.slug as string | undefined;

  const [pageData, setPageData] = useState<PageData>({
    slug: pageSlug || "",
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
    if (!pageSlug || ["new", "new-bio-page"].includes(pageSlug)) {
      setPageData((prev) => ({
        ...prev,
        slug: pageSlug && !["new", "new-bio-page"].includes(pageSlug) ? pageSlug : "new-page",
        elements: [],
        styles: defaultStyles,
        customDomain: null,
        active: true,
      }));
      setIsLoading(false);
      toast.info("Creating a new page. Please set a unique slug in Settings.");
      return;
    }

    const fetchPageData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("link_forms").select("*").eq("slug", pageSlug).single();

      if (error && error.code !== "PGRST116") {
        console.error(error);
        toast.error(`Error loading page: ${error.message}`);
      } else if (data) {
        setPageData({
          id: data.id,
          slug: data.slug,
          elements: Array.isArray(data.elements) ? data.elements : [],
          styles: { ...defaultStyles, ...data.styles },
          customDomain: data.custom_domain,
          active: data.active,
        });
        toast.success("Page data loaded.");
      } else {
        toast.info("No saved data found for this slug. Starting fresh.");
      }
      setIsLoading(false);
    };

    fetchPageData();
  }, [pageSlug]);

  // --- State Handlers ---
  const handleUpdateElement = useCallback((id: string, updatedData: Partial<BioElement>) => {
    setPageData((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)),
    }));
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setPageData((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
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
      .replace(/[^a-z0-9-]/g, "");
    setPageData((prev) => ({ ...prev, slug: validSlug }));
  }, []);

  const handleActiveChange = useCallback((active: boolean) => {
    setPageData((prev) => ({ ...prev, active }));
  }, []);

  // --- Drag & Drop ---
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => {
    e.dataTransfer.setData("elementType", elementType);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData("elementType") as BioElementType;
    if (!elementType) return;
    setPageData((prev) => ({
      ...prev,
      elements: [
        ...prev.elements,
        {
          id: crypto.randomUUID(),
          type: elementType,
          order: prev.elements.length,
        } as BioElement,
      ],
    }));
    toast.success(`${elementType.charAt(0).toUpperCase() + elementType.slice(1)} added!`);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // --- Save Page ---
  const handleSave = async () => {
    if (!pageData.slug || pageData.slug === "new-page") {
      toast.error("Set a valid Page Slug in Settings first.");
      setRightPanelTab("settings");
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    const dataToSave = {
      ...(pageData.id && { id: pageData.id }),
      slug: pageData.slug,
      custom_domain: pageData.customDomain || null,
      elements: pageData.elements,
      styles: pageData.styles,
      active: pageData.active,
    };

    const { data, error } = await supabase.from("link_forms").upsert(dataToSave, { onConflict: "slug" }).select().single();

    if (error) {
      console.error(error);
      toast.error(`Save failed: ${error.message}`);
    } else {
      setPageData((prev) => ({ ...prev, id: data.id, slug: data.slug }));
      toast.success("Page saved successfully!");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Editor...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar
        onSave={handleSave}
        isSaving={isSaving}
        pageSlug={pageData.slug}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-white overflow-y-auto">
          <LinkEditor onDragStart={handleDragStart} />
        </div>
        <LinkCanvas
          elements={pageData.elements}
          styles={pageData.styles}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          updateElement={handleUpdateElement}
          deleteElement={handleDeleteElement}
          onReorderElements={(order) => setPageData((prev) => ({ ...prev, elements: order }))}
        />
        <div className="w-72 border-l bg-white flex flex-col">
          <div className="flex">
            <button
              onClick={() => setRightPanelTab("style")}
              className={`flex-1 p-3 text-center ${rightPanelTab === "style" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
              <Palette size={16} /> Style
            </button>
            <button
              onClick={() => setRightPanelTab("settings")}
              className={`flex-1 p-3 text-center ${rightPanelTab === "settings" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
              <Settings size={16} /> Settings
            </button>
          </div>
          {rightPanelTab === "style" ? (
            <LinkStyle
              styles={pageData.styles}
              onChangeStyle={handleChangeStyle}
            />
          ) : (
            <LinkSettings
              slug={pageData.slug}
              customDomain={pageData.customDomain}
              active={pageData.active}
              isSaving={isSaving}
              isLoading={isLoading}
              onSlugChange={handleSlugChange}
              onCustomDomainChange={handleCustomDomainChange}
              onActiveChange={handleActiveChange}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
      <Toaster
        richColors
        position="bottom-right"
      />
    </div>
  );
}
