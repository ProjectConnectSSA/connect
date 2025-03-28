// Remove or fix the need for this disable if possible
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, Link as LinkIcon } from "lucide-react"; // Added LinkIcon
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Assuming sonner is available for notifications
import DashboardSidebar from "@/components/dashboard/sidebar";

// Define a type for the data expected from the API list endpoint
interface BioPageListItem {
  id: string; // The UUID from Supabase DB
  slug: string;
  customDomain?: string | null;
  // Add other fields if your API returns them, e.g., a title derived from profile
  title?: string; // Optional title field
}

export default function BioPagesDashboard() {
  // Renamed component
  const router = useRouter();
  // State to hold the fetched bio pages
  const [bioPages, setBioPages] = useState<BioPageListItem[] | null>(null);
  const [baseUrl, setBaseUrl] = useState(""); // To construct full URLs

  // Constants for usage card (adjust as needed)
  const totalPagesAllowed = 10; // Example limit
  const usedPages = bioPages?.length ?? 0;
  const progressValue = totalPagesAllowed > 0 ? (usedPages / totalPagesAllowed) * 100 : 0;

  useEffect(() => {
    // Get the base URL on the client-side
    setBaseUrl(window.location.origin);
    fetchBioPages();
    // Removed clearFormToEdit(); as it's likely not needed anymore
  }, []);

  async function fetchBioPages() {
    setIsLoading(true); // Indicate loading start
    try {
      // Update API endpoint
      const response = await fetch(`/api/links`); // CHANGED API Endpoint
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch bio pages");
      }
      const data = await response.json();
      // Assuming the API returns { data: BioPageListItem[] }
      setBioPages(data.data || []);
    } catch (error) {
      console.error("Error fetching bio pages:", error);
      toast.error(`Error loading pages: ${error instanceof Error ? error.message : "Unknown error"}`);
      setBioPages([]); // Set to empty array on error to stop loading state
    } finally {
      setIsLoading(false); // Indicate loading end
    }
  }

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  async function deletePage(id: string) {
    // Optimistic UI update (optional)
    const originalPages = bioPages;
    setBioPages((prevPages) => (prevPages ? prevPages.filter((page) => page.id !== id) : []));
    toast.info("Deleting page...");

    try {
      // Update API endpoint
      const response = await fetch(`/api/links`, {
        // CHANGED API Endpoint
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // Send the UUID
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete page");
      }

      toast.success("Page deleted successfully!");
      // No need to refetch, optimistic update already done
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
      // Rollback optimistic update on error
      setBioPages(originalPages);
    }
  }

  // Navigate to the editor page using the SLUG
  function handleEditPage(page: BioPageListItem) {
    // Removed setFormToEdit(page); -> Editor fetches its own data based on slug
    router.push(`/dashboard/links/edit/${page.slug}`); // CHANGED Route to editor
  }

  // Open the public page (slug or custom domain) in a new tab
  const handleViewPage = (page: BioPageListItem) => {
    const url = page.customDomain
      ? `${window.location.protocol}//${page.customDomain}` // Use current protocol (http/https)
      : `${baseUrl}/dashboard/links/view/${page.slug}`; // Use slug-based path
    window.open(url, "_blank", "noopener,noreferrer"); // Open in new tab securely
  };

  // Copy the public URL to clipboard
  const handleSharePage = async (page: BioPageListItem) => {
    const url = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Public link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  // Loading State UI
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="w-full p-8 space-y-6">
          {/* Placeholder for Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          {/* Placeholder for Usage Card */}
          <div className="bg-gray-100 border-none shadow-sm rounded-lg p-6 h-32 animate-pulse" />
          {/* Placeholder for List Card */}
          <div className="bg-gray-100 border-none shadow-sm rounded-lg p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Ensure bioPages is not null before rendering the main content
  if (bioPages === null) {
    // This case should ideally be covered by isLoading, but as a fallback:
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex justify-center items-center w-full">Error loading data or no data found.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {" "}
      {/* Added background */}
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto">
        {" "}
        {/* Make main content scrollable */}
        <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6 max-w-4xl mx-auto">
          {" "}
          {/* Added max-width and centering */}
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {" "}
            {/* Added flex-wrap and gap */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bio Pages</h1> {/* Updated Text */}
              <p className="text-gray-600">Create and manage your profile pages.</p> {/* Updated Text */}
            </div>
            <Button
              // Navigate to the editor for a NEW page (slug handled by editor or redirect)
              onClick={() => router.push(`/edit/new-bio-page`)} // CHANGED Route
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition duration-150 ease-in-out">
              <Plus className="mr-2 h-4 w-4" />
              Create Bio Page {/* Updated Text */}
            </Button>
          </div>
          {/* Usage Card */}
          {totalPagesAllowed > 0 && ( // Only show usage if there's a limit
            <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardHeader className="p-4">
                {" "}
                {/* Adjusted padding */}
                <CardTitle className="text-base font-medium text-gray-700">Usage</CardTitle> {/* Adjusted size */}
                <CardDescription className="text-sm text-gray-500">
                  {usedPages} of {totalPagesAllowed} pages used
                </CardDescription>
                <Progress
                  value={progressValue}
                  className="mt-2 h-2 [&>*]:bg-blue-500" // Adjusted height and color class
                  aria-label={`${usedPages} of ${totalPagesAllowed} pages used`}
                />
              </CardHeader>
            </Card>
          )}
          {/* Bio Pages List */}
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardHeader className="p-4 border-b border-gray-200">
              {" "}
              {/* Adjusted padding */}
              <CardTitle className="text-lg font-semibold text-gray-800">Your Bio Pages</CardTitle> {/* Updated Text */}
            </CardHeader>
            <CardContent className="p-4">
              {" "}
              {/* Adjusted padding */}
              <div className="space-y-3">
                {bioPages.length > 0 ? (
                  bioPages.map((page) => {
                    // Determine the display URL
                    const displayUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
                    const displayHost = page.customDomain || `${baseUrl.replace(/^https?:\/\//, "")}/p/${page.slug}`; // Host/path only

                    return (
                      <div
                        key={page.id}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3 hover:shadow-sm transition-shadow duration-150 ease-in-out" // Subtle styling
                      >
                        <div className="overflow-hidden mr-2">
                          {" "}
                          {/* Prevent text overflow */}
                          {/* Display Title if available, otherwise Slug */}
                          <h3 className="font-medium text-gray-800 truncate">{page.title || page.slug}</h3>
                          {/* Display the public URL path/domain */}
                          <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline truncate"
                            title={displayUrl} // Show full URL on hover
                          >
                            <LinkIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{displayHost}</span>
                          </a>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:bg-gray-200 transition flex-shrink-0">
                              {" "}
                              {/* Adjusted hover */}
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="shadow-lg rounded-md border border-gray-200 bg-white w-40">
                            {" "}
                            {/* Adjusted style */}
                            <DropdownMenuItem
                              onClick={() => handleSharePage(page)}
                              className="cursor-pointer group">
                              <Share2 className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="text-gray-700 group-hover:text-blue-600">Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewPage(page)}
                              className="cursor-pointer group">
                              <Eye className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="text-gray-700 group-hover:text-blue-600">View Public</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditPage(page)}
                              className="cursor-pointer group">
                              <Pencil className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                              <span className="text-gray-700 group-hover:text-blue-600">Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deletePage(page.id)}
                              className="cursor-pointer text-red-600 hover:!bg-red-50 group focus:!bg-red-50 focus:!text-red-700">
                              {" "}
                              {/* Destructive style */}
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No bio pages found. <br />
                    Click "Create Bio Page" to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
