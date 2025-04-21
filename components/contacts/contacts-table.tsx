// File: src/components/contacts/ContactsTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Lead } from "@/app/types/LeadType";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Tags, Trash2, Edit, Star, Ban, History, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ContactsTable() {
  const [contacts, setContacts] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editedTag, setEditedTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/Leads");
        if (!res.ok) throw new Error("Failed to load contacts");
        const data: Lead[] = await res.json();
        setContacts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const openTagDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setEditedTag(lead.campaignTag || "");
    setIsDialogOpen(true);
  };

  const handleTagSave = async () => {
    if (!selectedLead) return;
    setSaving(true);
    try {
      const res = await fetch("/api/Leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, campaignTag: editedTag }),
      });
      if (!res.ok) throw new Error("Failed to update tag");
      const updated: Lead = await res.json();
      setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating tag");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this lead?")) return;
    // TODO: call delete API
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const columns = [
    { key: "email", label: "Email", render: (item: Lead) => <div>{item.email}</div> },
    { key: "sourceType", label: "Source Type", render: (item: Lead) => <div>{item.sourceType}</div> },
    { key: "sourceId", label: "Source Name", render: (item: Lead) => <div>{item.sourceId}</div> },
    { key: "campaignTag", label: "Campaign Tag", render: (item: Lead) => <Badge variant="secondary">{item.campaignTag || "-"}</Badge> },
    {
      key: "status",
      label: "Status",
      render: (item: Lead) => <Badge variant={item.status === "pending" ? "default" : "success"}>{item.status}</Badge>,
    },
    { key: "created_at", label: "Date", render: (item: Lead) => <div>{new Date(item.createdAt).toLocaleDateString()}</div> },
    {
      key: "actions",
      label: "Actions",
      render: (item: Lead) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openTagDialog(item)}>
              <Tags className="mr-2 h-4 w-4" />
              Edit Tag
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Lead
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              Mark as VIP
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(item.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filters = [
    {
      key: "sourceType",
      label: "Source",
      options: Array.from(new Set(contacts.map((c) => c.sourceType))).map((src) => ({ label: src, value: src })),
    },
    {
      key: "sourceId",
      label: "Source Name",
      options: Array.from(new Set(contacts.map((c) => c.sourceId))).map((id) => ({ label: id, value: id })),
    },
    {
      key: "campaignTag",
      label: "Campaign Tag",
      options: Array.from(new Set(contacts.map((c) => c.campaignTag).filter((tag): tag is string => !!tag))).map((tag) => ({
        label: tag,
        value: tag,
      })),
    },
    {
      key: "status",
      label: "Status",
      options: Array.from(new Set(contacts.map((c) => c.status || "").filter((s) => !!s))).map((s) => ({ label: s, value: s })),
    },
  ];

  if (loading) return <div>Loading contacts...</div>;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Contacts</CardTitle>
          <CardDescription>View and manage all your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={contacts}
            columns={columns}
            filters={filters}
            itemsPerPage={10}
          />
        </CardContent>
      </Card>

      {/* Edit Tag Dialog */}
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 max-w-sm w-full bg-white rounded shadow p-4 transform -translate-x-1/2 -translate-y-1/2">
            <Dialog.Title className="text-lg font-semibold mb-2">Edit Campaign Tag</Dialog.Title>
            <input
              type="text"
              value={editedTag}
              onChange={(e) => setEditedTag(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Campaign Tag"
            />
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button
                onClick={handleTagSave}
                disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
            <Dialog.Close className="absolute top-2 right-2 p-1">
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
