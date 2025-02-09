"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LandingEditor } from "@/components/landing/landing-editor";
import { LandingStyles } from "@/components/landing/landing-styles";
import { LandingPreview } from "@/components/landing/landing-preview";
import { DomainSettings } from "@/components/landing/domain-settings";
import { Paintbrush, Settings, Save, Globe } from "lucide-react";
import { toast } from "sonner";

export default function EditLandingPage() {
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
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
          cta: {
            text: "Get Started",
            url: "#"
          }
        }
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
              icon: "Zap"
            },
            {
              title: "Feature 2",
              description: "Description of feature 2",
              icon: "Shield"
            }
          ]
        }
      }
    ],
    styles: {
      theme: "modern",
      fontFamily: "Inter",
      colors: {
        primary: "#7c3aed",
        background: "#ffffff",
        text: "#1f2937"
      },
      spacing: "comfortable",
      animation: "fade"
    },
    domain: {
      custom: "",
      subdomain: "launch",
      status: "unverified"
    }
  });

  const handleSave = () => {
    toast.success("Landing page saved successfully!");
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={30}>
          <Tabs defaultValue="editor">
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <TabsList>
                  <TabsTrigger value="editor" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="styles" className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Styles
                  </TabsTrigger>
                  <TabsTrigger value="domain" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Domain
                  </TabsTrigger>
                </TabsList>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Page
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