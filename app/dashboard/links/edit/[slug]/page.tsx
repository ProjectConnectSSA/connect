// src/app/edit/[slug]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation"; // Use params hook
import { Toaster, toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
// Adjust component import paths if they are nested differently under /components
import LinkEditor from "@/components/links/link-editor";
import LinkPreview from "@/components/links/link-preview";
import LinkStyle from "@/components/links/link-styles";
import Navbar from "@/components/links/navbar";
// Adjust type import path if it's nested differently under /app
import { BioElement, BioElementType, PageData, StyleProps, defaultStyles } from "@/app/types/links/types";

import { Palette, Settings } from "lucide-react"; // For settings tab

// Initialize Supabase Client (Consider moving to a shared lib/utils file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditPage() {
  const params = useParams();
  const pageSlug = params?.slug as string | undefined; // Get slug from URL

  const [pageData, setPageData] = useState<PageData>({
    slug: pageSlug || "", // Initialize slug from URL or empty
    elements: [],
    styles: defaultStyles,
    customDomain: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Removed unused activeTab state: const [activeTab, setActiveTab] = useState<"elements" | "style" | "settings">("elements");
  const [rightPanelTab, setRightPanelTab] = useState<"style" | "settings">("style"); // State for right tabs

  // --- Data Fetching ---
  useEffect(() => {
    // Ensure pageSlug is defined and not 'new-bio-page' or similar placeholder before fetching
    if (!pageSlug || pageSlug === "new" || pageSlug === "new-bio-page") {
      // Added checks for common 'new' slugs
      // This is a new page, initialize with defaults but use the intended slug if possible
      console.log("Detected new page creation for slug:", pageSlug);
      setPageData((prev) => ({
        ...prev,
        slug: pageSlug && pageSlug !== "new" && pageSlug !== "new-bio-page" ? pageSlug : "new-page", // Use slug or default
        elements: [],
        styles: defaultStyles,
        customDomain: null,
      }));
      setIsLoading(false);
      // Optionally prompt user to change the default 'new-page' slug in settings
      if (pageSlug === "new" || pageSlug === "new-bio-page" || !pageSlug) {
        toast.info("Creating a new page. Please set a unique slug in Settings.");
      }
      return; // Don't fetch for new pages
    }

    const fetchPageData = async () => {
      setIsLoading(true);
      console.log(`Fetching data for slug: ${pageSlug}`);
      // --- !!! CHANGE TABLE NAME HERE !!! ---
      const { data, error } = await supabase.from("link_forms").select("*").eq("slug", pageSlug).single(); // Use "bio_pages" table

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching page data:", error);
        toast.error(`Error loading page: ${error.message}`);
        setPageData((prev) => ({
          ...prev,
          slug: pageSlug, // Keep slug from URL
          elements: [],
          styles: defaultStyles,
          customDomain: null,
        }));
      } else if (data) {
        // Data found - Log and update state
        console.log("Data fetched:", data);
        setPageData({
          id: data.id,
          slug: data.slug,
          // Ensure elements/styles are parsed correctly (Supabase client usually does this)
          elements: Array.isArray(data.elements) ? data.elements : [], // Ensure it's an array
          styles: typeof data.styles === "object" && data.styles !== null ? { ...defaultStyles, ...data.styles } : defaultStyles, // Ensure it's an object, merge with defaults
          customDomain: data.custom_domain,
        });
        toast.success("Page data loaded."); // Feedback on successful load
      } else {
        // No data found for this slug - Treat as potentially new page or incorrect slug
        console.log("No existing data found for slug, initializing editor.");
        toast.info("No saved data found for this slug. Starting fresh.");
        setPageData((prev) => ({
          ...prev,
          slug: pageSlug, // Keep slug from URL
          elements: [],
          styles: defaultStyles,
          customDomain: null,
        }));
      }
      setIsLoading(false);
    };

    fetchPageData();
    // Only run when pageSlug changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSlug]);

  // --- State Update Handlers (Keep as they are) ---
  const handleUpdateElement = useCallback(
    /* ... */ (id: string, updatedData: Partial<BioElement>) => {
      setPageData((prev) => ({ ...prev, elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updatedData } : el)) }));
    },
    []
  );

  const handleChangeStyle = useCallback(
    /* ... */ (newStyles: Partial<StyleProps>) => {
      setPageData((prev) => ({ ...prev, styles: { ...prev.styles, ...newStyles } }));
    },
    []
  );

  const handleCustomDomainChange = useCallback(
    /* ... */ (domain: string) => {
      setPageData((prev) => ({ ...prev, customDomain: domain.trim() || null })); // Trim whitespace
    },
    []
  );

  const handleSlugChange = useCallback(
    /* ... */ (newSlug: string) => {
      const validSlug = newSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      setPageData((prev) => ({ ...prev, slug: validSlug }));
    },
    []
  );

  // --- Drag and Drop Handlers (Keep as they are) ---
  const handleDragStart = useCallback(
    /* ... */ (e: React.DragEvent<HTMLDivElement>, elementType: BioElementType) => {
      e.dataTransfer.setData("elementType", elementType);
    },
    []
  );
  const handleDrop = useCallback(
    /* ... */ (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const elementType = e.dataTransfer.getData("elementType") as BioElementType;
      if (!elementType) return;
      setPageData((prev) => {
        const newElement: BioElement = {
          id: crypto.randomUUID(),
          type: elementType,
          order: prev.elements.length,
          title:
            elementType === "header"
              ? "New Header"
              : elementType === "link"
              ? "Link Title"
              : elementType === "button"
              ? "Button Text"
              : elementType === "card"
              ? "Card Title"
              : undefined,
          name: elementType === "profile" ? "Your Name" : undefined,
          bioText: elementType === "profile" ? "Your Bio" : undefined,
          socialLinks: elementType === "socials" ? [] : undefined,
          url: elementType === "image" ? "" : undefined,
        };
        return { ...prev, elements: [...prev.elements, newElement] };
      });
      toast.success(`${elementType.charAt(0).toUpperCase() + elementType.slice(1)} added!`);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  ); // Dependency array might need pageData.elements.length if order depends on it strictly, but usually fine
  const handleDragOver = useCallback(
    /* ... */ (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    []
  );

  // --- Saving Data ---
  const handleSave = async () => {
    if (!pageData.slug || pageData.slug === "new-page" || pageData.slug === "new") {
      // Added check for default/placeholder slugs
      toast.error("Cannot save: Please set a valid Page Slug in Settings first.");
      setRightPanelTab("settings"); // Switch to settings tab
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    toast.loading("Saving page...");

    const dataToSave = {
      // Include the id if we have it (for updates), otherwise let upsert handle it
      ...(pageData.id && { id: pageData.id }),
      slug: pageData.slug,
      custom_domain: pageData.customDomain || null,
      elements: pageData.elements || [],
      styles: pageData.styles || defaultStyles,
    };

    console.log("Attempting to save:", dataToSave);

    try {
      // --- !!! CHANGE TABLE NAME HERE !!! ---
      const { data, error } = await supabase
        .from("bio_pages") // Use "bio_pages" table
        .upsert(dataToSave, { onConflict: "slug" })
        .select()
        .single();

      if (error) {
        console.error("Save error:", error);
        // --- !!! CHECK CONSTRAINT NAME HERE !!! ---
        if (error.message.includes('duplicate key value violates unique constraint "bio_pages_custom_domain_key"')) {
          toast.error("Save failed: Custom domain is already in use by another page.");
        } else if (
          error.message.includes('duplicate key value violates unique constraint "bio_pages_slug_key"') ||
          error.message.includes('duplicate key value violates unique constraint "bio_pages_pkey"')
        ) {
          // This might happen if the slug changed to one that already exists AND the original ID wasn't passed correctly for update
          toast.error("Save failed: This Page Slug might already be taken.");
        } else {
          toast.error(`Save failed: ${error.message}`);
        }
      } else {
        console.log("Save successful:", data);
        toast.success("Page saved successfully!");
        // Update state with the definite ID from the DB response
        setPageData((prev) => ({ ...prev, id: data.id, slug: data.slug })); // Also update slug in case DB modifies it (e.g., triggers)
      }
    } catch (err) {
      console.error("Unexpected save error:", err);
      toast.error("An unexpected error occurred during save.");
    } finally {
      setIsSaving(false);
      // Keep loading toast dismissal logic if needed, or rely on success/error toasts
      // toast.dismiss();
    }
  };

  // --- Settings Content (Keep as is) ---
  const SettingsContent = () => (
    <div className="p-4">
      {" "}
      {/* Add padding inside the scrollable area */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Page Settings</h2>
      {/* Slug Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Page Slug (URL Path)</label>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-1">your-app.com/p/</span> {/* Updated prefix */}
          <input
            type="text"
            value={pageData.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="flex-grow p-2 border rounded text-sm"
            placeholder="your-unique-slug"
            disabled={isSaving || isLoading}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Unique identifier. Use letters, numbers, hyphens.</p>
      </div>
      {/* Custom Domain Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Custom Domain (Optional)</label>
        <input
          type="text"
          placeholder="yourdomain.com"
          value={pageData.customDomain || ""}
          onChange={(e) => handleCustomDomainChange(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          disabled={isSaving || isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">Point CNAME/A record to our server.</p>
        <p className="text-xs text-blue-600 mt-1">Local test: Edit hosts file (`127.0.0.1 mytest.local`) & enter `mytest.local`.</p>
      </div>
      {/* Save Button in Settings */}
      <button
        onClick={handleSave}
        disabled={isSaving || isLoading}
        className="w-full mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
        {isSaving ? "Saving..." : "Save Page Settings"}
      </button>
    </div>
  );

  // --- Loading Indicator ---
  // Use isLoading state directly for clarity
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading Editor...</div>;
  }

  // --- Render Editor ---
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar
        onSave={handleSave}
        isSaving={isSaving}
        pageSlug={pageData.slug}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Elements */}
        <div className="w-64 flex-shrink-0 border-r bg-white shadow-sm h-full overflow-y-auto">
          <LinkEditor onDragStart={handleDragStart} />
        </div>

        {/* Center Column: Preview */}
        <LinkPreview
          elements={pageData.elements}
          styles={pageData.styles}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          updateElement={handleUpdateElement}
        />

        {/* Right Column: Style & Settings Tabs */}
        <div className="w-72 flex-shrink-0 border-l bg-white shadow-sm flex flex-col h-full">
          {/* Tab Navigation */}
          <div className="flex border-b flex-shrink-0">
            <button
              onClick={() => setRightPanelTab("style")}
              className={`flex-1 p-3 text-sm font-medium text-center flex items-center justify-center gap-2 ${
                rightPanelTab === "style" ? "bg-gray-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-100"
              }`}>
              <Palette size={16} /> Style
            </button>
            <button
              onClick={() => setRightPanelTab("settings")}
              className={`flex-1 p-3 text-sm font-medium text-center flex items-center justify-center gap-2 ${
                rightPanelTab === "settings" ? "bg-gray-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:bg-gray-100"
              }`}>
              <Settings size={16} /> Settings
            </button>
          </div>
          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === "style" && (
              <LinkStyle
                styles={pageData.styles}
                onChangeStyle={handleChangeStyle}
              />
            )}
            {rightPanelTab === "settings" && <SettingsContent />}
          </div>
        </div>
      </div>
      <Toaster
        richColors
        position="bottom-right"
      />
    </div>
  );
}
