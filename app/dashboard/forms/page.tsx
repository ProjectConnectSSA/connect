"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Share2, Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/forms/data-table";
import { setFormToEdit, clearFormToEdit } from "@/services/formService";
import { useEffect, useState } from "react";

// Function to format date as DD/MM/YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // "en-GB" formats to DD/MM/YYYY
};

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
  const [Forms, setForms] = useState<any[]>([]);
  const totalLinksAllowed = 10;
  const usedLinks = Forms?.length ?? 0;
  const progressValue = (usedLinks / totalLinksAllowed) * 100;

  useEffect(() => {
    fetchFormData();
    clearFormToEdit();
  }, []);

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "created_at",
      label: "Created",
      render: (item: any) => formatDate(item.created_at),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-orange-100 transition">
              <MoreVertical className="h-4 w-4 text-orange-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="shadow-md rounded-lg bg-white">
            <DropdownMenuItem>
              <Share2 className="mr-2 h-4 w-4 text-orange-500" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewForm(item)}>
              <Eye className="mr-2 h-4 w-4 text-orange-500" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewFormSubmision(item)}>
              <Eye className="mr-2 h-4 w-4 text-orange-500" />
              View Submissions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditForm(item)}>
              <Pencil className="mr-2 h-4 w-4 text-orange-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteForm(item.id)}
              className="text-red-500 hover:bg-red-100">
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
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

      setForms((prevForms) => prevForms.filter((form) => form.id !== id));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  }

  const handleViewForm = (form: any) => {
    router.push(`/dashboard/forms/view/${form.id}`);
  };

  const handleViewFormSubmision = (form: any) => {
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
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setForms([]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-700">Forms</h1>
          <p className="text-orange-500">Create and manage your forms efficiently.</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/forms/edit/new")}
          className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Usage Card */}
      <Card className="bg-orange-50 border-none shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-orange-800">Usage</CardTitle>
          <CardDescription className="text-orange-600">
            {usedLinks} of {totalLinksAllowed} forms used
          </CardDescription>
          <Progress
            value={progressValue}
            className="mt-2 bg-orange-300"
          />
        </CardHeader>
      </Card>

      {/* Forms List */}
      <Card className="bg-white border-none shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-orange-800">Your Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={Forms || []}
            columns={columns}
            filters={filters}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
