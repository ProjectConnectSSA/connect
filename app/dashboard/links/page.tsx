// Remove or fix the need for this disable if possible
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react"; // Added useMemo
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input"; // Import Input
import { Badge } from "@/components/ui/badge"; // Import Badge
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, Link as LinkIcon, Copy, QrCode, Search } from "lucide-react"; // Added Search
import { toast, Toaster } from "sonner";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

// Define a type for the data expected from the API list endpoint
interface BioPageListItem {
  id: string;
  slug: string;
  customDomain?: string | null;
  title?: string;
  // Assuming these might come from the API or can be added
  created_at?: string;
  isActive?: boolean; // Example status field
}

// Utility function: format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); // Example format: 14 Jul 2024
  } catch (e) {
    return "Invalid Date";
  }
};

// Filter options (similar to FormsPage example)
const statusFilterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BioPagesDashboard() {
  const router = useRouter();
  const [bioPages, setBioPages] = useState<BioPageListItem[] | null>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- Search and Filter State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  // Constants for usage card
  const totalPagesAllowed = 10;
  const usedPages = bioPages?.length ?? 0;
  const progressValue = totalPagesAllowed > 0 ? (usedPages / totalPagesAllowed) * 100 : 0;

  // States for Share Dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchBioPages();
  }, []);

  async function fetchBioPages() {
    // ... fetch logic (keep as is, using /api/links or /api/bio-pages) ...
    setIsLoading(true);
    try {
      const response = await fetch(`/api/links`); // Or /api/bio-pages
      if (!response.ok) {
        /* ... error handling ... */ throw new Error("Failed fetch");
      }
      const data = await response.json();
      const pages = data.data || data || [];
      // Add a default isActive status if not provided by API (for filtering demo)
      const pagesWithStatus = pages.map((p: BioPageListItem) => ({ ...p, isActive: p.isActive ?? true }));
      if (pagesWithStatus.length > 0 && pagesWithStatus[0].created_at) {
        pagesWithStatus.sort((a: BioPageListItem, b: BioPageListItem) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
      }
      setBioPages(pagesWithStatus);
    } catch (error) {
      /* ... error handling ... */ console.error(error);
      setBioPages([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function deletePage(id: string) {
    // ... delete logic (keep as is) ...
    const originalPages = bioPages;
    setBioPages((prevPages) => (prevPages ? prevPages.filter((page) => page.id !== id) : []));
    toast.info("Deleting page...");
    try {
      const response = await fetch(`/api/links`, {
        /* ... DELETE request ... */ method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        /* ... error handling ... */ throw new Error("Failed delete");
      }
      toast.success("Page deleted successfully!");
    } catch (error) {
      /* ... error handling ... */ console.error(error);
      setBioPages(originalPages);
    }
  }

  // --- Filtered and Searched Data ---
  const filteredAndSearchedPages = useMemo(() => {
    let filtered = bioPages || [];

    // Apply Status Filter
    if (activeFilter !== "all") {
      const isActiveFilter = activeFilter === "active";
      filtered = filtered.filter((page) => page.isActive === isActiveFilter);
    }

    // Apply Search Filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((page) => page.title?.toLowerCase().includes(lowerSearchTerm) || page.slug.toLowerCase().includes(lowerSearchTerm));
    }

    return filtered;
  }, [bioPages, searchTerm, activeFilter]);

  // --- Share Dialog Handlers (keep as is) ---
  const handleShareTrigger = (page: BioPageListItem) => {
    /* ... set link, open dialog ... */ const link = page.customDomain
      ? `${window.location.protocol}//${page.customDomain}`
      : `${baseUrl}/p/${page.slug}`;
    setShareLink(link);
    setCopied(false);
    setShowQRCode(false);
    setShareDialogOpen(true);
  };
  const handleCopy = async () => {
    /* ... copy logic ... */ try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed copy.");
    }
  };
  const downloadQRCode = () => {
    /* ... download logic ... */ if (!qrCodeRef.current) {
      toast.error("QR Ref Error");
      return;
    }
    const svg = qrCodeRef.current.querySelector("svg");
    if (!svg) {
      toast.error("QR SVG Error");
      return;
    }
    const s = new XMLSerializer().serializeToString(svg);
    const b = new Blob(['<?xml version="1.0" standalone="no"?>\r\n', s], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shareLink.split("/").pop() || "page"}-qrcode.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("QR Download started.");
  };

  // --- Navigation Handlers (keep as is) ---
  function handleEditPage(page: BioPageListItem) {
    router.push(`/dashboard/links/edit/${page.slug}`);
  }
  const handleViewPage = (page: BioPageListItem) => {
    const url = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // --- Loading UI ---
  if (isLoading) {
    /* ... loading component ... */ return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );
  }
  // --- Error/No Data UI (can be combined) ---
  if (!bioPages) {
    /* ... error component ... */ return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">Error loading data.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 space-y-6 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bio Pages</h1>
            <p className="text-gray-600">Create and manage your profile pages.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/dashboard/links/edit/new-bio-page`)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Create Bio Page
            </Button>
            {/* EXACT Usage Card Styling */}
            {totalPagesAllowed > 0 && (
              <Card className="bg-gray-50 border-none shadow-sm rounded-lg p-2 w-32 h-10 flex flex-col justify-center">
                {" "}
                {/* Exact style match */}
                <span className="text-xs font-medium text-gray-700 text-center">
                  {" "}
                  {/* Adjusted text */}
                  {usedPages}/{totalPagesAllowed} Used
                </span>
                <Progress
                  value={progressValue}
                  className="w-full mt-1 h-1 bg-gray-300 [&>*]:bg-blue-500"
                />{" "}
                {/* Exact style match */}
              </Card>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full" // Add padding for icon
              />
            </div>
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Status:</span>
              {statusFilterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(option.value as any)}
                  className={activeFilter === option.value ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"}>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Bio Pages List/Table Area */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          {/* Table Header Row */}
          <div className="flex items-center p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="w-2/5 pl-3">Title / Link</div> {/* Adjust width as needed */}
            <div className="w-1/5 text-center">Status</div> {/* Adjust width */}
            <div className="w-1/5 text-center">Created</div> {/* Adjust width */}
            <div className="w-1/5 text-right pr-6">Actions</div> {/* Adjust width */}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredAndSearchedPages.length > 0 ? (
              filteredAndSearchedPages.map((page) => {
                const displayUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
                const displayHost = page.customDomain || `${baseUrl.replace(/^https?:\/\//, "")}/p/${page.slug}`;
                return (
                  <div
                    key={page.id}
                    className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out text-sm">
                    {/* Column 1: Title/Link */}
                    <div className="w-2/5 pl-3 overflow-hidden">
                      <p className="font-medium text-gray-900 truncate">{page.title || page.slug}</p>
                      <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:underline truncate"
                        title={displayUrl}>
                        <LinkIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{displayHost}</span>
                      </a>
                    </div>
                    {/* Column 2: Status */}
                    <div className="w-1/5 text-center">
                      <Badge variant={page.isActive ? "success" : "secondary"}>{page.isActive ? "Active" : "Inactive"}</Badge>
                    </div>
                    {/* Column 3: Created Date */}
                    <div className="w-1/5 text-center text-gray-500">{formatDate(page.created_at)}</div>
                    {/* Column 4: Actions */}
                    <div className="w-1/5 text-right pr-4">
                      {" "}
                      {/* Added pr-4 to align dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="shadow-lg rounded-md border border-gray-200 bg-white w-40">
                          <DropdownMenuItem
                            onClick={() => handleEditPage(page)}
                            className="cursor-pointer group">
                            <Pencil className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                            <span className="text-gray-700 group-hover:text-blue-600">Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShareTrigger(page)}
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
                            onClick={() => deletePage(page.id)}
                            className="cursor-pointer text-red-600 hover:!bg-red-50 group focus:!bg-red-50 focus:!text-red-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500 px-4">
                {searchTerm || activeFilter !== "all" ? "No bio pages match your current filters." : "No bio pages created yet."}
              </div>
            )}
          </div>
        </div>

        {/* Share Dialog (Keep as is) */}
        <Dialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            {/* ... Dialog Content ... */}
            <DialogHeader>
              <DialogTitle>Share Bio Page</DialogTitle>
              <DialogDescription>Use the link below or QR code.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-gray-50"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="h-9 w-9">
                <span className="sr-only">Copy</span>
                {copied ? <Copy className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
              </Button>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="secondary"
                size="sm">
                {showQRCode ? "Hide" : "Show"} QR Code
                <QrCode className="ml-2 h-4 w-4" />
              </Button>
              {showQRCode && (
                <div className="mt-4 flex flex-col items-center">
                  <div
                    ref={qrCodeRef}
                    className="p-2 bg-white border rounded-md">
                    <QRCodeSVG
                      value={shareLink}
                      size={128}
                      level={"L"}
                      includeMargin={false}
                    />
                  </div>
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    size="sm"
                    className="mt-3">
                    Download QR
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>{" "}
      {/* End main content area */}
      <Toaster
        richColors
        position="bottom-right"
      />
    </div> // End flex h-screen
  );
}
