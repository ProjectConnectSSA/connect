"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";

import { setFormToEdit, clearFormToEdit } from "@/services/formService";
import { useEffect, useState } from "react";

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Feedback", value: "feedback" },
      { label: "Registration", value: "registration" },
      { label: "Application", value: "application" },
      { label: "Survey", value: "survey" },
    ],
  },
];

export default function FormsPage() {
  const router = useRouter();
  const [Forms, setForms] = useState<any[]>();
  const totalLinksAllowed = 10;
  const usedLinks = Forms?.length ?? 0;
  const progressValue = (usedLinks / totalLinksAllowed) * 100;

  useEffect(() => {
    fetchFormData();
    clearFormToEdit();
  }, []);

  const columns = [
    { key: "title", label: "Title" },

    { key: "created_at", label: "Created" },
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
            <DropdownMenuItem onClick={() => handleViewForm(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewFormSubmision(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View Submision
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditForm(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteForm(item.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  async function deleteForm(id: string) {
    try {
      const response = await fetch(`/api/forms`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete form");
      }

      setForms((prevForms) => (prevForms ? prevForms.filter((form) => form.id !== id) : []));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  }

  const handleViewForm = (form: any) => {
    console.log("view form", form);
    router.push(`/dashboard/forms/view/${form.id}`);
  };

  const handleViewFormSubmision = (form: any) => {
    console.log("view form", form);
    router.push(`/dashboard/forms/response/${form.id}`);
  };

  function handleEditForm(form: any) {
    setFormToEdit(form);
    router.push(`/dashboard/forms/edit/${form.id}`);
  }

  async function fetchFormData() {
    try {
      const response = await fetch(`/api/forms`);
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      console.log(data);
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setForms([]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Create and manage your forms.</p>
        </div>
        <Button onClick={() => router.push("/dashboard/forms/edit/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            {usedLinks} of {totalLinksAllowed} form used
          </CardDescription>
          <Progress value={progressValue} className="mt-2" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={Forms || []} columns={columns} filters={filters} itemsPerPage={5} />
        </CardContent>
      </Card>
    </div>
  );
}
