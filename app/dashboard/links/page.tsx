"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, Link as LinkIcon, Copy, QrCode, Search } from "lucide-react";
import { toast, Toaster } from "sonner";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

import type { PageData } from "@/app/types/links/types";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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

  const totalPagesAllowed = 10;
  const usedPages = bioPages.length;
  const progressValue = (usedPages / totalPagesAllowed) * 100;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchBioPages();
  }, []);

  const fetchBioPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/links ");
      const data = await res.json();
      const pages: PageData[] = data.data.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        customDomain: p.custom_domain,
        title: p.title,
        created_at: p.created_at,
        active: p.active,
      }));
      pages.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
      setBioPages(pages);
    } catch (err) {
      console.error(err);
      setBioPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSearchedPages = useMemo(() => {
    return bioPages.filter((page) => {
      if (activeFilter !== "all") {
        const wantActive = activeFilter === "active";
        if (page.active !== wantActive) return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!page.slug?.toLowerCase().includes(term) && !page.slug.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [bioPages, searchTerm, activeFilter]);

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
    // Serialize SVG element to string
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    // Create blob URL
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    // Create temporary link for download
    const link = document.createElement("a");
    link.href = url;
    // Derive filename from shareLink path
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

  const handleEditPage = (page: PageData) => router.push(`/dashboard/links/edit/${page.slug}`);
  const handleViewPage = (page: PageData) =>
    window.open(page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/dashboard/links/view/${page.slug}`, "_blank");

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bio Pages</h1>
            <p className="text-gray-600">Create and manage your profile pages.</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard/links/edit/new-bio-page")}
            className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Page
          </Button>
        </div>

        <Card className="p-4 flex flex-wrap items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search title or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Status:</span>
            {statusFilterOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={activeFilter === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(opt.value as any)}>
                {opt.label}
              </Button>
            ))}
          </div>
          <CardContent className="ml-auto w-32 h-10 flex flex-col justify-center">
            <span className="text-xs font-medium text-center text-gray-700">
              {usedPages}/{totalPagesAllowed} Used
            </span>
            <Progress
              value={progressValue}
              className="w-full h-1 bg-gray-300 [&>*]:bg-blue-500 mt-1"
            />
          </CardContent>
        </Card>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide p-4">
            <div className="w-2/5">Title / Link</div>
            <div className="w-1/5 text-center">Status</div>
            <div className="w-1/5 text-center">Created</div>
            <div className="w-1/5 text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAndSearchedPages.length ? (
              filteredAndSearchedPages.map((page) => {
                const displayUrl = page.customDomain ? `${window.location.protocol}//${page.customDomain}` : `${baseUrl}/p/${page.slug}`;
                function deletePage(id: string | undefined): void {
                  throw new Error("Function not implemented.");
                }

                return (
                  <div
                    key={page.id}
                    className="flex items-center p-4 hover:bg-gray-50">
                    <div className="w-2/5">
                      <p className="font-medium text-gray-900 truncate">{page.slug || page.slug}</p>
                      <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-blue-600 truncate flex items-center">
                        <LinkIcon className="h-3 w-3 mr-1" />
                        {displayUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                    <div className="w-1/5 text-center">
                      <Badge variant={page.active ? "success" : "secondary"}>{page.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="w-1/5 text-center text-gray-500">{formatDate(page.created_at)}</div>
                    <div className="w-1/5 text-right">
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
                          <DropdownMenuItem onClick={() => handleEditPage(page)}>
                            {" "}
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShareTrigger(page)}>
                            {" "}
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewPage(page)}>
                            {" "}
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deletePage(page.id)}
                            className="text-red-600">
                            {" "}
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-gray-500">No pages match your filters.</div>
            )}
          </div>
        </div>

        <Dialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}>
          <DialogContent>
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
                <Copy />
              </Button>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                size="sm">
                {showQRCode ? "Hide" : "Show"} QR <QrCode className="ml-2" />
              </Button>
              {showQRCode && (
                <div
                  ref={qrCodeRef}
                  className="mt-4 p-2 border rounded">
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
                  className="mt-2">
                  Download QR
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster
        richColors
        position="bottom-right"
      />
    </div>
  );
}
