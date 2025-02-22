"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
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

// Utility function: format date.
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

// List of static pages details only to render on the landing pages list.
// const pages = [
//   {
//     id: "1",
//     title: "Product Launch",
//     domain: "launch.example.com",
//     status: "published",
//     visits: 1250,
//     created: "2024-04-01",
//     type: "product",
//   },
//   {
//     id: "2",
//     title: "Event Registration",
//     domain: "event.example.com",
//     status: "draft",
//     visits: 0,
//     created: "2024-03-28",
//     type: "event",
//   },
//   {
//     id: "3",
//     title: "Coming Soon",
//     domain: "soon.example.com",
//     status: "published",
//     visits: 3420,
//     created: "2024-03-25",
//     type: "promo",
//   },
// ];

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
  const [LandingPages, setLandingPages] = useState<any[]>([]);
  const totalPagesAllowed = 10;
  const usedPages = LandingPages?.length ?? 0;
  const progressValue = (usedPages / totalPagesAllowed) * 100;

  useEffect(() => {
    fetchLandingPagesData();
    // clearLandingPageToEdit();
  }, []);

  async function fetchLandingPagesData() {
    try {
      const response = await fetch("/api/landings");
      if (!response.ok) {
        throw new Error("Failed to fetch landing pages");
      }
      const data = await response.json();
      setLandingPages(data);
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      setLandingPages([]);
    }
  }

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
            <DropdownMenuItem
              onClick={() => deleteLandingPage(item.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // const columns = [
  //   { key: "title", label: "Title" },
  //   {
  //     key: "created_at",
  //     label: "Created",
  //     render: (item: any) => formatDate(item.created_at),
  //   },
  //   {
  //     key: "status",
  //     label: "Status",
  //     render: (item: any) => (
  //       <Badge variant={item.isActive ? "success" : "secondary"}>
  //         {item.isActive ? "Active" : "Inactive"}
  //       </Badge>
  //     ),
  //   },
  //   {
  //     key: "actions",
  //     label: "Actions",
  //     render: (item: any) => (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             variant="ghost"
  //             size="icon"
  //             className="hover:bg-gray-100 transition"
  //           >
  //             <MoreVertical className="h-4 w-4 text-gray-600" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent
  //           align="end"
  //           className="shadow-md rounded-lg bg-white"
  //         >
  //           {/* <DropdownMenuItem onClick={() => handleEditLandingPage(item)}> */}
  //           <DropdownMenuItem>
  //             <Pencil className="mr-2 h-4 w-4 text-gray-500" />
  //             Edit
  //           </DropdownMenuItem>
  //           {/* <DropdownMenuItem onClick={() => handleShareLandingPage(item)}> */}
  //           <DropdownMenuItem>
  //             <Share2 className="mr-2 h-4 w-4 text-gray-500" />
  //             Share
  //           </DropdownMenuItem>
  //           <DropdownMenuItem onClick={() => handleViewLandingPage(item)}>
  //             <Eye className="mr-2 h-4 w-4 text-gray-500" />
  //             View
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => handleViewLandingPageSubmision(item)}
  //           >
  //             <FileText className="mr-2 h-4 w-4 text-gray-500" />
  //             Submissions
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => deleteLandingPage(item.id)}
  //             className="text-red-500 hover:bg-red-100"
  //           >
  //             <Trash2 className="mr-2 h-4 w-4 text-red-500" />
  //             Delete
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     ),
  //   },
  // ];

  async function deleteLandingPage(id: string) {
    try {
      const response = await fetch("/api/landings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete landing page");
      }
      setLandingPages((prevForms) =>
        prevForms.filter((form) => form.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete landing page:", error);
    }
  }

  // const handleShareLandingPage = (form: any) => {
  //   const link = `${window.location.origin}/dashboard/forms/view/${form.id}`;
  //   setShareLink(link);
  //   setShareDialogOpen(true);
  // };

  // const handleViewLandingPage = (landing_page: any) => {
  //   router.push(`/dashboard/landing/view/${landing_page.id}`);
  // };

  // const handleViewLandingPageSubmision = (landing_page: any) => {
  //   router.push(`/dashboard/landing/response/${landing_page.id}`);
  // };

  // function handleEditLandingPage(form: any) {
  //   setFormToEdit(form);
  //   router.push(`/dashboard/forms/edit/${form.id}`);
  // }

  const handleUseTemplate = (template: any) => {
    router.push("/dashboard/landing/edit");
    console.log(template);
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

      {/* Usage Card */}
      <Card className="bg-gray-50 border-none shadow-sm rounded-lg p-4 max-w-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 text-lg">Usage</CardTitle>
          <CardDescription className="text-gray-600">
            {usedPages} of {totalPagesAllowed} landing pages used
          </CardDescription>
          <Progress value={progressValue} className="mt-2 bg-gray-300" />
        </CardHeader>
      </Card>

      {/* Landing Pages List */}
      <Card className="bg-white border-none shadow-sm rounded-lg p-4">
        <CardHeader>
          <CardTitle className="text-gray-900 text-xl">
            Your Landing Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={LandingPages || []}
            columns={columns}
            filters={filters}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
