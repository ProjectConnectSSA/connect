"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, FileText, Copy, QrCode } from "lucide-react";
import { DataTable } from "@/components/forms/data-table";
import { setFormToEdit, clearFormToEdit } from "@/services/formService";
import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react"; // Using QRCodeSVG for QR generation

// Function to format date as DD/MM/YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // "en-GB" formats to DD/MM/YYYY
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
  const totalLinksAllowed = 10;
  const usedLinks = Forms?.length ?? 0;
  const progressValue = (usedLinks / totalLinksAllowed) * 100;

  // States for the Share Dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Ref for the QR code container
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFormData();
    clearFormToEdit();
  }, []);

  // Function to open the share dialog for a specific form
  const handleShareForm = (form: any) => {
    // Create the shareable link (adjust as needed)
    const link = `${window.location.origin}/dashboard/forms/view/${form.id}`;
    setShareLink(link);
    setShareDialogOpen(true);
  };

  // Function to copy the share link to the clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Function to download the QR code as an SVG file
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
      render: (item: any) => (
        <Badge variant={item.isActive === true ? "success" : "secondary"}>{item.isActive === true ? "Active" : "Inactive"}</Badge>
      ),
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
              className="hover:bg-orange-100 transition">
              <MoreVertical className="h-4 w-4 text-orange-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="shadow-md rounded-lg bg-white">
            <DropdownMenuItem onClick={() => handleEditForm(item)}>
              <Pencil className="mr-2 h-4 w-4 text-orange-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShareForm(item)}>
              <Share2 className="mr-2 h-4 w-4 text-orange-500" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewForm(item)}>
              <Eye className="mr-2 h-4 w-4 text-orange-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewFormSubmision(item)}>
              <FileText className="mr-2 h-4 w-4 text-orange-500" />
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
    try {
      const response = await fetch("/api/forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setForms([]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-700">Forms</h1>
          <p className="text-orange-500">Create and manage your forms efficiently.</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/forms/edit/new")}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Usage Card */}
      <Card className="bg-orange-50 border-none shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-orange-800">Usage</CardTitle>
          <CardDescription className="text-orange-600">
            {usedLinks} of {totalLinksAllowed} forms used
          </CardDescription>
          <Progress
            value={progressValue}
            className="mt-2 bg-orange-300"
          />
        </CardHeader>
      </Card>

      {/* Forms List */}
      <Card className="bg-white border-none shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-orange-800">Your Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={Forms || []}
            columns={columns}
            filters={filters}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Form</DialogTitle>
            <DialogDescription>Use the link below to share the form or generate its QR code.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <Button
              onClick={handleCopy}
              variant="outline">
              <Copy className={copied ? "text-green-500" : "text-gray-500"} />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              variant="secondary">
              {showQRCode ? "Hide QR Code" : "Generate QR Code"}
              <QrCode className="ml-2 h-4 w-4" />
            </Button>
            {showQRCode && (
              <div className="mt-4 flex flex-col items-center">
                <div ref={qrCodeRef}>
                  <QRCodeSVG
                    value={shareLink}
                    style={{ width: 128, height: 128 }}
                  />
                </div>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="mt-2">
                  Download QR Code
                </Button>
              </div>
            )}
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="mt-4 w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
