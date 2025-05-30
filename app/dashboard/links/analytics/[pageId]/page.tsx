// app/dashboard/analytics/[pageId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // For client-side auth for page details
import { createClient } from "@supabase/supabase-js"; // Assuming you have this from Supabase CLI
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, BarChart3 } from "lucide-react";
import { toast, Toaster } from "sonner";

interface PageDetails {
  id: string;
  slug: string;
  custom_domain?: string | null;
}

interface ViewRecord {
  id: string; // Or whatever type your ID is
  viewed_at: string; // Or Date
  // other fields if you fetch them (e.g., ip_address, user_agent)
}

export default function PageAnalyticsReport() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.pageId as string | undefined;
  const [viewRecords, setViewRecords] = useState<ViewRecord[] | null>(null);
  const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
  const [totalViews, setTotalViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase client for fetching page details (like slug, custom_domain)
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!pageId) {
      setError("Page ID not found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      setPageDetails(null);
      setTotalViews(null);

      try {
        const { data: pageDataResult, error: pageError } = await supabase
          .from("link_forms")
          .select("id, slug, custom_domain")
          .eq("id", pageId)
          .single();

        if (pageError) {
          if (pageError.code === "PGRST116") {
            throw new Error("Page details not found or you don't have permission.");
          }
          throw new Error(`Error fetching page details: ${pageError.message}`);
        }
        if (!pageDataResult) {
          throw new Error("Page details not found.");
        }
        setPageDetails(pageDataResult); // Set page details once successfully fetched
        console.log("Fetched page details:", pageDataResult);
        console.log("Page ID:", pageId);
        // --- Step 2: Fetch Total Views via the API route ---
        // This ensures that the logic (including any ownership checks if re-added)
        // in your API route is used for fetching analytics data.
        const response = await fetch(`/api/links/analytics/${pageId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
          let errorMessage = errorData.error || `Failed to fetch analytics: ${response.statusText}`;

          if (response.status === 401) errorMessage = "Authentication required to view analytics.";
          else if (response.status === 403) errorMessage = "You do not have permission to view these analytics.";
          else if (response.status === 404 && errorData.error && errorData.error.toLowerCase().includes("page not found")) {
            console.warn("Analytics API returned 404: Page not found for analytics count.");
            setTotalViews(0); // Or handle as an error for analytics specifically
          }

          if (response.status !== 404 || (response.status === 404 && !errorData.error?.toLowerCase().includes("page not found"))) {
            throw new Error(errorMessage);
          }
        } else {
          const data = await response.json();
          console.log("Fetched analytics data:", data);
          setViewRecords(data.viewRecords || []);
        }
      } catch (err: any) {
        console.error("Error in fetchAnalyticsData:", err);
        toast.error(`${err.message}`);
        setError(`${err.message}`); // Set the error state to display the error UI
        // If page details were fetched but analytics failed, pageDetails will still be set.
        // If page details also failed, pageDetails will be null.
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [pageId, supabase]);

  const computedTotalViews = viewRecords ? viewRecords.length : null;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading analytics...</div>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  // --- Error State (covers errors from both page details and analytics API fetch) ---
  if (error && !pageDetails) {
    // If there's an error AND page details couldn't be loaded
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <BarChart3 className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Page Data</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bio Pages
          </Button>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  // --- Page Not Found (if pageDetails is null after loading and no general error was set for it) ---
  if (!pageDetails && !isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Details Not Found</h2>
          <p className="text-gray-600 mb-6">The details for this page could not be loaded, or the page does not exist.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bio Pages
          </Button>
        </div>
        <Toaster
          richColors
          position="bottom-right"
        />
      </div>
    );
  }

  // --- Main Content Display ---
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {pageDetails && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Analytics for: {pageDetails.slug || pageDetails.custom_domain || `Page ID: ${pageId}`}
            </h1>
          </div>
        )}

        {/* Display general error for analytics if page details loaded but analytics fetch failed */}
        {error &&
          pageDetails &&
          !viewRecords && ( // Show error if viewRecords is still null due to an error
            <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              <p>Could not load analytics data: {error}</p>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Total Page Views</h3>
              <Eye className="h-6 w-6 text-blue-500" />
            </div>

            {viewRecords !== null ? ( // Check if viewRecords has been fetched (even if empty)
              <p className="text-4xl font-bold text-gray-800">{viewRecords.length.toLocaleString()}</p>
            ) : (
              <p className="text-gray-500">{error ? "Not available" : "Loading..."}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Total times this page has been viewed.</p>
          </div>
        </div>
      </main>
      <Toaster
        richColors
        position="bottom-right"
      />
    </div>
  );
}
