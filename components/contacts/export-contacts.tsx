// File: src/components/contacts/ExportContacts.tsx
"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lead } from "@/app/types/LeadType";
import { X } from "lucide-react";

interface ExportContactsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportContacts({ open, onOpenChange }: ExportContactsProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sourceType, setSourceType] = useState<Lead["sourceType"] | "any">("any");
  const [status, setStatus] = useState<Lead["status"] | "any">("any");
  const [campaignTag, setCampaignTag] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // 1) Fetch all leads
      const res = await fetch("/api/Leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const allLeads: Lead[] = await res.json();

      // 2) Filter client‑side
      const filtered = allLeads.filter((lead) => {
        // by start/end date
        const created = new Date(lead.createdAt);
        if (startDate && created < new Date(startDate)) return false;
        if (endDate && created > new Date(endDate)) return false;
        // by source
        if (sourceType !== "any" && lead.sourceType !== sourceType) return false;
        // by status
        if (status !== "any" && lead.status !== status) return false;
        // by tag substring
        if (campaignTag && (lead.campaignTag || "").toLowerCase().indexOf(campaignTag.toLowerCase()) === -1) return false;
        return true;
      });

      // 3) Build CSV
      const rows: string[] = [];
      rows.push(["Email", "SourceType", "SourceName", "CampaignTag", "Status", "Date"].join(","));
      filtered.forEach((row) => {
        rows.push(
          [row.email, row.sourceType, row.sourceId, row.campaignTag || "", row.status, new Date(row.createdAt).toISOString()]
            .map((v) => `"${(v ?? "").replace(/"/g, '""')}"`)
            .join(",")
        );
      });

      // 4) Download CSV
      const blob = new Blob([rows.join("\n")], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `leads_export_${Date.now()}.csv`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error exporting leads");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md bg-white rounded shadow p-6 transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-lg font-semibold mb-4">Export Contacts to CSV</Dialog.Title>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="start">Start Date</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end">End Date</Label>
              <Input
                id="end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="source">Source Type</Label>
            <Select
              value={sourceType}
              onValueChange={(v) => setSourceType(v as Lead["sourceType"])}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="linktree">Linktree</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="emailCampaign">Email Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Lead["status"])}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label htmlFor="tag">Campaign Tag</Label>
            <Input
              id="tag"
              type="text"
              value={campaignTag}
              onChange={(e) => setCampaignTag(e.target.value)}
              placeholder="Any"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Button
              onClick={handleExport}
              disabled={loading}>
              {loading ? "Exporting…" : "Export"}
            </Button>
          </div>

          <Dialog.Close className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
