// app/dashboard/links/page.tsx (Assuming this is your BioPagesDashboard file)
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Share2,
  Eye,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Copy,
  CopyPlus,
  QrCode,
  Search,
  Loader2,
  AlertTriangle,
  BarChart3, // <-- Import BarChart3 icon for Analytics
} from "lucide-react";
import { toast, Toaster } from "sonner";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import type { PageData as PageDataType } from "@/app/types/links/types";
import { Skeleton } from "@radix-ui/themes"; // Assuming this is @radix-ui/themes/Skeleton
import { TopBar } from "@/components/dashboard/topbar";

interface PageData {
  id: string | number;
  slug: string;
  customDomain?: string | null;
  created_at?: string | null;
  active: boolean;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<PageData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchBioPages();
  }, []);

  const fetchBioPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/links");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch pages: ${res.statusText}`);
      }
      const data = await res.json();
      const pagesData = Array.isArray(data?.data) ? data.data : [];
      const pages: PageData[] = pagesData.map((p: any) => ({
        id: p.id,
        slug: p.slug || "untitled-page",
        customDomain: p.custom_domain,
        created_at: p.created_at,
        active: p.active ?? true, // Ensure active has a default
      }));
      pages.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      setBioPages(pages);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error(`Failed to load pages: ${err.message}`);
      setBioPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredAndSearchedPages = useMemo(() => {
    return bioPages.filter((page) => {
      if (activeFilter !== "all") {
        const wantActive = activeFilter === "active";
        if (page.active !== wantActive) return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const slugMatch = page.slug?.toLowerCase().includes(term);
        if (!slugMatch) {
          return false;
        }
      }
      return true;
    });
  }, [bioPages, searchTerm, activeFilter]);

  const [profileUsage, setProfileUsage] = useState({ current: 0, limit: 10 });
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchProfileUsage = useCallback(async () => {
    setIsProfileLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch usage");
      const usageData = await res.json();
      if (usageData?.links) {
        setProfileUsage({
          current: usageData.links.current ?? 0,
          limit: usageData.links.limit ?? 10,
        });
      }
    } catch (err) {
      console.error("Failed to load profile usage:", err);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileUsage();
  }, [fetchProfileUsage]);

  const progressValue = profileUsage.limit > 0 && profileUsage.limit !== Infinity ? (profileUsage.current / profileUsage.limit) * 100 : 0;

  const handleShareTrigger = (page: PageData) => {
    const link = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
    setShareLink(link);
    setCopied(false);
    setShowQRCode(false);
    setShareDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const downloadQRCode = () => {
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

  const handleEditPage = (pageId: string | number) => {
    if (!pageId) return;
    router.push(`/dashboard/links/edit/${pageId}`);
  };

  const handleViewPage = (pageId: string | number) => {
    if (!pageId) return;
    const page = bioPages.find((p) => p.id === pageId);
    if (page) {
      const publicUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`; // Changed to /p/ for public view
      window.open(publicUrl, "_blank");
    } else {
      toast.error("Page details not found to open.");
    }
  };

  // New handler for Analytics
  const handleViewAnalytics = (pageId: string | number) => {
    if (!pageId) return;
    router.push(`/dashboard/links/analytics/${pageId}`);
  };

  const handleDeleteTrigger = (page: PageData) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePage = async () => {
    if (!pageToDelete || !pageToDelete.id) return;
    setIsDeleting(true);
    const pageId = pageToDelete.id;
    const pageSlugDisplay = pageToDelete.slug;
    const promise = fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pageId }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete: ${res.statusText}`);
      }
      return res.json();
    });
    toast.promise(promise, {
      loading: `Deleting page "${pageSlugDisplay}"...`,
      success: () => {
        setBioPages((prevPages) => prevPages.filter((p) => p.id !== pageId));
        fetchProfileUsage();
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setPageToDelete(null);
        return `Page "${pageSlugDisplay}" deleted successfully.`;
      },
      error: (err) => {
        setIsDeleting(false);
        return `Error deleting page: ${err.message}`;
      },
    });
  };

  const handleClonePage = async (pageId: string | number) => {
    const pageToClone = bioPages.find((p) => p.id === pageId);
    if (!pageToClone) {
      toast.error("Page not found to clone.");
      return;
    }
    if (profileUsage.limit !== Infinity && profileUsage.current >= profileUsage.limit) {
      toast.error("You have reached your page limit. Cannot clone page.");
      return;
    }
    const originalPageSlugDisplay = pageToClone.slug;
    const promise = fetch(`/api/links/clone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pageId }),
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to clone page: ${res.statusText}`);
      }
      return res.json();
    });
    toast.promise(promise, {
      loading: `Cloning page "${originalPageSlugDisplay}"...`,
      success: (clonedPageResponse) => {
        const newClonedPageData = clonedPageResponse.data;
        const newPage: PageData = {
          id: newClonedPageData.id,
          slug: newClonedPageData.slug || "untitled-cloned-page",
          customDomain: newClonedPageData.custom_domain,
          created_at: newClonedPageData.created_at,
          active: newClonedPageData.active,
        };
        setBioPages((prevPages) => {
          const updatedPages = [newPage, ...prevPages];
          updatedPages.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });
          return updatedPages;
        });
        fetchProfileUsage();
        return `Page "${originalPageSlugDisplay}" cloned as "${newPage.slug}".`;
      },
      error: (err) => {
        return `Error cloning page: ${err.message}`;
      },
    });
  };

  if (isLoading && bioPages.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading Pages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Bio Link Pages</h1>
              </div>
              <Button
                onClick={() => router.push("/dashboard/links/edit/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                disabled={profileUsage.limit !== Infinity && profileUsage.current >= profileUsage.limit && !isProfileLoading}>
                <Plus className="mr-2 h-4 w-4" /> Create Page
              </Button>
            </div>
            <Card className="p-3 md:p-4 dark:bg-gray-800">
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Status:</span>
                  {statusFilterOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={activeFilter === opt.value ? "secondary" : "outline"}
                      size="sm"
                      className={`h-9 text-xs px-2.5 ${
                        activeFilter === opt.value
                          ? "dark:bg-gray-700 dark:text-gray-200"
                          : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveFilter(opt.value as any)}>
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <div className="ml-auto w-40 h-10 flex flex-col justify-center pl-4">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Page Limit</span>
                    {isProfileLoading ? (
                      <Skeleton>
                        <span className="text-xs"> 0/0 </span>
                      </Skeleton>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {profileUsage.current}/{profileUsage.limit === Infinity || profileUsage.limit <= 0 ? "∞" : profileUsage.limit}
                      </span>
                    )}
                  </div>
                  {isProfileLoading ? (
                    <Skeleton>
                      <Progress
                        value={0}
                        className="w-full h-1.5"
                      />
                    </Skeleton>
                  ) : (
                    <Progress
                      value={progressValue}
                      className="w-full h-1.5"
                      aria-label={`${profileUsage.current} of ${profileUsage.limit} pages used`}
                    />
                  )}
                </div>
              </div>
            </Card>

            {isLoading && bioPages.length > 0 && (
              <div className="flex items-center justify-center py-4 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Refreshing...</span>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Slug / Link
                    </th>
                    <th className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="w-1/5 px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSearchedPages.length > 0 ? (
                    filteredAndSearchedPages.map((page) => {
                      if (!page.id) return null;
                      const displayUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
                      return (
                        <tr
                          key={page.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => handleEditPage(page.id!)}
                              className="font-medium text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 text-left w-full">
                              {page.slug}
                            </button>
                            <a
                              href={displayUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 truncate flex items-center hover:underline">
                              <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              {displayUrl.replace(/^https?:\/\//, "")}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              variant={page.active ? "success" : "secondary"}
                              className={page.active ? "dark:bg-green-700 dark:text-green-100" : "dark:bg-gray-600 dark:text-gray-200"}>
                              {page.active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {formatDate(page.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="dark:bg-gray-800 border-gray-700">
                                <DropdownMenuItem
                                  onClick={() => handleEditPage(page.id!)}
                                  className="dark:focus:bg-gray-700 dark:text-gray-200">
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                {/* Analytics Option Added Here */}
                                <DropdownMenuItem
                                  onClick={() => handleViewAnalytics(page.id!)}
                                  className="dark:focus:bg-gray-700 dark:text-gray-200">
                                  <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleShareTrigger(page)}
                                  className="dark:focus:bg-gray-700 dark:text-gray-200">
                                  <Share2 className="mr-2 h-4 w-4" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleClonePage(page.id!)}
                                  disabled={profileUsage.limit !== Infinity && profileUsage.current >= profileUsage.limit && !isProfileLoading}
                                  className="dark:focus:bg-gray-700 dark:text-gray-200">
                                  <CopyPlus className="mr-2 h-4 w-4" /> Clone
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleViewPage(page.id!)}
                                  className="dark:focus:bg-gray-700 dark:text-gray-200">
                                  <Eye className="mr-2 h-4 w-4" /> View Public Page
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-gray-700" />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTrigger(page)}
                                  className="text-red-600 focus:bg-red-100 focus:text-red-700 dark:focus:bg-red-700/20 dark:focus:text-red-400 dark:text-red-400">
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
                        className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                        {isLoading && bioPages.length === 0 ? "Loading..." : "No pages found."}
                        {!isLoading && searchTerm && " Try adjusting your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Dialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}>
        <DialogContent className="dark:bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Share Page</DialogTitle>
            <DialogDescription className="dark:text-gray-400">Copy link or scan the QR code to share your page.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              value={shareLink}
              readOnly
              className="flex-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            />
            <Button
              onClick={handleCopy}
              size="icon"
              variant="outline"
              className="dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300">
              <Copy className={`h-4 w-4 ${copied ? "text-green-500" : "dark:text-gray-300"}`} />
            </Button>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300">
              {showQRCode ? "Hide" : "Show"} QR Code <QrCode className="ml-2 h-4 w-4" />
            </Button>
            {showQRCode && (
              <div
                ref={qrCodeRef}
                className="mt-4 p-2 border dark:border-gray-700 rounded inline-block bg-white">
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
                className="mt-2 ml-2 sm:ml-0 sm:mt-0 sm:float-right dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300">
                Download QR
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" /> Are you sure?
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete the page <span className="font-semibold">"{pageToDelete?.slug}"</span> and
              all its associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setPageToDelete(null)}
                className="dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300">
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

      <Toaster
        richColors
        position="bottom-right"
        theme="system"
      />
    </div>
  );
}
