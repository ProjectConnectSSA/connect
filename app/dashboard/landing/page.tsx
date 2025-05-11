"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2, FileText, Globe } from "lucide-react";
import { DataTable } from "@/components/forms/data-table";
import { Badge } from "@/components/ui/badge";
import { landingTemplates } from "@/components/landing/templates/landing-templates";
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
      render: (item: any) => <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>,
    },
    { key: "visits", label: "Visits" },
    { key: "created", label: "Created" },
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
              className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
      setLandingPages((prevPages) => prevPages.filter((page) => page.id !== id));
    } catch (error) {
      console.error("Failed to delete landing page:", error);
    }
  }

  const handleUseTemplate = (template: any) => {
    router.push("/dashboard/landing/edit");
    console.log(template);
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      {/* <<< Wrapper for TopBar and scrollable content >>> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ================================= */}
        {/* <<< Add TopBar Component Here >>> */}
        {/* Assuming TopBar is imported */}
        <TopBar />
        {/* ================================= */}

        {/* <<< Original content, now inside flex-col and made scrollable >>> */}
        <div className="flex-1 space-y-6 p-6 overflow-y-auto">
          {/* Header with title, buttons, and usage card */}
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-4">
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
                    <DialogDescription>Start with a pre-built landing page template or create from scratch.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
                    {landingTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Card
                          key={template.id}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => handleUseTemplate(template.template)}>
                          <div className="p-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              <h3 className="text-lg">{template.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{template.description}</p>
                          </div>
                        </Card>
                      );
                    })}
                    <Card
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => router.push("/dashboard/landing/edit")}>
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          <h3 className="text-lg">Blank Page</h3>
                        </div>
                        <p className="text-sm text-gray-600">Start from scratch with a blank landing page</p>
                      </div>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => router.push("/dashboard/landing/edit")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Landing Page
              </Button>
              {/* Usage Card */}
              <Card className="bg-gray-50 border-none shadow-sm rounded-lg p-2 w-32 h-12 flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900">
                  {usedPages}/{totalPagesAllowed}
                </span>
                <Progress
                  value={progressValue}
                  className="w-full mt-1 h-2 bg-gray-300"
                />
              </Card>
            </div>
          </div>

          {/* Landing Pages List matching Forms table style */}
          <Card className="bg-white border-none shadow-sm rounded-lg p-4 w-full">
            {/* <<< NOTE: You might need loading/empty states here in a real app >>> */}
            <DataTable
              data={LandingPages || []}
              columns={columns}
              filters={filters}
              itemsPerPage={5}
            />
          </Card>
        </div>
      </div>{" "}
      {/* <<< End wrapper >>> */}
    </div>
  );
}
