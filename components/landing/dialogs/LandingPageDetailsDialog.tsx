import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Pencil,
  ExternalLink,
  Calendar,
  BarChart,
  Clock,
  Globe,
  Tag,
  Layout,
  Link,
  Share2,
  Palette,
} from "lucide-react";
import { useState } from "react";

interface LandingPageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
  onPreview: (content: any) => void;
  onEdit: (id: string) => void;
}

export function LandingPageDetailsDialog({
  open,
  onOpenChange,
  content,
  onPreview,
  onEdit,
}: LandingPageDetailsDialogProps) {
  const [copied, setCopied] = useState(false);

  // Helper function: format detail date with ordinal suffix
  const formatDetailDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = (day: number) => {
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

  const copyShareLink = async () => {
    if (!content) return;

    const link = `${window.location.origin}/landing/${content.id}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent border dark:border-gray-800 max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            Landing Page Details
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            View detailed information about your landing page
          </DialogDescription>
        </DialogHeader>

        {content && (
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <h3 className="text-lg font-medium dark:text-gray-100 mb-2">
                  {content.title || "Untitled Landing Page"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {content.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge
                    variant={content.isactive ? "default" : "secondary"}
                    className="dark:border-gray-600"
                  >
                    {content.isactive ? "Published" : "Draft"}
                  </Badge>
                  {/* Show visits if available */}
                  {content.visits !== undefined && (
                    <Badge variant="outline" className="dark:border-gray-600">
                      {content.visits} visits
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" />
                    Dates
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Created:
                      </span>
                      <span className="dark:text-gray-300">
                        {formatDetailDate(content.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Last updated:
                      </span>
                      <span className="dark:text-gray-300">
                        {formatDetailDate(content.updated_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span className="dark:text-gray-300">
                        {content.isactive ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-3">
                    <BarChart className="h-4 w-4" />
                    Performance
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total visits:
                      </span>
                      <span className="dark:text-gray-300">
                        {content.visits || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Conversion rate:
                      </span>
                      <span className="dark:text-gray-300">
                        {content.conversion_rate || "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Avg. time on page:
                      </span>
                      <span className="dark:text-gray-300">
                        {content.avg_time
                          ? `${content.avg_time} seconds`
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4" />
                  URL & Domain
                </h3>

                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                      Default URL:
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1 truncate dark:text-gray-300">
                        {window.location.origin}/landing/{content.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 dark:text-gray-400"
                        onClick={() =>
                          window.open(`/landing/${content.id}`, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {content.domain && (
                    <div className="mt-3 border-t pt-3 dark:border-gray-700">
                      <h4 className="text-sm font-medium mb-2 dark:text-gray-300">
                        Domain Configuration
                      </h4>

                      {content.domain.subdomain && (
                        <div className="flex flex-col mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                            Subdomain:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1 truncate dark:text-gray-300">
                              {content.domain.subdomain}.yourdomain.com
                            </code>
                          </div>
                        </div>
                      )}

                      {content.domain.custom && (
                        <div className="flex flex-col">
                          <span className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                            Custom Domain:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm flex-1 truncate dark:text-gray-300">
                              {content.domain.custom}
                            </code>
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
                              Status:
                            </span>
                            <Badge
                              variant={
                                content.domain.status === "verified"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {content.domain.status === "verified"
                                ? "Verified"
                                : "Unverified"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-3">
                  <Layout className="h-4 w-4" />
                  Content Information
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sections:
                    </span>
                    <span className="dark:text-gray-300">
                      {content.sections?.length || 0}
                    </span>
                  </div>
                  {content.sections && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {content.sections.map((section: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {section.type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {content.styles && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                  <h3 className="text-sm uppercase text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mb-3">
                    <Palette className="h-4 w-4" />
                    Style Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Theme:
                      </span>
                      <p className="dark:text-gray-300 capitalize">
                        {content.styles.theme || "Default"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Font:
                      </span>
                      <p className="dark:text-gray-300">
                        {content.styles.fontFamily || "System"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Spacing:
                      </span>
                      <p className="dark:text-gray-300 capitalize">
                        {content.styles.spacing || "Default"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        Animation:
                      </span>
                      <p className="dark:text-gray-300 capitalize">
                        {content.styles.animation || "None"}
                      </p>
                    </div>

                    {content.styles.colors && (
                      <div className="col-span-2 mt-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          Colors:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {content.styles.colors.primary && (
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded-full border dark:border-gray-600"
                                style={{
                                  backgroundColor:
                                    content.styles.colors.primary,
                                }}
                              ></div>
                              <span className="text-xs dark:text-gray-400">
                                Primary
                              </span>
                            </div>
                          )}

                          {content.styles.colors.background && (
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded-full border dark:border-gray-600"
                                style={{
                                  backgroundColor:
                                    content.styles.colors.background,
                                }}
                              ></div>
                              <span className="text-xs dark:text-gray-400">
                                Background
                              </span>
                            </div>
                          )}

                          {content.styles.colors.text && (
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded-full border dark:border-gray-600"
                                style={{
                                  backgroundColor: content.styles.colors.text,
                                }}
                              ></div>
                              <span className="text-xs dark:text-gray-400">
                                Text
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onPreview(content);
              }}
              className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            <Button
              variant="outline"
              onClick={copyShareLink}
              className="flex items-center gap-2 dark:border-gray-700 dark:text-gray-300"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(`/landing/${content?.id}`, "_blank")}
              disabled={!content}
              className="dark:border-gray-700 dark:text-gray-300"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">
                View Live
              </span>
            </Button>

            <Button
              onClick={() => {
                if (content) {
                  onEdit(content.id);
                  onOpenChange(false);
                }
              }}
              disabled={!content}
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
  );
}
