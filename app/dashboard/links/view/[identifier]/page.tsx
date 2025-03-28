"use client"; // <--- Make the whole page a Client Component

import React, { useState, useEffect } from "react"; // Added useState, useEffect
import { useParams, useRouter } from "next/navigation"; // Added useParams, useRouter
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner"; // Added toast

// Assuming types are correctly located
import { PageData, BioElement, StyleProps, defaultStyles } from "@/app/types/links/types"; // Adjust path

// Import necessary rendering components (ProfileElement, etc.)
import ProfileElement from "@/components/links/preview/ProfileElement"; // Adjust path
import SocialsElement from "@/components/links/preview/SocialsElement"; // Adjust path
import LinkElement from "@/components/links/preview/LinkElement"; // Adjust path
import CardElement from "@/components/links/preview/CardElement"; // Adjust path
import ButtonElement from "@/components/links/preview/ButtonElement"; // Adjust path
import HeaderElement from "@/components/links/preview/HeaderElement"; // Adjust path
import ImageElement from "@/components/links/preview/ImageElement"; // Adjust path

// Import Dashboard specific UI if needed
import DashboardSidebar from "@/components/dashboard/sidebar"; // Adjust path
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react"; // Added AlertCircle

// --- Client-Side Supabase Client ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Page Component (Now a Client Component) ---
export default function ViewPage() {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier as string | undefined;

  // State for fetched data and loading status
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Logic (Client-Side) ---
  useEffect(() => {
    if (!identifier) {
      setError("No page identifier found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching data for identifier: ${identifier}`);

      // Fetch by slug OR custom_domain from 'link_forms' table
      const { data, error: fetchError } = await supabase
        .from("link_forms") // Use correct table name
        .select("*")
        .or(`slug.eq.${identifier},custom_domain.eq.${identifier}`)
        .maybeSingle();

      if (fetchError) {
        console.error(`Client Error fetching page data for identifier [${identifier}]:`, fetchError);
        setError(`Failed to load page data: ${fetchError.message}`);
        toast.error(`Failed to load page data: ${fetchError.message}`);
        setPageData(null);
      } else if (data) {
        console.log("Data fetched:", data);
        // Process data, merge styles
        setPageData({
          id: data.id,
          slug: data.slug,
          elements: Array.isArray(data.elements) ? data.elements : [],
          styles: typeof data.styles === "object" && data.styles !== null ? { ...defaultStyles, ...data.styles } : defaultStyles,
          customDomain: data.custom_domain,
        });
        // toast.success("Page data loaded."); // Optional success toast
      } else {
        console.log("No data found for identifier:", identifier);
        setError("Page not found.");
        toast.error("Page not found.");
        setPageData(null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [identifier]); // Re-fetch if identifier changes

  // --- Loading State UI ---
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading page view...</div>
          {/* You can add a spinner here */}
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  // --- Error State UI ---
  if (error || !pageData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Page</h2>
          <p className="text-red-600 mb-6">{error || "Page data could not be loaded."}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  // --- Render Page Content (If loaded successfully) ---
  const { elements, styles } = pageData;

  // --- Dynamic Styles (Similar to public page/preview) ---
  const dynamicStyles = {
    "--bg-color": styles.backgroundColor,
    "--text-color": styles.textColor,
    /* ... other style variables ... */
    "--button-color": styles.buttonColor,
    "--button-text-color": styles.buttonTextColor,
    "--border-radius-val":
      styles.borderRadius === "none"
        ? "0px"
        : styles.borderRadius === "sm"
        ? "0.125rem"
        : styles.borderRadius === "md"
        ? "0.375rem"
        : styles.borderRadius === "lg"
        ? "0.5rem"
        : styles.borderRadius === "full"
        ? "9999px"
        : "0.375rem",
    fontFamily: styles.fontFamily,
    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
    backgroundColor: styles.backgroundColor,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: styles.textColor,
  } as React.CSSProperties;

  // --- Element Rendering Logic (Re-usable) ---
  const renderElement = (elem: BioElement) => {
    const readOnlyUpdate = () => {}; // Dummy function for read-only components
    switch (elem.type) {
      case "profile":
        return (
          <ProfileElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "socials":
        return (
          <SocialsElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "link":
        return (
          <LinkElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "card":
        return (
          <CardElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "button":
        return (
          <ButtonElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "header":
        return (
          <HeaderElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      case "image":
        return (
          <ImageElement
            key={elem.id}
            element={elem}
            styles={styles}
            updateElement={readOnlyUpdate}
          />
        );
      default:
        return null;
    }
  };

  // Grouping logic
  const renderedElementGroups = (() => {
    /* ... same grouping logic ... */
    const groups: React.ReactNode[][] = [];
    let currentGroup: React.ReactNode[] = [];
    let isDoubleColumnGroup = false;
    const sortedElements = [...elements].sort((a, b) => (a.order || 0) - (b.order || 0));
    sortedElements.forEach((elem) => {
      const rendered = renderElement(elem);
      if (!rendered) return;
      if (elem.type === "card" && elem.layout === "double") {
        if (!isDoubleColumnGroup) {
          if (currentGroup.length > 0) groups.push(currentGroup);
          currentGroup = [rendered];
          isDoubleColumnGroup = true;
        } else {
          currentGroup.push(rendered);
        }
      } else {
        if (isDoubleColumnGroup) {
          groups.push(currentGroup);
          currentGroup = [rendered];
          isDoubleColumnGroup = false;
        } else {
          currentGroup.push(rendered);
        }
      }
    });
    if (currentGroup.length > 0) groups.push(currentGroup);
    return groups;
  })();

  // --- Actual JSX Rendered on the Client ---
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-50">
      {/* Container for the preview with applied styles */}
      <div
        className="w-full max-w-xl rounded-lg shadow-lg overflow-hidden border border-gray-300"
        style={{ minHeight: "600px" }}>
        <div
          style={dynamicStyles}
          className="p-4 md:p-6 h-full">
          {" "}
          {/* Apply styles */}
          {/* --- SIMPLIFIED ELEMENT RENDERING --- */}
          {renderedElementGroups.map((group, groupIndex) => {
            // Check if the first element suggests it's a double column group
            // Use optional chaining and type assertion carefully
            const firstElementProps = (group[0] as React.ReactElement)?.props?.element;
            const isDouble = firstElementProps?.type === "card" && firstElementProps?.layout === "double";

            if (isDouble) {
              // Render double column cards in a flex container
              return (
                <div
                  key={`group-double-${groupIndex}`}
                  className="flex flex-wrap gap-4 mb-3">
                  {/* Render each element directly, assumes key is set during creation */}
                  {group}
                </div>
              );
            } else {
              // Render single column elements sequentially
              // Wrap each group of single elements in a Fragment for logical grouping if needed,
              // but often just rendering the array directly is fine if keys are correct.
              // Using Fragment adds minimal overhead and ensures a single root for the map iteration.
              return (
                <React.Fragment key={`group-single-${groupIndex}`}>
                  {/* Render each element directly */}
                  {group}
                </React.Fragment>
              );
            }
          })}
          {/* --- END SIMPLIFIED ELEMENT RENDERING --- */}
          {elements.length === 0 && <p className="text-center py-20 opacity-70">This page has no content yet.</p>}
        </div>
      </div>
    </div>
  );
}
