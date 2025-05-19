"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Paintbrush, Settings, Save, Globe } from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/app/actions";

export default function EditLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("id") || "new";
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [landingPages, setLandingPages] = useState([]);

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
    async function initialize() {
      await fetchUser();

      // If creating a new page, check the limit first
      if (pageId === "new") {
        const canCreate = await checkPageLimit();
        if (!canCreate) {
          toast.error("You have reached your limit of 10 free landing pages.");
          router.push("/dashboard/landing");
          return;
        }
      }

      // If editing an existing page, fetch its data
      if (pageId !== "new") {
        fetchLandingPage(pageId);
      }

      // Fetch landing pages data for the user
      fetchLandingPagesData();
    }

    initialize();
  }, [pageId]);

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

  async function fetchLandingPagesData() {
    try {
      // Get the current user first
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.error("No authenticated user found");
        return;
      }

      // Fetch only this user's landing pages
      const response = await fetch(`/api/landings?user_id=${currentUser.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch landing pages");
      }

      const data = await response.json();
      setLandingPages(data);
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      setLandingPages([]);
    }
  }

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
      setIsLoading(true);

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

      // If it was a new page, redirect to edit with the new ID
      if (pageId === "new") {
        router.push(`/dashboard/landing/edit?id=${savedPage.id}`);
      }

      toast.success("Landing page saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving landing page");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={30}>
          <Tabs defaultValue="editor">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <TabsList>
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
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Page"}
                </Button>
              </div>
            </div>
            <TabsContent value="editor" className="h-[calc(100vh-8rem)]">
              <LandingEditor content={content} setContent={setContent} />
            </TabsContent>
            <TabsContent value="styles" className="h-[calc(100vh-8rem)]">
              <LandingStyles content={content} setContent={setContent} />
            </TabsContent>
            <TabsContent value="domain" className="h-[calc(100vh-8rem)]">
              <DomainSettings content={content} setContent={setContent} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <LandingPreview content={content} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
