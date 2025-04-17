"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";

import { PageData, BioElement, StyleProps, defaultStyles } from "@/app/types/links/types";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { CountdownElementView, CalendlyElementView, HeaderElementView, CardElementView, ImageElementView, LinkElementView, ProfileElementView, SocialsElementView, ShopifyElementView } from "@/components/links/view-elements";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ViewPage() {
  const router = useRouter();
  const params = useParams();
  const identifier = params?.identifier as string | undefined;

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) {
      setError("No page identifier found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.from("link_forms").select("*").or(`slug.eq.${identifier},custom_domain.eq.${identifier}`).maybeSingle();

      if (fetchError) {
        toast.error(`Failed to load page data: ${fetchError.message}`);
        setError(`Failed to load page data: ${fetchError.message}`);
        setPageData(null);
      } else if (data) {
        setPageData({
          id: data.id,
          slug: data.slug,
          elements: Array.isArray(data.elements) ? data.elements : [],
          styles: typeof data.styles === "object" && data.styles !== null ? { ...defaultStyles, ...data.styles } : defaultStyles,
          customDomain: data.custom_domain,
        });
      } else {
        toast.error("Page not found.");
        setError("Page not found.");
        setPageData(null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [identifier]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading page view...</div>
        </div>
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Page</h2>
          <p className="text-red-600 mb-6">{error || "Page data could not be loaded."}</p>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  const { elements, styles } = pageData;
  const dynamicStyles = {
    "--bg-color": styles.backgroundColor,
    "--text-color": styles.textColor,
    "--button-color": styles.buttonColor,
    "--button-text-color": styles.buttonTextColor,
    "--border-radius-val": styles.borderRadius === "none" ? "0px" : styles.borderRadius === "sm" ? "0.125rem" : styles.borderRadius === "md" ? "0.375rem" : styles.borderRadius === "lg" ? "0.5rem" : styles.borderRadius === "full" ? "9999px" : "0.375rem",
    fontFamily: styles.fontFamily,
    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : "none",
    backgroundColor: styles.backgroundColor,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: styles.textColor,
  } as React.CSSProperties;

  const renderElement = (elem: BioElement) => {
    switch (elem.type) {
      case "countdown":
        return <CountdownElementView key={elem.id} element={elem} styles={styles} />;
      case "calendly":
        return <CalendlyElementView key={elem.id} element={elem} styles={styles} />;
      case "header":
        return <HeaderElementView key={elem.id} element={elem} styles={styles} />;
      case "card":
        return <CardElementView key={elem.id} element={elem} styles={styles} />;
      case "image":
        return <ImageElementView key={elem.id} element={elem} styles={styles} />;
      case "link":
        return <LinkElementView key={elem.id} element={elem} styles={styles} />;
      case "profile":
        return <ProfileElementView key={elem.id} element={elem} styles={styles} />;
      case "socials":
        return <SocialsElementView key={elem.id} element={elem} styles={styles} />;
      case "shopify":
        return <ShopifyElementView key={elem.id} element={elem} styles={styles} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-gray-50">
      <div className="w-full max-w-xl rounded-lg shadow-lg overflow-hidden border border-gray-300" style={{ minHeight: "600px" }}>
        <div style={dynamicStyles} className="p-4 md:p-6 h-full">
          {elements.map((element) => renderElement(element))}
          {elements.length === 0 && <p className="text-center py-20 opacity-70">This page has no content yet.</p>}
        </div>
      </div>
    </div>
  );
}
