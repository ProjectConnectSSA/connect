// app/dashboard/links/view/[identifier]/page.tsx (or your public page path)
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast, Toaster } from "sonner";

import { PageData, BioElement, StyleProps } from "@/app/types/links/types";
import { defaultStyles } from "@/components/links/constants/styleConstants";
// import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

import {
  CountdownElementView,
  CalendlyElementView,
  HeaderElementView,
  CardElementView,
  ImageElementView,
  LinkElementView,
  ProfileElementView,
  SocialsElementView,
  ShopifyElementView,
  SubscribeElementView,
} from "@/components/links/view-elements";

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
  const [viewRecorded, setViewRecorded] = useState(false);

  useEffect(() => {
    if (!identifier) {
      setError("No page identifier found in URL.");
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("link_forms")
        .select("*")
        .or(`slug.eq.${identifier},custom_domain.eq.${identifier}`)
        .maybeSingle();
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
          active: data.active ?? true,
        });
        if (!viewRecorded) {
          recordPageView(data.id);
          setViewRecorded(true);
        }
      } else {
        toast.error("Page not found.");
        setError("Page not found.");
        setPageData(null);
      }
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]);

  const recordPageView = async (pageId: string) => {
    if (!pageId) {
      console.error("Cannot record page view: pageId is missing.");
      return;
    }

    const userAgent = typeof window !== "undefined" ? navigator.userAgent : null;
    const referrer = typeof window !== "undefined" ? document.referrer : null;
    let country = null;

    // Attempt to get country using a client-side geolocation API
    // Using ipapi.co as an example. It returns JSON.
    try {
      const geoResponse = await fetch("https://ipapi.co/json/"); // Fetches geo info for the calling IP
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        country = geoData.country_code || geoData.country_name || null; // e.g., 'US' or 'United States'
        console.log("Client-side geolocation successful, country:", country);
      } else {
        console.warn("Client-side geolocation failed:", geoResponse.status, geoResponse.statusText);
      }
    } catch (geoError: any) {
      console.error("Error during client-side geolocation:", geoError.message);
    }

    try {
      const { error: insertError } = await supabase.from("link_analytics").insert([
        {
          page_id: pageId,
          user_agent: userAgent,
          referrer: referrer,
          country: country, // Country obtained (or null if failed)
          // ip_address column is not used/inserted
        },
      ]);

      if (insertError) {
        console.error("Supabase error recording page view directly:", insertError.message);
      } else {
        console.log("Page view recorded with country (client-side attempt).");
      }
    } catch (error: any) {
      console.error("Error recording page view directly:", error.message);
    }
  };

  // ... (Rest of the ViewPage component: isLoading, error, renderElement, JSX - remains the same)
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading page...</div>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error ? "Error Loading Page" : "Page Not Found"}</h2>
          <p className="text-red-600 mb-6">{error || "The page you are looking for could not be found or loaded."}</p>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  const { elements, styles } = pageData;
  const dynamicStyles = {
    "--bg-color": styles.backgroundColor,
    "--text-color": styles.textColor,
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
    backgroundColor: styles.backgroundImage ? "transparent" : styles.backgroundColor,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: styles.textColor,
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  } as React.CSSProperties;

  const contentWrapperStyles: React.CSSProperties = {
    width: "100%",
    maxWidth: "680px",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  };

  const renderElement = (elem: BioElement) => {
    if (!elem || !elem.type) return null;
    switch (elem.type) {
      case "countdown":
        return (
          <CountdownElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "calendly":
        return (
          <CalendlyElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "header":
        return (
          <HeaderElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "card":
        return (
          <CardElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "image":
        return (
          <ImageElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "link":
        return (
          <LinkElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "profile":
        return (
          <ProfileElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "socials":
        return (
          <SocialsElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "shopify":
        return (
          <ShopifyElementView
            key={elem.id}
            element={elem}
            styles={styles}
          />
        );
      case "subscribe":
        return (
          <SubscribeElementView
            key={elem.id}
            element={elem}
            styles={styles}
            slug={pageData.slug}
          />
        );
      default:
        console.warn("Unknown element type:", elem.type);
        return null;
    }
  };

  return (
    <div style={dynamicStyles}>
      <div style={contentWrapperStyles}>
        {elements.map((element) => renderElement(element))}
        {elements.length === 0 && (
          <p
            className="text-center py-20"
            style={{ color: styles.textColor || defaultStyles.textColor, opacity: 0.7 }}>
            This page has no content yet.
          </p>
        )}
      </div>
      <Toaster
        richColors
        position="bottom-right"
      />
    </div>
  );
}
