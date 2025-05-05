"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// --- Added Loader2 ---
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, FileText, Copy, QrCode, Loader2 } from "lucide-react";
import { DataTable } from "@/components/forms/data-table";
import { setFormToEdit, clearFormToEdit } from "@/services/formService";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { TemplateSelector } from "@/components/forms/templates/templateSelecter";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";

// Utility function: format date.
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Feedback", value: "feedback" },
      { label: "Registration", value: "registration" },
      { label: "Application", value: "application" },
      { label: "Survey", value: "survey" },
    ],
  },
];

export default function FormsPage() {
  const router = useRouter();
  const [Forms, setForms] = useState<any[]>([]);
  // --- Add isLoading State ---
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // --- End Add isLoading State ---

  const totalLinksAllowed = 10;
  const usedLinks = Forms?.length ?? 0;
  const progressValue = (usedLinks / totalLinksAllowed) * 100;

  // States for the Share Dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // State for the Template Dialog
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  useEffect(() => {
    fetchFormData();
    clearFormToEdit();
  }, []);

  const handleShareForm = (form: any) => {
    const link = `${window.location.origin}/dashboard/forms/view/${form.id}`;
    setShareLink(link);
    setShareDialogOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector("svg");
      if (svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "created_at",
      label: "Created",
      render: (item: any) => formatDate(item.created_at),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => <Badge variant={item.isActive ? "success" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="shadow-md rounded-lg bg-white">
            <DropdownMenuItem onClick={() => handleEditForm(item)}>
              <Pencil className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShareForm(item)}>
              <Share2 className="mr-2 h-4 w-4 text-gray-500" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewForm(item)}>
              <Eye className="mr-2 h-4 w-4 text-gray-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewFormSubmision(item)}>
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Submissions
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteForm(item.id)}
              className="text-red-500 hover:bg-red-100">
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  async function deleteForm(id: string) {
    try {
      const response = await fetch("/api/forms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete form");
      }
      setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  }

  const handleViewForm = (form: any) => {
    router.push(`/dashboard/forms/view/${form.id}`);
  };

  const handleViewFormSubmision = (form: any) => {
    router.push(`/dashboard/forms/response/${form.id}`);
  };

  function handleEditForm(form: any) {
    setFormToEdit(form);
    router.push(`/dashboard/forms/edit/${form.id}`);
  }

  async function fetchFormData() {
    // --- Set loading true ---
    setIsLoading(true);
    try {
      const response = await fetch("/api/forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setForms([]); // Clear forms on error
      // Optionally set an error state here if you add one later
    } finally {
      // --- Set loading false ---
      setIsLoading(false);
    }
  }

  // Template selection handler
  const handleSelectTemplate = (template: any) => {
    setFormToEdit(template);
    setTemplateDialogOpen(false);
    router.push("/dashboard/forms/edit/new");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {" "}
      {/* Added background */}
      <DashboardSidebar />
      {/* Main content wrapper - Takes remaining width, arranges TopBar and Main vertically */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ================================================ */}
        {/* TopBar: Now a direct child, spans full width */}
        <TopBar />
        {/* ================================================ */}
        {/* Scrollable Page Content Area */}
        {/* flex-1 makes it take remaining height, overflow-y-auto enables scrolling, p-6 adds padding INSIDE */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Inner container for content spacing */}
          <div className="space-y-6">
            {/* Header section */}
            <div className="flex items-center justify-between flex-shrink-0">
              <div></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push("/dashboard/forms/edit/new")}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Form
                  </Button>
                  <Button
                    onClick={() => setTemplateDialogOpen(true)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800">
                    {" "}
                    {/* Added dark mode */}
                    Templates
                  </Button>
                </div>
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm rounded-lg p-2 w-32 h-12 flex flex-col justify-center">
                  {" "}
                  {/* Added dark mode */}
                  <div className="flex justify-between items-center">
                    {" "}
                    {/* Align usage text */}
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {" "}
                      {/* Added dark mode */}
                      {usedLinks}/{totalLinksAllowed}
                    </span>
                  </div>
                  <Progress
                    value={progressValue}
                    className="w-full mt-1 h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-blue-600 dark:[&>div]:bg-blue-500" /* Added dark mode styles */
                  />
                </Card>
              </div>
            </div>

            {/* Content Area: Loading or Forms List */}
            {/* This div is now inside the scrollable 'main' */}
            <div>
              {isLoading ? (
                // --- Loading Indicator ---
                <div className="flex justify-center items-center h-64 pt-10">
                  {" "}
                  {/* Adjusted height */}
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" /> {/* Added dark mode */}
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading forms...</span> {/* Added dark mode */}
                </div>
              ) : (
                // --- Forms List (Rendered when not loading) ---
                <Card className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm rounded-lg p-4 w-full">
                  {" "}
                  {/* Added dark mode */}
                  <div>
                    {/* Render DataTable only if not loading */}
                    <DataTable
                      data={Forms || []}
                      columns={columns}
                      filters={filters} // Make sure filters are defined/passed correctly if used by DataTable
                      itemsPerPage={5}
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>{" "}
          {/* End Inner container for content spacing */}
        </main>{" "}
        {/* End Scrollable Page Content Area */}
        {/* --- Dialogs --- */}
        {/* Share Dialog */}
        <Dialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}>
          {/* Dialog Content remains the same... */}
          <DialogContent className="bg-white dark:bg-gray-900 border dark:border-gray-800">
            {" "}
            {/* Added dark mode */}
            <DialogHeader>
              <DialogTitle className="dark:text-gray-100">Share Form</DialogTitle> {/* Added dark mode */}
              <DialogDescription className="dark:text-gray-400">Use the link below to share the form or generate its QR code.</DialogDescription>{" "}
              {/* Added dark mode */}
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700" /* Added dark mode */
              />
              <Button
                onClick={handleCopy}
                size="icon" /* Size icon for copy button */
                variant="outline"
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                {" "}
                {/* Added dark mode */}
                <Copy className={`h-4 w-4 ${copied ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`} /> {/* Adjusted size + dark mode */}
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setShowQRCode(!showQRCode)}
                variant="secondary"
                className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                {" "}
                {/* Added dark mode */}
                {showQRCode ? "Hide QR Code" : "Generate QR Code"}
                <QrCode className="ml-2 h-4 w-4" />
              </Button>
              {showQRCode && (
                <div className="mt-4 flex flex-col items-center">
                  <div
                    ref={qrCodeRef}
                    className="bg-white p-2 rounded">
                    {" "}
                    {/* Ensure QR has white background */}
                    <QRCodeSVG
                      value={shareLink}
                      size={128} // Use size prop instead of style
                      level="Q" // Error correction level
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="mt-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    {" "}
                    {/* Added dark mode */}
                    Download QR Code
                  </Button>
                </div>
              )}
            </div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="mt-4 w-full dark:text-gray-400 dark:hover:bg-gray-800">
                {" "}
                {/* Added dark mode */}
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        {/* Template Selection Dialog */}
        {/* Assuming TemplateSelector handles its own styling/dark mode */}
        <TemplateSelector
          open={templateDialogOpen}
          onClose={() => setTemplateDialogOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
        {/* --- End Dialogs --- */}
      </div>{" "}
      {/* End Main content wrapper */}
    </div> // End Outer container
  );
}
