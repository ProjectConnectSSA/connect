"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose, // Add this import
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Share2,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Globe,
  Copy,
  QrCode,
  ExternalLink,
  Link2,
  Loader2,
  RefreshCcw,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles, // Add this import
} from "lucide-react";
// Replace the DataTable import with the one from forms
import { DataTable } from "@/components/forms/data-table";
import { Badge } from "@/components/ui/badge";
import { landingTemplates } from "@/components/landing/templates/landing-templates";
import { QRCodeSVG } from "qrcode.react";
import { LandingPreview } from "@/components/landing/landing-preview";
import { toast } from "sonner";
import { DomainSettings } from "@/components/landing/domain-settings";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AILoadingOverlay } from "@/components/landing/ai-loading-overlay";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Utility function: format date.
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Product", value: "product" },
      { label: "Event", value: "event" },
      { label: "Promo", value: "promo" },
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [LandingPages, setLandingPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalPagesAllowed = 10;
  const usedPages = LandingPages?.length ?? 0;
  const progressValue = (usedPages / totalPagesAllowed) * 100;

  // States for sharing
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // States for preview
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  // States for domain management
  const [domainDialogOpen, setDomainDialogOpen] = useState(false);
  const [selectedLandingPage, setSelectedLandingPage] = useState<any>(null);

  // States for limit reached
  const [limitReachedDialogOpen, setLimitReachedDialogOpen] = useState(false);

  // States for deleted pages
  const [recentlyDeletedPages, setRecentlyDeletedPages] = useState<any[]>([]);

  // States for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [landingPageToDelete, setLandingPageToDelete] = useState<string | null>(
    null
  );

  // States for URL shortening
  const [shortUrl, setShortUrl] = useState("");
  const [isShorteningUrl, setIsShorteningUrl] = useState(false);
  const [shortUrlError, setShortUrlError] = useState("");

  // State for template dialog
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // State for AI generator dialog
  const [AIGeneratorDialogOpen, setAIGeneratorDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchLandingPagesData();
  }, []);

  async function fetchLandingPagesData() {
    setIsLoading(true);
    try {
      // Get the current user first
      const { getCurrentUser } = await import("@/app/actions");
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        console.error("No authenticated user found");
        toast.error("Authentication required");
        router.push("/login");
        return;
      }

      // Fetch only this user's landing pages
      const response = await fetch(`/api/landings?user_id=${currentUser.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch landing pages");
      }

      const data = await response.json();
      console.log("User landing pages:", data);

      // Check if user has more than 10 landing pages
      if (data.length > totalPagesAllowed) {
        // Sort by creation date (oldest first for deletion purposes)
        const sortedPages = [...data].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // Identify pages to keep (first 10) and pages to delete (the rest)
        const pagesToKeep = sortedPages.slice(0, totalPagesAllowed);
        const pagesToDelete = sortedPages.slice(totalPagesAllowed);

        console.log(`Deleting ${pagesToDelete.length} excess landing pages`);

        // Delete excess pages
        await deleteExcessLandingPages(pagesToDelete);

        // Update state with only the kept pages (but sort newest first for display)
        const pagesForDisplay = [...pagesToKeep].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLandingPages(pagesForDisplay);

        // Store deleted pages in state
        setRecentlyDeletedPages(pagesToDelete);
        // Show more detailed toast
        toast.info(
          <div>
            <p>Excess landing pages were automatically removed:</p>
            <ul className="list-disc pl-5 mt-2">
              {pagesToDelete.map((page) => (
                <li key={page.id}>{page.title}</li>
              ))}
            </ul>
          </div>,
          { duration: 5000 }
        );
      } else {
        // Sort the landing pages by creation date (newest first)
        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setLandingPages(sortedData);
      }
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      setLandingPages([]);
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "description",
      label: "Description",
      render: (item: any) => item.description || "No description",
    },
    {
      key: "domain",
      label: "Domain",
      render: (item: any) => {
        if (!item.domain) return "No domain";

        return (
          <div>
            {item.domain.subdomain && <div>{item.domain.subdomain}</div>}
            {item.domain.custom && <div>{item.domain.custom}</div>}
            {item.domain.status && (
              <Badge
                variant={
                  item.domain.status === "verified" ? "success" : "secondary"
                }
              >
                {item.domain.status}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "isactive",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.isactive ? "default" : "secondary"}>
          {item.isactive ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "visits",
      label: "Visits",
      render: (item: any) => item.visits || 0,
    },
    {
      key: "created_at",
      label: "Created",
      render: (item: any) => formatDate(item.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="shadow-md rounded-lg bg-white"
          >
            <DropdownMenuItem onClick={() => handleShareLandingPage(item)}>
              <Share2 className="mr-2 h-4 w-4 text-gray-500" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/landing/edit?id=${item.id}`)
              }
            >
              <Pencil className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setPreviewContent(item);
                setPreviewDialogOpen(true);
              }}
            >
              <Eye className="mr-2 h-4 w-4 text-gray-500" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/landing/${item.id}`, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4 text-gray-500" />
              View Landing Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateLandingPage(item, false)}>
              <Copy className="mr-2 h-4 w-4 text-gray-500" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateLandingPage(item, true)}>
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Duplicate & Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleManageDomain(item)}>
              <Globe className="mr-2 h-4 w-4 text-gray-500" />
              Manage Domain
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(item.id)}
              className="text-red-500 hover:bg-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  async function deleteLandingPage(id: string) {
    try {
      const response = await fetch("/api/landings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete landing page");
      }
      setLandingPages((prevForms) =>
        prevForms.filter((form) => form.id !== id)
      );
      toast.success("Landing page deleted successfully");
    } catch (error) {
      console.error("Failed to delete landing page:", error);
      toast.error("Failed to delete landing page");
    } finally {
      setDeleteDialogOpen(false);
      setLandingPageToDelete(null);
    }
  }

  const handleShareLandingPage = (landingPage: any) => {
    const link = `${window.location.origin}/landing/${landingPage.id}`;
    setShareLink(link);
    setShareDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      // Use shortened URL if available, otherwise use the original link
      const textToCopy = shortUrl || shareLink;

      // Check if we're in a browser environment and clipboard API is available
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback method for copying text
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          setCopied(successful);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Fallback: Could not copy text", err);
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "landingpage-qrcode.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleManageDomain = async (landingPage: any) => {
    try {
      // Fetch the latest version of the landing page for domain management
      const response = await fetch(`/api/landings/${landingPage.id}`);
      if (!response.ok) {
        throw new Error("Failed to load landing page");
      }

      const completeData = await response.json();
      setSelectedLandingPage(completeData);
      setDomainDialogOpen(true);
    } catch (error) {
      console.error("Error loading landing page for domain management:", error);
      toast.error("Could not load domain settings");
    }
  };

  const handleSaveDomainSettings = async (updatedContent: any) => {
    try {
      // Make sure we have a selected landing page
      if (!selectedLandingPage) return;

      const response = await fetch("/api/landings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLandingPage.id,
          ...selectedLandingPage,
          domain: updatedContent.domain,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update domain settings");
      }

      // Update the landing pages list
      fetchLandingPagesData();

      // Close the dialog
      setDomainDialogOpen(false);
      toast.success("Domain settings updated successfully");
    } catch (error) {
      console.error("Error updating domain settings:", error);
      toast.error("Failed to update domain settings");
    }
  };

  const handleCreateLandingPage = (templateId?: string) => {
    if (usedPages >= totalPagesAllowed) {
      setLimitReachedDialogOpen(true);
      return;
    }

    // If under the limit, proceed to the create page with template parameter
    const templateParam = templateId ? `&template=${templateId}` : "";
    router.push(`/dashboard/landing/edit?id=new${templateParam}`);
  };

  const handleDeleteClick = (id: string) => {
    setLandingPageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const shortenUrl = async () => {
    setIsShorteningUrl(true);
    setShortUrlError("");

    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: shareLink }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setShortUrlError("Error shortening the link");
    } finally {
      setIsShorteningUrl(false);
    }
  };

  // New handler function for duplicating landing pages
  const duplicateLandingPage = async (
    landingPage: any,
    redirectToEdit: boolean = false
  ) => {
    // Check if user has reached their limit
    if (usedPages >= totalPagesAllowed) {
      setLimitReachedDialogOpen(true);
      return;
    }

    try {
      // Clone the landing page data and modify necessary fields
      const duplicatedLandingPage = {
        ...landingPage,
        title: `${landingPage.title}_copy`,
        id: undefined, // Remove ID so a new one is generated
        created_at: new Date().toISOString(), // Set current date as creation date
      };

      // Create the new landing page
      const response = await fetch("/api/landings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedLandingPage),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate landing page");
      }

      const newLandingPage = await response.json();

      // Instead of refetching all landing pages, just add the new one to the state
      setLandingPages((prevPages) => {
        // Add the new landing page and sort by created_at (newest first)
        const updatedPages = [newLandingPage, ...prevPages];
        return updatedPages.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      // Show success message
      toast.success("Landing page duplicated successfully");

      // If redirectToEdit is true, navigate to the edit page for the new landing page
      if (redirectToEdit) {
        router.push(`/dashboard/landing/edit?id=${newLandingPage.id}`);
      }
    } catch (error) {
      console.error("Error duplicating landing page:", error);
      toast.error("Failed to duplicate landing page");
    }
  };

  const handleGenerateAITemplate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);

    try {
      // Call our API endpoint instead of directly calling LM Studio
      const response = await fetch("/api/ai/landing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const landingPageData = await response.json();

      // Process images - add placeholder Unsplash images for empty image fields
      landingPageData.sections = await addImagePlaceholders(
        landingPageData.sections
      );

      // Redirect to editor with the generated template
      await createNewLandingPageFromAI(landingPageData);
    } catch (error) {
      console.error("Error generating AI template:", error);
      toast.error("Failed to generate template. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Add helper functions
  async function addImagePlaceholders(sections) {
    // For each section with an image property that's empty, add a placeholder image
    for (const section of sections) {
      if (section.content && section.content.image === "") {
        let query = "";

        // Generate appropriate image search term based on section content
        if (section.type === "hero") {
          query =
            section.content.heading?.split(" ").slice(0, 3).join(" ") ||
            "business";
        } else if (section.type === "content") {
          query =
            section.content.heading?.split(" ").slice(0, 2).join(" ") ||
            "office";
        }

        try {
          // Try Unsplash first
          const unsplashResponse = await fetch(
            `/api/unsplash/search?query=${encodeURIComponent(query)}&per_page=1`
          );
          if (unsplashResponse.ok) {
            const unsplashData = await unsplashResponse.json();
            if (unsplashData.results?.length > 0) {
              section.content.image = unsplashData.results[0].urls.regular;
              continue;
            }
          }

          // Fall back to Pexels if Unsplash fails
          const pexelsResponse = await fetch(
            `/api/pexels/search?query=${encodeURIComponent(query)}&per_page=1`
          );
          if (pexelsResponse.ok) {
            const pexelsData = await pexelsResponse.json();
            if (pexelsData.photos?.length > 0) {
              section.content.image = pexelsData.photos[0].src.large;
            }
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    }

    return sections;
  }

  async function createNewLandingPageFromAI(landingPageData) {
    try {
      // First, get the current user
      const { getCurrentUser } = await import("@/app/actions");
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        toast.error("User authentication required");
        router.push("/login");
        return;
      }

      // Create a complete landing page data object
      const completeData = {
        user_id: currentUser.id,
        title: landingPageData.title || "AI Generated Landing Page",
        description:
          landingPageData.description || "Created with AI assistance",
        sections: landingPageData.sections || [],
        styles: landingPageData.styles || {
          theme: "modern",
          fontFamily: "Inter",
          colors: {
            primary: "#7c3aed",
            background: "#ffffff",
            text: "#1f2937",
          },
        },
        domain: {
          subdomain: "",
          custom: "",
          status: "unverified",
        },
        isactive: false,
      };

      // Redirect to the editor with this data
      // We'll use localStorage to temporarily store the data
      localStorage.setItem(
        "aiGeneratedLandingPage",
        JSON.stringify(completeData)
      );

      // Close the dialog and redirect
      setAIGeneratorDialogOpen(false);
      router.push(`/dashboard/landing/edit?id=new&source=ai`);
    } catch (error) {
      console.error("Error creating landing page from AI:", error);
      toast.error("Failed to create landing page");
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between flex-shrink-0">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Landing Pages
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage your landing pages.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => fetchLandingPagesData()}
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCcw className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        className="bg-gray-800 text-white text-xs px-3 py-2"
                      >
                        <p>Reload landing pages</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-block">
                          <Button
                            onClick={handleCreateLandingPage}
                            disabled={usedPages >= totalPagesAllowed}
                            className={`bg-blue-600 hover:bg-blue-700 text-white shadow-md ${
                              usedPages >= totalPagesAllowed
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Landing Page
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {usedPages >= totalPagesAllowed && (
                        <TooltipContent
                          side="top"
                          align="center"
                          className="bg-gray-800 text-white text-xs px-3 py-2 z-[9999]"
                        >
                          <p>You've reached your limit of 10 landing pages</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={() => setTemplateDialogOpen(true)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800"
                  >
                    Templates
                  </Button>
                </div>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm rounded-lg p-2 w-36 h-12 flex flex-col justify-center cursor-help">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {usedPages}/{totalPagesAllowed}
                          </span>
                          {usedPages >= totalPagesAllowed && (
                            <span className="text-xs bg-red-100 text-red-600 font-medium px-1.5 py-0.5 rounded-full">
                              Limit
                            </span>
                          )}
                        </div>
                        <Progress
                          value={progressValue}
                          className={`w-full mt-1 h-2 bg-gray-200 dark:bg-gray-700 ${
                            usedPages >= totalPagesAllowed
                              ? "[&>div]:bg-red-500 dark:[&>div]:bg-red-600"
                              : "[&>div]:bg-blue-600 dark:[&>div]:bg-blue-500"
                          }`}
                        />
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="bg-gray-800 text-white text-xs px-3 py-2 max-w-xs"
                    >
                      <p>
                        You are using {usedPages} out of {totalPagesAllowed}{" "}
                        available landing pages on your current plan.{" "}
                        {usedPages >= totalPagesAllowed
                          ? "You've reached your limit."
                          : `You can create ${
                              totalPagesAllowed - usedPages
                            } more landing pages.`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Content Area: Loading or Landing Pages List */}
            <div>
              {isLoading ? (
                // --- Loading Indicator ---
                <div className="flex justify-center items-center h-64 pt-10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading landing pages...
                  </span>
                </div>
              ) : (
                // --- Landing Pages List ---
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm rounded-lg p-4 w-full">
                  <div>
                    {/* Using the forms DataTable component instead of the shared one */}
                    <DataTable
                      data={LandingPages || []}
                      columns={columns}
                      filters={filters}
                      itemsPerPage={5}
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Share Landing Page
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Use the link below to share the landing page or generate its QR
                code.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={shortUrl || shareLink}
                readOnly
                className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              />
              <Button
                onClick={handleCopy}
                size="icon"
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Copy
                  className={`h-4 w-4 ${
                    copied
                      ? "text-green-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            {shortUrlError && (
              <p className="text-sm text-red-500 mt-1">{shortUrlError}</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {showQRCode ? "Hide QR Code" : "Generate QR Code"}
                <QrCode className="ml-2 h-4 w-4" />
              </Button>

              <Button
                onClick={shortenUrl}
                disabled={isShorteningUrl || !!shortUrl}
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {isShorteningUrl ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : shortUrl ? (
                  <>
                    <Link2 className="mr-2 h-4 w-4 text-green-500" />
                    Shortened
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </div>
            {showQRCode && (
              <div className="mt-4 flex flex-col items-center">
                <div ref={qrCodeRef} className="bg-white p-2 rounded">
                  <QRCodeSVG
                    value={shortUrl || shareLink}
                    size={128}
                    level="Q"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Download QR Code
                </Button>
              </div>
            )}
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="mt-4 w-full dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Template Dialog */}
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800 max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="dark:text-gray-100">
                Choose a Template
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Start with a pre-built landing page template or create from
                scratch.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-1">
                {/* AI Generated Template - First position */}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 relative overflow-hidden border-2 border-primary"
                  onClick={() => setAIGeneratorDialogOpen(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-90" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-white" />
                      <CardTitle className="text-lg text-white">
                        Generate with AI
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/90">
                      Create a custom landing page with AI assistance
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Existing template mapping */}
                {landingTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
                      onClick={() => handleCreateLandingPage(template.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 dark:text-gray-300" />
                          <CardTitle className="text-lg dark:text-gray-200">
                            {template.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="dark:text-gray-400">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => router.push("/dashboard/landing/edit?id=new")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5 dark:text-gray-300" />
                      <CardTitle className="text-lg dark:text-gray-200">
                        Blank Page
                      </CardTitle>
                    </div>
                    <CardDescription className="dark:text-gray-400">
                      Start from scratch with a blank landing page
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
            <DialogClose asChild className="flex-shrink-0 mt-2">
              <Button
                variant="ghost"
                className="w-full dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800 max-w-5xl h-[95vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="dark:text-gray-100">
                Landing Page Preview
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Preview how your landing page will appear to visitors
              </DialogDescription>
            </DialogHeader>

            {/* Device Selection Controls */}
            <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 py-2 flex-shrink-0">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
                <Button
                  variant={previewDeviceMode === "mobile" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewDeviceMode("mobile")}
                  className="h-8 w-8"
                  aria-label="Mobile view"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDeviceMode === "tablet" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setPreviewDeviceMode("tablet")}
                  className="h-8 w-8"
                  aria-label="Tablet view"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={
                    previewDeviceMode === "desktop" ? "default" : "ghost"
                  }
                  size="icon"
                  onClick={() => setPreviewDeviceMode("desktop")}
                  className="h-8 w-8"
                  aria-label="Desktop view"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Responsive Preview Container */}
            <div className="flex-1 overflow-hidden flex justify-center mt-4">
              <div
                className={`h-full transition-all duration-300 overflow-y-auto border rounded-md ${
                  previewDeviceMode === "mobile"
                    ? "w-[375px] border-x shadow-md"
                    : previewDeviceMode === "tablet"
                    ? "w-[768px] border-x shadow-md"
                    : "w-full"
                }`}
              >
                {previewContent && <LandingPreview content={previewContent} />}
              </div>
            </div>

            {/* Button Row - Added Open Landing Page button next to Close */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() =>
                  previewContent &&
                  window.open(`/landing/${previewContent.id}`, "_blank")
                }
                disabled={!previewContent}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Landing Page
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        {/* Domain Management Dialog */}
        <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800 max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="dark:text-gray-100">
                Manage Domain Settings
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Configure the domain settings for your landing page
              </DialogDescription>
            </DialogHeader>
            {selectedLandingPage && (
              <div className="mt-4 overflow-y-auto flex-grow">
                <DomainSettings
                  content={selectedLandingPage}
                  setContent={(updatedContent) => {
                    setSelectedLandingPage(updatedContent);
                  }}
                />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4 flex-shrink-0">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => handleSaveDomainSettings(selectedLandingPage)}
                disabled={!selectedLandingPage}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Limit Reached Dialog */}
        <Dialog
          open={limitReachedDialogOpen}
          onOpenChange={setLimitReachedDialogOpen}
        >
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Landing Page Limit Reached
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                You have used all 10 free landing pages available on your
                current plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="dark:text-gray-300">
                To create more landing pages, you can:
              </p>
              <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
                <li>Delete existing landing pages you no longer need</li>
                <li>Upgrade to a premium plan for unlimited landing pages</li>
              </ul>
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="mt-4 w-full dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Are you sure you want to delete this landing page? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  landingPageToDelete && deleteLandingPage(landingPageToDelete)
                }
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Generator Dialog - New dialog for AI template generation */}
        <Dialog
          open={AIGeneratorDialogOpen}
          onOpenChange={setAIGeneratorDialogOpen}
        >
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Generate Landing Page with AI
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Describe your ideal landing page and our AI will create it for
                you
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="aiPrompt">Description</Label>
                <Textarea
                  id="aiPrompt"
                  placeholder="Describe what you want in your landing page. For example: 'Create a landing page for a fitness app with features like workout tracking, nutrition planning, and community support. Use bold colors and include testimonials.'"
                  className="min-h-[120px]"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAIGeneratorDialogOpen(false)}
                className="dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateAITemplate}
                disabled={!aiPrompt.trim() || isGenerating}
                className="relative"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AILoadingOverlay isVisible={isGenerating} />
      </div>
    </div>
  );
}

// Helper function for deleting excess landing pages
async function deleteExcessLandingPages(pagesToDelete: any[]) {
  try {
    // Delete each excess landing page one by one
    for (const page of pagesToDelete) {
      await fetch("/api/landings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: page.id }),
      });

      console.log(`Deleted excess landing page with ID: ${page.id}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting excess landing pages:", error);
    return false;
  }
}
