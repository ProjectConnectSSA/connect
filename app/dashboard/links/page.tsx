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
      console.log(data.data);
      setLinkForms(data.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setLinkForms([]);
    }
    console.log(linkForms);
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
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Links</h1>
            <p className="text-muted-foreground">Create and manage your links.</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard/links/edit/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Link Page
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              {usedLinks} of {totalLinksAllowed} form used
            </CardDescription>
            <Progress
              value={progressValue}
              className="mt-2"
            />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Link Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {linkForms.length > 0 ? (
                linkForms.map((linkform) => (
                  <div
                    key={linkform.id}
                    className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-semibold">{linkform.title}</h3>
                      <p className="text-sm text-muted-foreground">https://example.com/{linkform.id}</p>
                    </div>
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
                        <DropdownMenuItem onClick={() => handleViewForm(linkform)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditForm(linkform)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteForm(linkform.id)}
                          className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No forms found. Create your first form to get started.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
