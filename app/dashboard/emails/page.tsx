"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "@/components/forms/data-table";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Plus, Trash2, AlertCircle } from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type EmailTemplate = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
};

export default function EmailsDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Define total allowed templates limit
  const totalTemplatesAllowed = 6;
  const usedTemplates = templates.length;
  const progressValue = (usedTemplates / totalTemplatesAllowed) * 100;
  
  // Check if limit is reached
  const isLimitReached = usedTemplates >= totalTemplatesAllowed;

  // Function to handle create template action with limit check
  const handleCreateTemplate = () => {
    if (isLimitReached) {
      toast.error(`Template limit reached. Maximum ${totalTemplatesAllowed} templates allowed.`);
      return;
    }
    router.push("/dashboard/emails/editor/new");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUser(data.user);
    };
    
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/emails");
      
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      
      const data = await response.json();
      setTemplates(data);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast.error(`Failed to fetch templates: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/emails/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete template");
      }
      
      toast.success("Template deleted successfully");
      fetchTemplates(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast.error(`Failed to delete template: ${error.message}`);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { 
      key: "status", 
      label: "Status",
      render: (template: EmailTemplate) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          template.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
          template.status === 'published' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
        </span>
      )
    },
    {
      key: "updated_at",
      label: "Last Updated",
      render: (template: EmailTemplate) => new Date(template.updated_at).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (template: EmailTemplate) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100 transition">
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="shadow-md rounded-lg bg-white">
            <DropdownMenuItem onClick={() => router.push(`/dashboard/emails/editor/${template.id}`)}>
              <Pencil className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeleteTemplate(template.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Email Templates</h1>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handleCreateTemplate}
                        className={`text-white shadow-md ${
                          isLimitReached 
                            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={isLimitReached}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Email
                        {isLimitReached && <AlertCircle className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isLimitReached && (
                    <TooltipContent>
                      <p>Template limit reached ({totalTemplatesAllowed} max)</p>
                      <p className="text-xs">Delete existing templates to create new ones</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <Card className={`${
                isLimitReached ? "bg-red-50" : "bg-gray-50"
              } border-none shadow-sm rounded-lg p-2 w-32 h-12 flex flex-col justify-center`}>
                <span className={`text-sm font-medium ${
                  isLimitReached ? "text-red-700" : "text-gray-900"
                }`}>
                  {usedTemplates}/{totalTemplatesAllowed}
                </span>
                <Progress
                  value={progressValue}
                  className={`w-full mt-1 h-2 ${
                    isLimitReached ? "bg-red-200" : "bg-gray-300"
                  }`}
                />
              </Card>
            </div>
          </div>
          
          <Card className="bg-white border-none shadow-sm rounded-lg p-4 w-full">
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading email templates...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">You don't have any email templates yet.</p>
                <Button 
                  onClick={handleCreateTemplate}
                  variant="outline"
                  className={isLimitReached ? "cursor-not-allowed opacity-50" : ""}
                  disabled={isLimitReached}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Button>
              </div>
            ) : (
              <DataTable
                data={templates}
                columns={columns}
                itemsPerPage={5}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
