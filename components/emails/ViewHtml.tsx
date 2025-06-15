"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Changed from @radix-ui/themes
import { Copy, Download, X } from "lucide-react"; // Added icons for better UX

type ViewHtmlProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
};

export default function ViewHtml({ open, onOpenChange, html }: ViewHtmlProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied" state after 2 seconds
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email-template.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format HTML for better readability
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Email HTML</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] bg-gray-100 rounded p-4 border">
          <pre className="text-xs whitespace-pre-wrap font-mono">{formatHtml(html)}</pre>
        </div>
        <DialogFooter className="flex gap-2 mt-4">
          <Button 
            onClick={handleCopy} 
            variant="outline"
            className="flex items-center gap-1"
          >
            {copied ? (
              <>
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy HTML
              </>
            )}
          </Button>
          <Button 
            onClick={handleDownload} 
            variant="default"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" className="flex items-center gap-1">
              <X className="h-4 w-4" />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}