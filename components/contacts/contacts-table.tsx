"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, Tags, Trash2, Edit, Star, Ban, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
const mockContacts = [
  {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    source: "Newsletter Form",
    tags: ["lead", "customer"],
    status: "active",
    lastActive: "2024-03-15",
    score: 85,
  },
  {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    source: "Contact Form",
    tags: ["marketing"],
    status: "active",
    lastActive: "2024-03-14",
    score: 92,
  },
];

const columns = [
  {
    key: "name",
    label: "Name",
    render: (item: any) => (
      <div>
        <div className="font-medium">{item.name}</div>
        <div className="text-sm text-muted-foreground">{item.email}</div>
      </div>
    ),
  },
  {
    key: "source",
    label: "Source",
  },
  {
    key: "tags",
    label: "Tags",
    render: (item: any) => (
      <div className="flex gap-1">
        {item.tags.map((tag: string) => (
          <Badge
            key={tag}
            variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "score",
    label: "Lead Score",
    render: (item: any) => <Badge variant={item.score >= 90 ? "success" : "default"}>{item.score}</Badge>,
  },
  { key: "lastActive", label: "Last Active" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => <Badge variant={item.status === "active" ? "success" : "secondary"}>{item.status}</Badge>,
  },
  {
    key: "actions",
    label: "Actions",
    render: (item: any) => (
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
          <DropdownMenuItem>
            <Tags className="mr-2 h-4 w-4" />
            Manage Tags
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Contact
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Star className="mr-2 h-4 w-4" />
            Mark as VIP
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            View Activity
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Ban className="mr-2 h-4 w-4" />
            Block Contact
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
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
    key: "source",
    label: "Source",
    options: [
      { label: "Newsletter Form", value: "newsletter" },
      { label: "Contact Form", value: "contact" },
      { label: "Manual Entry", value: "manual" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    options: [
      { label: "Lead", value: "lead" },
      { label: "Customer", value: "customer" },
      { label: "Marketing", value: "marketing" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Blocked", value: "blocked" },
    ],
  },
];

export function ContactsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts</CardTitle>
        <CardDescription>View and manage all your contacts in one place</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={mockContacts}
          columns={columns}
          filters={filters}
          itemsPerPage={10}
        />
      </CardContent>
    </Card>
  );
}
