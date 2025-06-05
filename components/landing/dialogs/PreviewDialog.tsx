import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LandingPreview } from "@/components/landing/landing-preview";
import { Smartphone, Tablet, Monitor, ExternalLink, Pencil, Share2, X } from "lucide-react";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
  onEdit: (id: string) => void;
  onShare: (landingPage: any) => void;
}

export function PreviewDialog({
  open,
  onOpenChange,
  content,
  onEdit,
  onShare,
}: PreviewDialogProps) {
  const [previewDeviceMode, setPreviewDeviceMode] = useState<"mobile" | "tablet" | "desktop">("desktop");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              variant={previewDeviceMode === "desktop" ? "default" : "ghost"}
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
            {content && <LandingPreview content={content} />}
          </div>
        </div>

        {/* Button Row */}
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => content && window.open(`/landing/${content.id}`, "_blank")}
            disabled={!content}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => content && onEdit(content.id)}
            disabled={!content}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => content && onShare(content)}
            disabled={!content}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <DialogClose asChild>
          <Button 
            variant="ghost" 
            className="absolute top-2 right-2 h-8 w-8 p-0 rounded-md"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}