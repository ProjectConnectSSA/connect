"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, Link2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsesList } from "@/components/forms/response/response-list";
import { ExportPanel } from "@/components/forms/response/export-panel";
interface ViewFormPageProps {
  params: Promise<{ id: string }>; // Props passed to the component containing the form ID.
}

export default function FormView({ params }: ViewFormPageProps) {
  const unwrappedParams = React.use(params); // Resolving the promise for the parameters.
  const { id } = unwrappedParams; // Extracting the form ID.
  const [loading, setLoading] = useState(true); // State to indicate whether the form data is being loaded.
  const [totalSubmissions, setTotalSubmissions] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("responses");
  useEffect(() => {
    // useEffect hook to fetch form data when the component mounts.
    async function fetchFormData() {
      try {
        const response = await fetch(`/api/form-submision/${id}`); // Fetch the form data from the API.
        if (!response.ok) {
          // Handle API errors.
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json(); // Parse the response as JSON.
        console.log("response data", data);
        // Calculate total submissions based on the provided data structure.
        const totalSubmissionsCount = data.submissions ? data.submissions.length : 0;
        setTotalSubmissions(totalSubmissionsCount);
      } catch (error) {
        console.error("Error fetching form data:", error); // Log errors to the console.
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete.
      }
    }

    fetchFormData(); // Call the function to fetch data.
  }, [id]); // Dependency array ensures this runs when the form ID changes.

  if (loading) {
    // Display a loading state while data is being fetched.
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
          <p className="text-muted-foreground">View and analyze your form submissions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-orange-100 bg-opacity-50 backdrop-blur-md shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmissions !== null ? totalSubmissions : "N/A"}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 bg-opacity-50 backdrop-blur-md shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 bg-opacity-50 backdrop-blur-md shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 34s</div>
            <p className="text-xs text-muted-foreground">-10s from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 bg-opacity-50 backdrop-blur-md shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pabbly, Zapier, Make</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger
            value="responses"
            className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Responses
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          <ResponsesList />
        </TabsContent>

        <TabsContent value="analytics">
          <h1>Analytics</h1>
        </TabsContent>

        <TabsContent value="integrations">
          <h1>Integrations</h1>
        </TabsContent>

        <TabsContent value="export">
          <ExportPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
