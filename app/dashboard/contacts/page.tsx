"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { ContactStats } from "@/components/contacts/contact-stats";
import { ImportContacts } from "@/components/contacts/import-contacts";
import { SegmentBuilder } from "@/components/contacts/segment-builder";
import { Plus, FileUp, Tags } from "lucide-react";

export default function ContactsPage() {
  const router = useRouter();
  const [showImport, setShowImport] = useState(false);
  const [showSegment, setShowSegment] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage and organize your contacts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImport(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSegment(true)}>
            <Tags className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
          <Button onClick={() => router.push("/dashboard/contacts/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      <ContactStats />
      <ContactsTable />

      <ImportContacts
        open={showImport}
        onOpenChange={setShowImport}
      />
      <SegmentBuilder
        open={showSegment}
        onOpenChange={setShowSegment}
      />
    </div>
  );
}
