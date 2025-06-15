"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"; // Added React import
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle as they weren't used here
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Added Separator
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Share2,
  Eye,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Copy,
  QrCode,
  Search,
  Loader2,
  AlertTriangle, // Added Loader2, AlertTriangle
} from "lucide-react";
import { toast, Toaster } from "sonner";
import DashboardSidebar from "@/components/dashboard/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Added Footer
  DialogClose, // Added Close
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
// Assuming TopBar exists

// Assuming PageData includes id
import type { PageData } from "@/app/types/links/types";
import { Skeleton } from "@radix-ui/themes";
import { TopBar } from "@/components/dashboard/topbar";

const formatDate = (dateString?: string | null) => {
  // Allow null
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date"; // Check if date is valid
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return "Invalid Date";
  }
};

const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BioPagesDashboard() {
  const router = useRouter();
  const [bioPages, setBioPages] = useState<PageData[]>([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  // --- State for Delete Confirmation ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // --- End Delete Confirmation State ---

  // --- State for Share Dialog ---
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  // --- End Share Dialog State ---

  // --- Fetching Data ---
  useEffect(() => {
    // Ensure this runs only on the client
    setBaseUrl(window.location.origin);
    fetchBioPages();
  }, []);

  const fetchBioPages = useCallback(async () => {
    // useCallback for potential future use
    setIsLoading(true);
    try {
      const res = await fetch("/api/links"); // Removed extra space
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to get error details
        throw new Error(errorData.error || `Failed to fetch pages: ${res.statusText}`);
      }
      const data = await res.json();

      // Ensure data.data is an array before mapping
      const pagesData = Array.isArray(data?.data) ? data.data : [];

      const pages: PageData[] = pagesData.map((p: any) => ({
        id: p.id, // Make sure 'id' is included
        slug: p.slug,
        customDomain: p.custom_domain,
        // title: p.title, // Assuming title might not be directly on this object anymore? Get from elements maybe? Or add to API response? Using slug as fallback.
        title: p.title || p.slug || "Untitled Page", // Added fallback title
        created_at: p.created_at,
        active: p.active,
        // Include other necessary fields if needed (elements, styles not needed for list view)
      }));

      // Sort by creation date (descending)
      pages.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      setBioPages(pages);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error(`Failed to load pages: ${err.message}`);
      setBioPages([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means fetch once on mount

  // --- Filtering and Searching ---
  const filteredAndSearchedPages = useMemo(() => {
    return bioPages.filter((page) => {
      // Status Filter
      if (activeFilter !== "all") {
        const wantActive = activeFilter === "active";
        if (page.active !== wantActive) return false;
      }
      // Search Filter (checking slug and title)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const titleMatch = page.slug?.toLowerCase().includes(term);
        const slugMatch = page.slug?.toLowerCase().includes(term);
        if (!titleMatch && !slugMatch) {
          return false;
        }
      }
      return true;
    });
  }, [bioPages, searchTerm, activeFilter]);

  // --- Usage Calculation ---
  // Fetch profile data to get limits and current usage for the progress bar
  const [profileUsage, setProfileUsage] = useState({ current: 0, limit: 10 }); // Default/initial values
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfileUsage = async () => {
      setIsProfileLoading(true);
      try {
        const res = await fetch("/api/profile"); // Use the correct API

        if (!res.ok) throw new Error("Failed to fetch usage");
        const usageData = await res.json();
        console.log("Profile API response:", usageData); // Debugging line
        if (usageData?.links) {
          setProfileUsage({
            current: usageData.links.current ?? 0,
            limit: usageData.links.limit ?? 10, // Use fetched limit or default
          });
        }
      } catch (err) {
        console.error("Failed to load profile usage:", err);
        // Keep default limits on error
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfileUsage();
  }, []); // Fetch once on mount

  const progressValue = profileUsage.limit > 0 ? (profileUsage.current / profileUsage.limit) * 100 : 0;

  // --- Share Dialog Logic ---
  const handleShareTrigger = (page: PageData) => {
    /* ... (no change) ... */
    const link = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
    setShareLink(link);
    setCopied(false);
    setShowQRCode(false);
    setShareDialogOpen(true);
  };
  const handleCopy = async () => {
    /* ... (no change) ... */
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy.");
    }
  };
  const downloadQRCode = () => {
    /* ... (no change) ... */
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) {
      toast.error("QR code not found");
      return;
    }
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    try {
      const urlObj = new URL(shareLink);
      const segments = urlObj.pathname.split("/").filter(Boolean);
      const name = segments.pop() || "page";
      link.download = `${name}-qrcode.svg`;
    } catch {
      link.download = "page-qrcode.svg";
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("QR code downloaded!");
  };
  // --- End Share Dialog Logic ---

  // --- Edit and View Handlers (Using ID) ---
  const handleEditPage = (pageId: string | number) => {
    // Accept ID
    if (!pageId) return;
    router.push(`/dashboard/links/edit/${pageId}`);
  };

  const handleViewPage = (pageId: string | number) => {
    // Accept ID
    if (!pageId) return;
    // Assuming you have a page route like /dashboard/links/view/[id]
    // If you intend to view the *public* page, use the logic from handleShareTrigger
    window.open(`/dashboard/links/view/${pageId}`, "_blank");
  };
  // --- End Edit and View Handlers ---

  // --- Delete Logic ---
  const handleDeleteTrigger = (page: PageData) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePage = async () => {
    if (!pageToDelete || !pageToDelete.id) return;
    setIsDeleting(true);

    const pageId = pageToDelete.id; // Store id before clearing state

    // Use toast.promise for better UX
    const promise = fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pageId }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete: ${res.statusText}`);
      }
      return res.json(); // Or just check res.ok if no body expected
    });

    toast.promise(promise, {
      loading: `Deleting page "${pageToDelete.slug || pageToDelete.slug}"...`,
      success: (data) => {
        // Remove from state immutably
        setBioPages((prevPages) => prevPages.filter((p) => p.id !== pageId));
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setPageToDelete(null);
        // Optionally refresh usage count if it changed significantly
        // fetchProfileUsage();
        return `Page "${pageToDelete.slug || pageToDelete.slug}" deleted successfully.`;
      },
      error: (err) => {
        setIsDeleting(false);
        // Don't close dialog on error, let user retry or cancel
        return `Error deleting page: ${err.message}`;
      },
    });
  };
  // --- End Delete Logic ---

  // --- Render Loading ---
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          {/* Scrollable Content Area */}
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading Pages...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Added spacing */}
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Use flex-wrap and gap */}
              <div></div>
              <Button
                onClick={() => router.push("/dashboard/links/edit/new")} // Use 'new' consistently
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                {/* Prevent wrap */}
                <Plus className="mr-2 h-4 w-4" /> Create Page
              </Button>
            </div>
            {/* Filter/Search Bar */}
            <Card className="p-3 md:p-4">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Search */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search title or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm" // Adjusted height and size
                  />
                </div>
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-700">Status:</span>
                  {statusFilterOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={activeFilter === opt.value ? "secondary" : "outline"} // Use secondary for active filter
                      size="sm"
                      className="h-9 text-xs px-2.5" // Adjusted size
                      onClick={() => setActiveFilter(opt.value as any)}>
                      {opt.label}
                    </Button>
                  ))}
                </div>
                {/* Usage Progress - Moved to the end, adjusted size */}
                <div className="ml-auto w-36 h-10 flex flex-col justify-center pl-4">
                  {/* Increased width */}
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium text-gray-700">Usage</span>
                    {isProfileLoading ? (
                      <Skeleton className="h-3 w-10 bg-gray-200" />
                    ) : (
                      <span className="text-xs text-gray-500">
                        {profileUsage.current}/{profileUsage.limit === Infinity || profileUsage.limit <= 0 ? "∞" : profileUsage.limit}
                      </span>
                    )}
                  </div>
                  {isProfileLoading ? (
                    <Skeleton className="h-1.5 w-full bg-gray-200 rounded-full" />
                  ) : (
                    <Progress
                      value={progressValue}
                      className="w-full h-1.5" // Adjusted height
                      aria-label={`${profileUsage.current} of ${profileUsage.limit} pages used`}
                    />
                  )}
                </div>
              </div>
            </Card>
            {/* Pages List */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              {/* Added overflow-x-auto */}
              <table className="w-full min-w-[640px]">
                {/* Added min-width */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Link</th>
                    <th className="w-1/5 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="w-1/5 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="w-1/5 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSearchedPages.length > 0 ? (
                    filteredAndSearchedPages.map((page) => {
                      // Ensure page.id exists and is valid before using it
                      if (!page.id) return null; // Skip rendering if no ID

                      const displayUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;

                      return (
                        <tr
                          key={page.id}
                          className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {/* Link title to the edit page using ID */}
                            <button
                              onClick={() => handleEditPage(page.id!)} // Use ID
                              className="font-medium text-gray-900 truncate hover:text-blue-600 text-left w-full">
                              {page.slug}
                            </button>
                            <a
                              href={displayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 truncate flex items-center hover:underline">
                              <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              {displayUrl.replace(/^https?:\/\//, "")}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant={page.active ? "success" : "secondary"}>{page.active ? "Active" : "Inactive"}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-500 whitespace-nowrap">{formatDate(page.created_at)}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPage(page.id!)}>
                                  {/* Use ID */}
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShareTrigger(page)}>
                                  <Share2 className="mr-2 h-4 w-4" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewPage(page.id!)}>
                                  {/* Use ID */}
                                  <Eye className="mr-2 h-4 w-4" /> View Page (Dashboard)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTrigger(page)} // Trigger confirmation
                                  className="text-red-600 focus:bg-red-100 focus:text-red-700">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-gray-500">
                        {isLoading ? "Loading..." : "No pages found matching your criteria."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* End space-y-6 */}
        </main>
        {/* End main content */}
      </div>
      {/* End flex-1 flex-col */}
      {/* --- Dialogs --- */}
      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}>
        <DialogContent>
          {/* ... (Share Dialog content remains the same) ... */}
          <DialogHeader>
            <DialogTitle>Share Page</DialogTitle>
            <DialogDescription>Copy or scan the QR code to share.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              value={shareLink}
              readOnly
              className="flex-1"
            />
            <Button
              onClick={handleCopy}
              size="icon">
              <Copy className={copied ? "text-green-500" : ""} />
            </Button>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              size="sm">
              {showQRCode ? "Hide" : "Show"} QR <QrCode className="ml-2 h-4 w-4" />
            </Button>
            {showQRCode && (
              <div
                ref={qrCodeRef}
                className="mt-4 p-2 border rounded inline-block">
                <QRCodeSVG
                  value={shareLink}
                  size={128}
                />
              </div>
            )}
            {showQRCode && (
              <Button
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
                className="mt-2 ml-2">
                Download QR
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" /> Are you sure?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the page
              <span className="font-semibold"> "{pageToDelete?.slug}"</span> and all its associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setPageToDelete(null)}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeletePage}
              disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* --- End Dialogs --- */}
      <Toaster
        richColors
        position="bottom-right"
      />
    </div> // End flex h-screen
  );
}
