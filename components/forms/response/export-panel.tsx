"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FileSpreadsheet, Table, FileJson, FileText, Download, Mail, Clock, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Papa from "papaparse";
import jsPDF from "jspdf";

interface Submission {
  id: number;
  created_at: string;
  response: Record<string, string>;
  meta: string; // JSON string, needs parsing
}

interface ExportPanelProps {
  submissions: Submission[];
}

export function ExportPanel({ submissions }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(false);

  // 📌 Function to download file
  const downloadFile = (data: Blob, filename: string) => {
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 📌 Export as CSV
  const exportCSV = () => {
    if (!submissions.length) return toast.error("No submissions to export.");

    const csvData = submissions.map((sub) => {
      const meta = JSON.parse(sub.meta);
      return {
        ID: sub.id,
        Timestamp: includeTimestamp ? new Date(sub.created_at).toLocaleString() : "",
        ...sub.response,
        Metadata: includeMetadata ? JSON.stringify(meta) : "",
        Attachments: includeAttachments ? "N/A" : "",
      };
    });

    const csv = Papa.unparse(csvData);
    downloadFile(new Blob([csv], { type: "text/csv" }), "responses.csv");
    toast.success("CSV exported successfully!");
  };

  // 📌 Export as JSON
  const exportJSON = () => {
    if (!submissions.length) return toast.error("No submissions to export.");
    const jsonData = JSON.stringify(submissions, null, 2);
    downloadFile(new Blob([jsonData], { type: "application/json" }), "responses.json");
    toast.success("JSON exported successfully!");
  };

  // 📌 Export as PDF
  const exportPDF = () => {
    if (!submissions.length) return toast.error("No submissions to export.");

    const doc = new jsPDF();
    doc.text("Form Responses", 10, 10);
    submissions.forEach((sub, index) => {
      const y = 20 + index * 10;
      const meta = JSON.parse(sub.meta);
      doc.text(`${sub.id}: ${JSON.stringify(sub.response)}`, 10, y);
      if (includeMetadata) doc.text(`Meta: ${JSON.stringify(meta)}`, 10, y + 5);
    });

    doc.save("responses.pdf");
    toast.success("PDF exported successfully!");
  };

  // 📌 Handle Export
  const handleExport = (format: string) => {
    setIsExporting(true);
    setExportFormat(format);

    setTimeout(() => {
      if (format === "csv") exportCSV();
      if (format === "json") exportJSON();
      if (format === "pdf") exportPDF();
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Export Responses</h2>
          <p className="text-sm text-muted-foreground">Download your form responses in various formats</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export Settings</TooltipContent>
        </Tooltip>
      </div>

      {/* Export Options */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Export */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExport("csv")}>
              <FileSpreadsheet className="h-5 w-5" /> CSV
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExport("json")}>
              <FileJson className="h-5 w-5" /> JSON
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleExport("pdf")}>
              <FileText className="h-5 w-5" /> PDF
            </Button>
          </CardContent>
        </Card>

        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <Label>Include Timestamps</Label>
              </div>
              <Switch
                checked={includeTimestamp}
                onCheckedChange={setIncludeTimestamp}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-muted-foreground" />
                <Label>Include Metadata</Label>
              </div>
              <Switch
                checked={includeMetadata}
                onCheckedChange={setIncludeMetadata}
              />
            </div>
          </CardContent>
        </Card>

        {/* Automated Exports */}
        <Card>
          <CardHeader>
            <CardTitle>Automated Exports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <Label>Schedule Daily Export</Label>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Label>Email Reports</Label>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Now Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => handleExport(exportFormat)}
          disabled={isExporting}>
          <Download className="mr-2 h-5 w-5" />
          {isExporting ? "Exporting..." : "Export Now"}
        </Button>
      </div>
    </div>
  );
}
