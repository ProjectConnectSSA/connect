/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { setFormToEdit, clearFormToEdit } from "@/services/linkFormService";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default function LinksPage() {
  const router = useRouter();
  const [linkForms, setLinkForms] = useState<any[] | null>(null);
  const totalLinksAllowed = 100;
  const usedLinks = linkForms?.length ?? 0;
  const progressValue = (usedLinks / totalLinksAllowed) * 100;

  useEffect(() => {
    fetchFormData();
    clearFormToEdit();
  }, []);

  async function fetchFormData() {
    try {
      const response = await fetch(`/api/links`);
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      setLinkForms(data.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setLinkForms([]);
    }
  }

  async function deleteForm(id: string) {
    try {
      const response = await fetch(`/api/links`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      setLinkForms((prevForms) => (prevForms ? prevForms.filter((form) => form.id !== id) : []));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  }

  function handleEditForm(linkform: any) {
    setFormToEdit(linkform);
    router.push(`/dashboard/links/edit/${linkform.id}`);
  }

  const handleViewForm = (linkform: any) => {
    router.push(`/dashboard/links/view/${linkform.id}`);
  };

  if (linkForms === null) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />

      <div className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-blue-700">Links</h1>
              <p className="text-blue-500">Create and manage your links efficiently.</p>
            </div>

            <Button
              onClick={() => router.push("/dashboard/links/edit/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Create Link Page
            </Button>
          </div>

          {/* Usage Card */}
          <Card className="bg-blue-50 border-none shadow-sm rounded-lg p-6">
            <CardHeader>
              <CardTitle className="text-blue-800">Usage</CardTitle>
              <CardDescription className="text-blue-600">
                {usedLinks} of {totalLinksAllowed} links used
              </CardDescription>
              <Progress
                value={progressValue}
                className="mt-2 bg-blue-300"
              />
            </CardHeader>
          </Card>

          {/* Link Forms List */}
          <Card className="bg-white border-none shadow-sm rounded-lg p-6">
            <CardHeader>
              <CardTitle className="text-blue-800">Your Link Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {linkForms.length > 0 ? (
                  linkForms.map((linkform) => (
                    <div
                      key={linkform.id}
                      className="flex items-center justify-between rounded-lg bg-blue-50 p-4 hover:shadow-md transition">
                      <div>
                        <h3 className="font-semibold text-blue-900">{linkform.title}</h3>
                        <p className="text-sm text-blue-600">https://example.com/{linkform.id}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100 transition">
                            <MoreVertical className="h-4 w-4 text-blue-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="shadow-md rounded-lg bg-white">
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4 text-blue-500" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewForm(linkform)}>
                            <Eye className="mr-2 h-4 w-4 text-blue-500" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditForm(linkform)}>
                            <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteForm(linkform.id)}
                            className="text-red-500 hover:bg-red-100">
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-blue-600">No link pages found. Create your first link page to get started.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
