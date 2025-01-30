"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { FileText, Download, Mail, Table, FileSpreadsheet, FileJson, Clock } from "lucide-react";

export function ExportPanel() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Export completed successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Export Responses</h2>
        <p className="text-sm text-muted-foreground">Download your form responses in various formats</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Timestamps</Label>
                  <p className="text-sm text-muted-foreground">Add submission date and time</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Metadata</Label>
                  <p className="text-sm text-muted-foreground">Add browser and device info</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include File Attachments</Label>
                  <p className="text-sm text-muted-foreground">Download attached files</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Export</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleExport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleExport}>
                <Table className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleExport}>
                <FileJson className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={handleExport}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automated Exports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Schedule Daily Export</Label>
                  <p className="text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4 inline-block" />
                    Every day at 12:00 AM
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4 inline-block" />
                    Send to specified email
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleExport}
          disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export Now"}
        </Button>
      </div>
    </div>
  );
}
