"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import EditorHeader from "@/components/emails/EditorHeader";
import Canvas from "@/components/emails/Canvas";
import ElementsSidebar from "@/components/emails/ElementsSidebar";
import PropertiesSidebar from "@/components/emails/PropertiesSidebar";
import HtmlCodeView from "@/components/emails/HtmlCodeView";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ScreenSizeProvider } from "@/app/ScreenSizeContext";
import { DragDropLayoutElementProvider } from "@/components/context/DragDropLayoutElement";
import { EmailTemplateProvider } from "@/components/emails/EmailTemplateContext";
import { SelectedElementProvider } from "@/app/SelectedElementContext";

export default function Editor() {
  const [viewHTMLCode, setViewHTMLCode] = useState(false);
  const [title, setTitle] = useState("Untitled Email");
  const [template, setTemplate] = useState<any>(null);
  const [extractedHtml, setExtractedHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const { id } = params;
  
  // Fetch template on initial load
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        // If it's a new template, we don't need to fetch anything
        if (id === "new") {
          setTemplate({});
          setInitialLoad(false);
          return;
        }
        
        const response = await fetch(`/api/emails/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Template not found");
            router.push("/dashboard/emails");
            return;
          }
          
          throw new Error("Failed to fetch template");
        }
        
        const data = await response.json();
        setTitle(data.title);
        setTemplate(data.content);
        setInitialLoad(false);
      } catch (error: any) {
        console.error("Error fetching template:", error);
        toast.error(`Failed to load template: ${error.message}`);
      }
    };
    
    fetchTemplate();
  }, [id, router]);
  
  // Handle saving the template
  const handleSave = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save templates");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/emails/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: template,
          html: extractedHtml,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error("You are not authorized to save this template");
          return;
        }
        throw new Error('Failed to save template');
      }
      
      const data = await response.json();
      toast.success("Template saved successfully!");
      
      // If we were creating a new template, redirect to the edit page for the new template
      if (id === "new") {
        router.push(`/dashboard/emails/editor/${data.id}`);
      }
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error(`Failed to save template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Title input for the template
  const renderTitleInput = () => (
    <div className="px-4 py-2 mb-2 bg-white border-b">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter template title"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  // If initial load is in progress, show loading indicator
  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading email template...</p>
        </div>
      </div>
    );
  }

  return (
    <ScreenSizeProvider>
      <DragDropLayoutElementProvider>
        <EmailTemplateProvider>
          <SelectedElementProvider>
            <div className="flex flex-col h-screen">
              <EditorHeader 
                viewHTMLCode={(show) => setViewHTMLCode(show)} 
                onSave={handleSave}
                isSaving={loading}
              />
              {renderTitleInput()}
              
              <div className="flex flex-1 overflow-hidden">
                <ElementsSidebar />
                
                <div className="flex-1 overflow-auto bg-gray-100">
                  <Canvas 
                    viewHTMLCode={viewHTMLCode} 
                    onHtmlExtracted={setExtractedHtml}
                    template={template}
                    setTemplate={setTemplate}
                  />
                </div>
                
                <PropertiesSidebar />
              </div>
              
              {viewHTMLCode && (
                <HtmlCodeView 
                  html={extractedHtml} 
                  onClose={() => setViewHTMLCode(false)} 
                />
              )}
            </div>
          </SelectedElementProvider>
        </EmailTemplateProvider>
      </DragDropLayoutElementProvider>
    </ScreenSizeProvider>
  );
}
