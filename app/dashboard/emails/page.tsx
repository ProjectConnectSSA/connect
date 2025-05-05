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
import { MoreVertical, Pencil, Plus } from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";

type Draft = {
  id: string;
  title: string;
  updated_at: string;
};

export default function EmailsDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  // Define total allowed drafts; update as needed.
  const totalDraftsAllowed = 10;
  const usedDrafts = drafts.length;
  const progressValue = (usedDrafts / totalDraftsAllowed) * 100;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user);
    });
  }, [supabase]);

  useEffect(() => {
    if (user) {
      fetchDrafts();
    }
  }, [user]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch(`/api/drafts?user_id=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      } else {
        console.error("Error fetching drafts");
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "updated_at",
      label: "Last Updated",
      render: (draft: Draft) => new Date(draft.updated_at).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (draft: Draft) => (
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
            <DropdownMenuItem onClick={() => router.push(`/builder?draft=${draft.id}`)}>
              <Pencil className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      {/* <<< Modified wrapper to include TopBar >>> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {" "}
        {/* Added flex-col and overflow-hidden */}
        {/* ================================= */}
        {/* <<< Add TopBar Component Here >>> */}
        <TopBar />
        {/* ================================= */}
        {/* Original content area (now inside the flex-col container) */}
        {/* Added overflow-y-auto to make this part scrollable */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header with title, Create New Email button, and usage card */}
          <div className="flex items-center justify-between">
            <div></div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/builder")}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Create New Email
              </Button>
              <Card className="bg-gray-50 border-none shadow-sm rounded-lg p-2 w-32 h-12 flex flex-col justify-center">
                <span className="text-sm font-medium text-gray-900">
                  {usedDrafts}/{totalDraftsAllowed}
                </span>
                <Progress
                  value={progressValue}
                  className="w-full mt-1 h-2 bg-gray-300"
                />
              </Card>
            </div>
          </div>
          {/* Drafts List */}
          <Card className="bg-white border-none shadow-sm rounded-lg p-4 w-full">
            {/* <<< NOTE: You might need loading/empty states here in a real app >>> */}
            <DataTable
              data={drafts || []}
              columns={columns}
              itemsPerPage={5}
            />
          </Card>
        </div>
      </div>{" "}
      {/* <<< End Modified wrapper >>> */}
    </div>
  );
}
