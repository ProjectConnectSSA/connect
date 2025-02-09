"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Share2,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Globe,
} from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { landingTemplates } from "@/components/templates/landing-templates";

const pages = [
  {
    id: "1",
    title: "Product Launch",
    domain: "launch.example.com",
    status: "published",
    visits: 1250,
    created: "2024-04-01",
    type: "product",
  },
  {
    id: "2",
    title: "Event Registration",
    domain: "event.example.com",
    status: "draft",
    visits: 0,
    created: "2024-03-28",
    type: "event",
  },
  {
    id: "3",
    title: "Coming Soon",
    domain: "soon.example.com",
    status: "published",
    visits: 3420,
    created: "2024-03-25",
    type: "promo",
  },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "domain", label: "Domain" },
  {
    key: "status",
    label: "Status",
    render: (item: any) => (
      <Badge variant={item.status === "published" ? "default" : "secondary"}>
        {item.status}
      </Badge>
    ),
  },
  { key: "visits", label: "Visits" },
  { key: "created", label: "Created" },
  {
    key: "actions",
    label: "Actions",
    render: (item: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            Manage Domain
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
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
    key: "status",
    label: "Status",
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Product", value: "product" },
      { label: "Event", value: "event" },
      { label: "Promo", value: "promo" },
    ],
  },
];

export default function LandingPage() {
  const router = useRouter();

  const handleUseTemplate = (template: any) => {
    router.push("/dashboard/landing/edit");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
          <p className="text-muted-foreground">
            Create and manage your landing pages.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
                <DialogDescription>
                  Start with a pre-built landing page template or create from
                  scratch.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
                {landingTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => handleUseTemplate(template.template)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-lg">
                            {template.title}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
                <Card
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => router.push("/dashboard/landing/edit")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      <CardTitle className="text-lg">Blank Page</CardTitle>
                    </div>
                    <CardDescription>
                      Start from scratch with a blank landing page
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => router.push("/dashboard/landing/edit")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Landing Page
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>3 of 10 landing pages used</CardDescription>
          <Progress value={30} className="mt-2" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Landing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={pages}
            columns={columns}
            filters={filters}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
