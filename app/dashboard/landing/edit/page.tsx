"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { landingTemplates } from "@/components/landing/templates/landing-templates"; // Move this import up
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingEditor } from "@/components/landing/landing-editor";
import { LandingStyles } from "@/components/landing/landing-styles";
import { LandingPreview } from "@/components/landing/landing-preview";
import { DomainSettings } from "@/components/landing/domain-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Paintbrush,
  Globe,
  Save,
  Settings,
  Loader2,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";

export default function EditLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id") || "new";
  const templateId = searchParams.get("template");

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [landingPages, setLandingPages] = useState([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");
  const [isSaving, setIsSaving] = useState(false); // Add a new state for tracking save operation

  const [content, setContent] = useState({
    title: "Product Launch Landing Page",
    description: "Launch your product with our amazing landing page",
    sections: [
      {
        id: "1",
        type: "hero",
        content: {
          heading: "Launch Your Product",
          subheading: "The easiest way to showcase your product",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
          cta: { text: "Get Started", url: "#" },
        },
      },
      {
        id: "2",
        type: "features",
        content: {
          heading: "Features",
          items: [
            {
              title: "Feature 1",
              description: "Description of feature 1",
              icon: "Zap",
            },
            {
              title: "Feature 2",
              description: "Description of feature 2",
              icon: "Shield",
            },
          ],
        },
      },
    ],
    styles: {
      theme: "modern",
      fontFamily: "Inter",
      colors: {
        primary: "#7c3aed",
        background: "#ffffff",
        text: "#1f2937",
      },
      spacing: "comfortable",
      animation: "fade",
      borderRadius: "0.5",
      darkMode: false,
      responsiveImages: true,
    },
    domain: {
      custom: "",
      subdomain: "launch",
      status: "unverified",
    },
  });

  // Fetch current user and landing page data on component mount
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const userId = await fetchUser();

        // Only continue if component is still mounted
        if (!mounted) return;

        // If creating a new page, check the limit first
        if (pageId === "new") {
          const canCreate = await checkPageLimit();
          if (!canCreate && mounted) {
            toast.error(
              "You have reached your limit of 10 free landing pages."
            );
            router.push("/dashboard/landing");
            return;
          }
        }

        // If editing an existing page, fetch its data
        if (pageId !== "new") {
          await fetchLandingPage(pageId);
        }

        // If creating a new page with a template
        if (pageId === "new" && templateId) {
          // Find the template in landingTemplates
          const selectedTemplate = landingTemplates.find(
            (t) => t.id === templateId
          );
          if (selectedTemplate) {
            // Use the template data instead of default
            setContent(selectedTemplate.template);
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (mounted) {
          toast.error("Error loading page editor");
        }
      } finally {
        // Only update loading state if still mounted
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false; // Cleanup to prevent state updates after unmount
    };
  }, [pageId, templateId]);

  async function fetchUser() {
    try {
      const currentUser = await getCurrentUser();
      console.log("Current user:", currentUser); // Debug logging

      if (currentUser && currentUser.id) {
        setUserId(currentUser.id);
        return currentUser.id;
      } else {
        console.error("No user found or missing user ID");
        toast.error("User not authenticated");
        router.push("/login");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Authentication error");
      router.push("/login");
      return null;
    }
  }

  async function fetchLandingPage(id: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/landings/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch landing page");
      }

      const landingPage = await response.json();
      setContent(landingPage);
    } catch (error) {
      toast.error("Error loading landing page");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // // Update the fetchLandingPagesData function to only run when needed
  // // async function fetchLandingPagesData() {
  //   // Remove this function or only call it when actually needed
  //   // It's unnecessary to fetch all landing pages when editing a single page
  // //}

  // Add this function to check the page limit
  async function checkPageLimit() {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return false;

      const response = await fetch(`/api/landings?user_id=${currentUser.id}`);
      if (!response.ok) return false;

      const data = await response.json();
      return data.length < 10; // Return true if under the limit
    } catch (error) {
      console.error("Error checking page limit:", error);
      return false;
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true); // Use this instead of isLoading for save operations

      // Get user ID, either from state or by fetching it
      let userIdentifier = userId;
      if (!userIdentifier) {
        console.log("No userId in state, attempting to fetch user");
        userIdentifier = await fetchUser();
        if (!userIdentifier) {
          console.error("Could not obtain user ID");
          toast.error("Authentication required to save landing pages");
          return;
        }
      }

      console.log("Using user ID:", userIdentifier);

      const landingPageData = {
        user_id: userIdentifier,
        title: content.title || "Untitled Page",
        description: content.description,
        sections: content.sections,
        styles: content.styles,
        domain: content.domain,
        isactive: true, // Changed from isActive to isactive to match database schema
      };

      const url = `/api/landings`;
      const method = pageId === "new" ? "POST" : "PUT";
      const body =
        pageId === "new"
          ? JSON.stringify(landingPageData)
          : JSON.stringify({ id: pageId, ...landingPageData });

      console.log("Saving landing page with method:", method);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error response:", errorData);
        throw new Error(
          `Failed to save landing page: ${JSON.stringify(errorData)}`
        );
      }

      const savedPage = await response.json();
      console.log("Save successful:", savedPage);

      // If it was a new page, update the URL without full page reload
      if (pageId === "new") {
        router.replace(`/dashboard/landing/edit?id=${savedPage.id}`, {
          scroll: false,
        });
        // Update page ID in memory
        pageId = savedPage.id;
      }

      toast.success("Landing page saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving landing page");
    } finally {
      setIsSaving(false); // Reset saving state instead of loading state
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading Landing Page Builder...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Use h-screen instead of min-h-screen to ensure exact viewport height */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content container - must be flex-1 and overflow-hidden */}
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left panel - Editor */}
          <ResizablePanel
            defaultSizePercentage={40}
            minSizePercentage={38}
            maxSizePercentage={45}
            className="flex flex-col"
          >
            <Tabs defaultValue="editor" className="flex flex-col h-full">
              {/* Header stays fixed */}
              <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                <div className="container flex h-14 items-center">
                  {/* Grid layout stays the same */}
                  <div className="grid grid-cols-3 w-full items-center">
                    <div className="flex justify-start">
                      {/* Left content */}
                    </div>
                    <div className="flex justify-center">
                      <TabsList>
                        {/* TabsTriggers remain the same */}
                        <TabsTrigger
                          value="editor"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Editor
                        </TabsTrigger>
                        <TabsTrigger
                          value="styles"
                          className="flex items-center gap-2"
                        >
                          <Paintbrush className="h-4 w-4" />
                          Styles
                        </TabsTrigger>
                        <TabsTrigger
                          value="domain"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Domain
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <div className="flex justify-end gap-2">
                      {/* Action buttons remain the same */}
                      <Button
                        variant="outline"
                        onClick={() => setShowExitDialog(true)}
                        disabled={isSaving}
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-1"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Each tab content gets its own scrollable area */}
              <TabsContent
                value="editor"
                className="flex-1 overflow-hidden" // Use flex-1 instead of flex-grow
              >
                <div className="h-full overflow-y-auto">
                  <LandingEditor content={content} setContent={setContent} />
                </div>
              </TabsContent>
              <TabsContent
                value="styles"
                className="flex-1 overflow-hidden" // Use flex-1 instead of flex-grow
              >
                <div className="h-full overflow-y-auto">
                  <LandingStyles content={content} setContent={setContent} />
                </div>
              </TabsContent>
              <TabsContent
                value="domain"
                className="flex-1 overflow-hidden" // Use flex-1 instead of flex-grow
              >
                <div className="h-full overflow-y-auto">
                  <DomainSettings content={content} setContent={setContent} />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right panel - Preview */}
          <ResizablePanel
            defaultSizePercentage={60}
            minSizePercentage={50}
            maxSizePercentage={70}
            className="flex flex-col"
          >
            <div className="h-full flex flex-col">
              {/* Preview control header stays fixed */}
              <div className="flex justify-center border-b p-2 flex-shrink-0">
                <div className="flex bg-gray-100 p-1 rounded-md">
                  <Button
                    variant={previewMode === "mobile" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setPreviewMode("mobile")}
                    className="h-8 w-8"
                    aria-label="Mobile view"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === "tablet" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setPreviewMode("tablet")}
                    className="h-8 w-8"
                    aria-label="Tablet view"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === "desktop" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setPreviewMode("desktop")}
                    className="h-8 w-8"
                    aria-label="Desktop view"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Preview content area gets its own scrollbar */}
              <div className="flex-1 overflow-hidden flex justify-center">
                <div
                  className={`h-full transition-all duration-300 overflow-y-auto ${
                    previewMode === "mobile"
                      ? "w-[375px] border-x shadow-md"
                      : previewMode === "tablet"
                      ? "w-[768px] border-x shadow-md"
                      : "w-full"
                  }`}
                >
                  <LandingPreview content={content} />
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Exit confirmation dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Editor</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit? Any unsaved changes will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => router.push("/dashboard/landing")}
            >
              Exit Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
