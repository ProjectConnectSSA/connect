"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useEmailTemplateContext } from './EmailTemplateContext';
import { useDragElementLayout } from '../context/DragDropLayoutElement';
import ColumnLayout from '../LayoutElements/ColumnLayout';
import { useScreenSize } from '@/app/provider';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

// Add props for template handling
interface CanvasProps {
  viewHTMLCode: boolean;
  onHtmlExtracted: (html: string) => void;
  template?: any;
  setTemplate: (template: any) => void;
}

export default function Canvas({ viewHTMLCode, onHtmlExtracted, template, setTemplate }: CanvasProps) {
  const htmlRef = useRef<HTMLDivElement>(null);
  const { screenSize } = useScreenSize();
  const { dragDropLayoutElement } = useDragElementLayout();
  const { emailTemplate, setEmailTemplate } = useEmailTemplateContext();
  const [dragOver, setDragOver] = useState(false);
  // Flag to prevent infinite update loops
  const [isInitialSync, setIsInitialSync] = useState(true);
  // Track if we're currently showing controls (for HTML extraction)
  const [showControls, setShowControls] = useState(true);

  // Initialize email template from props if provided - only run once on initial load
  useEffect(() => {
    if (template && isInitialSync) {
      setEmailTemplate(template.layouts || []);
      setIsInitialSync(false);
    }
  }, [template, setEmailTemplate, isInitialSync]);

  // Sync emailTemplate back to parent component, but only when user makes changes
  // Use a ref to track the previous emailTemplate value to avoid unnecessary updates
  const prevEmailTemplateRef = useRef(emailTemplate);
  
  useEffect(() => {
    // Skip the first render and skip if templates are the same
    if (!isInitialSync && 
        JSON.stringify(prevEmailTemplateRef.current) !== JSON.stringify(emailTemplate)) {
      prevEmailTemplateRef.current = emailTemplate;
      setTemplate({
        layouts: emailTemplate
      });
    }
  }, [emailTemplate, setTemplate, isInitialSync]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    if (dragDropLayoutElement?.dragLayout) {
      setEmailTemplate((prevItems: any[]) => [
        ...prevItems,
        {
          id: `${Date.now()}`,
          type: dragDropLayoutElement.dragLayout.type,
          numOfCol: dragDropLayoutElement.dragLayout.numOfCol,
        },
      ]);
    }
  };

  // Move layout up
  const moveLayoutUp = (idx: number) => {
    if (idx === 0) return;
    setEmailTemplate((prevItems: any[]) => {
      const newItems = [...prevItems];
      [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
      return newItems;
    });
  };

  // Move layout down
  const moveLayoutDown = (idx: number) => {
    if (idx === emailTemplate.length - 1) return;
    setEmailTemplate((prevItems: any[]) => {
      const newItems = [...prevItems];
      [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
      return newItems;
    });
  };

  // Delete layout
  const deleteLayout = (idx: number) => {
    setEmailTemplate((prevItems: any[]) =>
      prevItems.filter((_, index) => index !== idx)
    );
  };

  const getlayoutComponent = (layout: { type?: string; numOfCol?: number; id?: string }, layoutIdx: number) => {
    if (layout?.type === 'column' && layout?.numOfCol && layout?.id) {
      return (
        <div key={layout.id} className="relative group">
          <ColumnLayout
            numOfCol={layout.numOfCol}
            id={layout.id}
            layoutIndex={layoutIdx}
          />
          {showControls && (
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 editor-controls">
              <button
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => moveLayoutUp(layoutIdx)}
                disabled={layoutIdx === 0}
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => moveLayoutDown(layoutIdx)}
                disabled={layoutIdx === emailTemplate.length - 1}
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
              <button
                className="p-1 bg-red-100 rounded hover:bg-red-200"
                onClick={() => deleteLayout(layoutIdx)}
                title="Delete Layout"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Extract HTML for export or viewing
  useEffect(() => {
    if (viewHTMLCode && htmlRef.current) {
      // Temporarily hide controls before extracting HTML
      setShowControls(false);
      
      // Use setTimeout to ensure the DOM has updated before extracting HTML
      setTimeout(() => {
        if (htmlRef.current) {
          // Get a clean copy of the HTML without editor UI elements
          const cleanHtml = htmlRef.current.innerHTML;
          onHtmlExtracted(cleanHtml);
          
          // Restore controls after extraction
          setShowControls(true);
        }
      }, 0);
    }
  }, [viewHTMLCode, onHtmlExtracted]);

  return (
    <div
      className={`mx-auto p-8 bg-gray-100 min-h-screen overflow-auto ${
        screenSize === 'mobile' ? 'max-w-[400px]' : 'max-w-[800px]'
      }`}
    >
      <div
        ref={htmlRef}
        className={`mx-auto bg-white shadow-md transition-all duration-300 ${
          screenSize === 'mobile' ? 'w-[375px]' : 'w-[600px]'
        } ${dragOver ? 'border-2 border-dashed border-blue-500 bg-blue-50' : ''}`}
        style={{ minHeight: '200px' }}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {emailTemplate?.map((layout: { type?: string; numOfCol?: number; id?: string; }, index: number) =>
          getlayoutComponent(layout, index)
        )}
        {!emailTemplate?.length && (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <div className="text-lg mb-2">Drag and drop layouts here</div>
            <div className="text-sm">Start building your email by adding layouts</div>
          </div>
        )}
      </div>
    </div>
  );
}
