"use client";
import React from 'react';
import { X, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface HtmlCodeViewProps {
  html: string;
  onClose: () => void;
}

export default function HtmlCodeView({ html, onClose }: HtmlCodeViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    toast.success('HTML copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML downloaded successfully');
  };

  // Format HTML with proper indentation
  const formatHtml = (html: string) => {
    try {
      let formatted = '';
      let indent = '';
      
      html.split(/>\s*</).forEach(element => {
        if (element.match(/^\/\w/)) {
          // If this is a closing tag, decrease indent
          indent = indent.substring(2);
        }
        
        formatted += indent + '<' + element + '>\n';
        
        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img')) {
          // If this is not a self-closing tag, increase indent
          indent += '  ';
        }
      });
      
      return formatted.substring(1, formatted.length - 1);
    } catch (e) {
      console.error('Error formatting HTML:', e);
      return html;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">HTML Code</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="flex items-center"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </>
              )}
            </Button>
            {/* <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button> */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <pre className="text-sm font-mono bg-gray-100 p-4 rounded border overflow-auto whitespace-pre-wrap">
            {formatHtml(html)}
          </pre>
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <Button 
            variant="default"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}