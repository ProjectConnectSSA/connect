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
  X, // Add this import for the close button
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
import { Calendar } from "lucide-react";

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

  // Add this state variable near the top with other states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsContent, setDetailsContent] = useState<any>(null);

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

            {/* Add this new dropdown item */}
            <DropdownMenuItem
              onClick={() => {
                setDetailsContent(item);
                setDetailsDialogOpen(true);
              }}
            >
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              View Details
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

    // Close both dialogs first, then show loading overlay
    setAIGeneratorDialogOpen(false);
    setTemplateDialogOpen(false); // Add this line to ensure templates dialog is closed too

    // Short delay to allow dialog animation to complete
    setTimeout(() => {
      setIsGenerating(true);

      // Move the API call inside the timeout to ensure overlay is visible
      generateTemplate();
    }, 300);
  };

  // Helper function to perform the actual API call
  const generateTemplate = async () => {
    try {
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
      landingPageData.sections = await addImagePlaceholders(
        landingPageData.sections
      );
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

  // Helper function: format detail date with ordinal suffix
  const formatDetailDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Format as "6th Feb, 2025"
    return `${day}${suffix(day)} ${date.toLocaleString("en-US", {
      month: "short",
    })}, ${date.getFullYear()}`;
  };

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
          <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800">
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
          <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-3xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Choose a Template
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Start with a pre-built landing page template or create from
                scratch.
              </DialogDescription>
            </DialogHeader>

            {/* Add pt-4, pr-4, and pl-4 */}
            <div className="flex-1 overflow-y-auto pt-8 pr-4 pl-4 pb-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-1">
                {/* AI Generated Template - First position */}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 relative overflow-hidden border-2 border-primary shadow-lg"
                  onClick={() => {
                    setTemplateDialogOpen(false); // Close the templates dialog first
                    setAIGeneratorDialogOpen(true); // Then open the AI generator dialog
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-90" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-white animate-pulse" />
                      <CardTitle className="text-lg text-white animate-pulse">
                        Generate with AI
                      </CardTitle>
                    </div>
                    <CardDescription className="text-white/90">
                      Create using our AI assistance
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Blank Page - Second position */}
                <Card
                  className="cursor-pointer transition-all hover:scale-105 dark:bg-gray-800 dark:border-gray-700 shadow-lg"
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

                {/* Existing template mapping - Now comes after blank page */}
                {landingTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all hover:scale-105 dark:bg-gray-800 dark:border-gray-700 shadow-lg"
                      onClick={() => handleCreateLandingPage(template.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className={template.iconColor} />
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
          <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-5xl h-[95vh] flex flex-col">
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

            {/* Button Row - Updated to center and make buttons smaller */}
            <div className="mt-4 flex justify-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() =>
                  previewContent &&
                  window.open(`/landing/${previewContent.id}`, "_blank")
                }
                disabled={!previewContent}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() =>
                  previewContent &&
                  router.push(`/dashboard/landing/edit?id=${previewContent.id}`)
                }
                disabled={!previewContent}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => {
                  if (previewContent) {
                    setShareLink(
                      `${window.location.origin}/landing/${previewContent.id}`
                    );
                    setShareDialogOpen(true);
                  }
                }}
                disabled={!previewContent}
              >
                <Share2 className="h-4 w-4" />
              </Button>

              <DialogClose asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        {/* Domain Management Dialog */}
        <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
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

        {/* AI Generator Dialog - Enhanced magical version */}
        <Dialog
          open={AIGeneratorDialogOpen}
          onOpenChange={setAIGeneratorDialogOpen}
        >
          <DialogContent className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-indigo-950/90 dark:via-violet-900/80 dark:to-fuchsia-900/70 border border-purple-200 dark:border-purple-800 shadow-xl overflow-hidden rounded-xl max-w-3xl">
            {/* Magic sparkles background */}
            <div className="absolute inset-0 bg-[url('/landing/magic-bg.svg')] bg-repeat opacity-20 dark:opacity-10"></div>

            {/* Animated gradient border */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-300 to-blue-300 dark:from-violet-600 dark:via-fuchsia-500 dark:to-blue-500 opacity-50 dark:opacity-40 animate-pulse"
              style={{ filter: "blur(50px)" }}
            ></div>

            {/* GIF decoration */}
            <div className="absolute -right-8 top-6 w-36 h-36 md:w-48 md:h-48 opacity-90 pointer-events-none">
              <img
                src="/landing/Ninjacookiegachaanimation.gif"
                alt="AI Magic Assistant"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="relative z-10">
              <DialogHeader className="pb-0">
                <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                  ✨ Create Landing Page Magic
                </DialogTitle>
                <DialogDescription className="text-purple-700 dark:text-purple-300 text-base mt-1">
                  Share your vision, and watch as AI transforms it into a
                  stunning landing page
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="aiPrompt"
                    className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2"
                  >
                    <div className="relative">
                      <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                      <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-ping"></span>
                    </div>
                    Tell me what to create
                  </Label>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-300 via-fuchsia-200 to-blue-300 dark:from-violet-600 dark:via-fuchsia-500 dark:to-blue-500 rounded-md -m-0.5 group-focus-within:opacity-100 opacity-70 transition-opacity"></div>
                    <div
                      id="sparkle-container"
                      className="absolute inset-0 pointer-events-none"
                    ></div>

                    <Textarea
                      id="aiPrompt"
                      placeholder="Describe your dream landing page... (e.g. 'A modern SaaS landing page with pricing tiers, customer testimonials, and a sleek hero section with gradient background')"
                      className="min-h-[150px] resize-none bg-white dark:bg-gray-900 border-0 relative text-purple-900 dark:text-purple-50 placeholder:text-purple-400 dark:placeholder:text-purple-500 transition-colors"
                      value={aiPrompt}
                      onChange={(e) => {
                        setAiPrompt(e.target.value);
                        // Create sparkle effect on typing
                        const sparkleContainer =
                          document.getElementById("sparkle-container");
                        if (
                          sparkleContainer &&
                          e.target.value.length > aiPrompt.length
                        ) {
                          const sparkle = document.createElement("div");
                          const size = Math.random() * 10 + 5;
                          sparkle.className =
                            "absolute rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-80 animate-magic-float";
                          sparkle.style.width = `${size}px`;
                          sparkle.style.height = `${size}px`;
                          sparkle.style.filter = "blur(1px)";
                          sparkle.style.left = `${Math.random() * 100}%`;
                          sparkle.style.top = `${Math.random() * 100}%`;
                          sparkleContainer.appendChild(sparkle);
                          setTimeout(() => sparkle.remove(), 2000);
                        }
                      }}
                      style={{
                        backgroundImage:
                          aiPrompt.length > 10
                            ? "linear-gradient(to right, rgba(255,255,255,0.95), rgba(238,242,255,0.95))"
                            : "",
                        transition: "background-image 1s ease",
                      }}
                    />
                  </div>

                  {/* AI prompt suggestions */}
                  {aiPrompt.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
                      <span
                        onClick={() =>
                          setAiPrompt(
                            aiPrompt +
                              " Include customer testimonials and reviews."
                          )
                        }
                        className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 rounded-full px-3 py-1 cursor-pointer hover:shadow-md transition-all"
                      >
                        + Add testimonials
                      </span>
                      <span
                        onClick={() =>
                          setAiPrompt(
                            aiPrompt +
                              " Feature a pricing section with multiple tiers."
                          )
                        }
                        className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 rounded-full px-3 py-1 cursor-pointer hover:shadow-md transition-all"
                      >
                        + Add pricing
                      </span>
                      <span
                        onClick={() =>
                          setAiPrompt(
                            aiPrompt +
                              " Include a contact form for user inquiries."
                          )
                        }
                        className="text-xs bg-gradient-to-r from-pink-100 to-blue-100 dark:from-pink-900 dark:to-blue-900 border border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 rounded-full px-3 py-1 cursor-pointer hover:shadow-md transition-all"
                      >
                        + Add contact form
                      </span>
                    </div>
                  )}
                </div>

                {/* AI usage tips */}
                <div className="bg-white/60 dark:bg-gray-800/40 rounded-lg p-3 mt-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    <span className="font-medium">✨ Magic Tips:</span> Be
                    specific about colors, features, and the overall mood. The
                    more details you provide, the more magical your landing page
                    will be!
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAIGeneratorDialogOpen(false)}
                  className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  Maybe Later
                </Button>

                {/* Magical generate button */}
                <Button
                  onClick={handleGenerateAITemplate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(to right, #8b5cf6, #ec4899)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Animated background effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 animate-gradient-x"></span>

                  {/* Button content */}
                  <span className="relative flex items-center">
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Crafting Magic...
                      </>
                    ) : (
                      <>
                        <span className="relative mr-2">
                          <Sparkles className="h-4 w-4" />
                          <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                        </span>
                        Create Magic
                      </>
                    )}
                  </span>

                  {/* Hover effect */}
                  <span className="absolute -inset-x-2 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Landing Page Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-3xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">
                Landing Page Details
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                View detailed information about your landing page
              </DialogDescription>
            </DialogHeader>

            {detailsContent && (
              <div className="flex-1 overflow-y-auto mt-4 pr-2">
                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
                      {detailsContent.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {detailsContent.description || "No description provided"}
                    </p>
                  </div>

                  {/* Status & Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex items-center space-x-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Visits
                        </p>
                        <p className="font-medium dark:text-gray-200">
                          {detailsContent.visits || 0}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex items-center space-x-3">
                      <div
                        className={`p-2 rounded ${
                          detailsContent.isactive
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full ${
                            detailsContent.isactive
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <p
                          className={`font-medium ${
                            detailsContent.isactive
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {detailsContent.isactive ? "Published" : "Draft"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex items-center space-x-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created
                        </p>
                        <p className="font-medium dark:text-gray-200">
                          {formatDetailDate(detailsContent.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Updated Date */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h3 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Last Updated
                    </h3>
                    <p className="font-medium dark:text-gray-200">
                      {formatDetailDate(detailsContent.updated_at)}
                    </p>
                  </div>

                  {/* Domain Information */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h3 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Domain Information
                    </h3>

                    {detailsContent.domain ? (
                      <div className="space-y-3">
                        {detailsContent.domain.subdomain && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                              Subdomain:
                            </span>
                            <span className="font-medium dark:text-gray-200">
                              {detailsContent.domain.subdomain}
                            </span>
                          </div>
                        )}

                        {detailsContent.domain.custom && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                              Custom Domain:
                            </span>
                            <span className="font-medium dark:text-gray-200">
                              {detailsContent.domain.custom}
                            </span>
                          </div>
                        )}

                        {detailsContent.domain.status && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                              Status:
                            </span>
                            <Badge
                              variant={
                                detailsContent.domain.status === "verified"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {detailsContent.domain.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No domain configuration
                      </p>
                    )}
                  </div>

                  {/* Sections */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    <h3 className="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Sections
                    </h3>

                    {detailsContent.sections &&
                    detailsContent.sections.length > 0 ? (
                      <ul className="space-y-2">
                        {detailsContent.sections.map(
                          (section: any, i: number) => (
                            <li
                              key={i}
                              className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                            >
                              <span className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full mr-3 text-sm font-medium">
                                {i + 1}
                              </span>
                              <div>
                                <p className="font-medium dark:text-gray-200 capitalize">
                                  {section.type}
                                </p>
                                {section.content && section.content.heading && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {section.content.heading}
                                  </p>
                                )}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No sections available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setDetailsDialogOpen(false);
                  setPreviewContent(detailsContent);
                  setPreviewDialogOpen(true);
                }}
                className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(`/landing/${detailsContent?.id}`, "_blank")
                  }
                  disabled={!detailsContent}
                  className="dark:border-gray-700 dark:text-gray-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">
                    View Live
                  </span>
                </Button>

                <Button
                  onClick={() => {
                    if (detailsContent)
                      router.push(
                        `/dashboard/landing/edit?id=${detailsContent.id}`
                      );
                  }}
                  disabled={!detailsContent}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">Edit</span>
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
            </div>
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

<style jsx global>{`
  @keyframes magic-float {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-30px) scale(0);
      opacity: 0;
    }
  }

  @keyframes gradient-x {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-magic-float {
    animation: magic-float 2s ease-out forwards;
  }

  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease forwards;
  }
`}</style>;
