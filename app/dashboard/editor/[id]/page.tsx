"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Canvas from '@/components/emails/Canvas';
import EditorHeader from '@/components/emails/EditorHeader';
import ElementsSidebar from '@/components/emails/ElementsSidebar';
import Settings from '@/components/emails/Settings';
import Provider from "@/app/provider";
import ViewHtml from '@/components/emails/ViewHtml';
import { supabase } from "@/lib/supabaseClient";
import AuthDebug from "@/components/debug/AuthDebug";

export default function Editor() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [viewHTMLCode, setViewHTMLCode] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [template, setTemplate] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Remove the auth check and redirects for now
  useEffect(() => {
    // Skip authentication for development
    loadTemplateIfNeeded(id as string);
    setInitialLoad(false);
  }, [id]);

  // Load template function
  const loadTemplateIfNeeded = async (templateId: string) => {
    // Only fetch if we're editing (id is not "new")
    if (templateId && templateId !== "new") {
      try {
        const response = await fetch(`/api/emails/${templateId}`);
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in?redirect=/dashboard/emails/editor/" + templateId);
            return;
          }
          throw new Error('Failed to load template');
        }
        
        const result = await response.json();
        
        if (result.data) {
          setTitle(result.data.title || "");
          setTemplate(result.data.content);
          
          // Initialize email template context
          localStorage.setItem("emailTemplate", JSON.stringify(result.data.content));
        }
      } catch (error) {
        console.error("Error loading template:", error);
        alert("Failed to load template. Please try again.");
      }
    }
    setInitialLoad(false);
  };

  // Save handler - API based
  const handleSave = async () => {
    if (!template) {
      alert("Please add content to your template before saving.");
      return;
    }
    
    setLoading(true);
    
    try {
      const endpoint = id && id !== "new" 
        ? `/api/emails/${id}` 
        : '/api/emails';
        
      const method = id && id !== "new" ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || "Untitled",
          content: template
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/sign-in?redirect=/dashboard/emails/editor/" + (id || "new"));
          return;
        }
        throw new Error('Failed to save template');
      }
      
      alert("Template saved successfully!");
      router.push("/dashboard/emails");
    } catch (error: any) {
      console.error("Error saving template:", error);
      alert(`Failed to save template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Title input for the template
  const renderTitleInput = () => (
    <div className="px-4 py-2 mb-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter template title"
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
    </div>
  );

  return (
    <Provider>
      <EditorHeader viewHTMLCode={setViewHTMLCode} onSave={handleSave} />
      <AuthDebug /> {/* Add this for debugging */}
      {!initialLoad && (
        <div className='grid grid-cols-5'>
          <ElementsSidebar />
          <div className='col-span-3 bg-offwhite'>
            {renderTitleInput()}
            <Canvas
              viewHTMLCode={viewHTMLCode}
              onHtmlExtracted={setHtmlContent}
              setTemplate={setTemplate}
              template={template}
            />
          </div>
          <Settings />
        </div>
      )}
      <ViewHtml
        open={viewHTMLCode}
        onOpenChange={setViewHTMLCode}
        html={htmlContent}
      />
    </Provider>
  );
}
