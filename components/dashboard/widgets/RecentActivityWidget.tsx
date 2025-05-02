"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Use Shadcn Table
import { Badge } from "@/components/ui/badge"; // Use Shadcn Badge for status

export interface Campaign {
  id: number;
  name: string;
  status: "Sent" | "Draft" | "Scheduled" | "Error"; // Define possible statuses
  opens: number;
  clicks: number;
  date: string;
}

// Example interface for Forms/Landing Pages if data becomes dynamic
export interface FormActivity {
  id: number;
  name: string;
  status: "Active" | "Draft" | "Archived";
  submissions: number;
  conversionRate: string; // Or number
  lastUpdated: string;
}

export interface LandingPageActivity {
  id: number;
  name: string;
  status: "Published" | "Draft" | "Scheduled";
  visits: number;
  conversions: number;
  conversionRate: string; // Derived or stored
  publishedDate: string;
}

interface RecentActivityWidgetProps {
  recentCampaigns: Campaign[];
  // Add props for formsData and landingPagesData if they become dynamic
}

export function RecentActivityWidget({ recentCampaigns }: RecentActivityWidgetProps) {
  // Mock data for Forms and Landing Pages (keep inside or pass as props)
  const formsData: FormActivity[] = [
    { id: 1, name: "Customer Feedback", status: "Active", submissions: 123, conversionRate: "32.4%", lastUpdated: "Mar 15, 2025" },
    { id: 2, name: "Product Registration", status: "Active", submissions: 85, conversionRate: "28.6%", lastUpdated: "Mar 12, 2025" },
    { id: 3, name: "Newsletter Signup", status: "Draft", submissions: 0, conversionRate: "0%", lastUpdated: "Mar 16, 2025" },
  ];

  const landingPagesData: LandingPageActivity[] = [
    { id: 1, name: "Spring Sale", status: "Published", visits: 1245, conversions: 186, conversionRate: "14.9%", publishedDate: "Mar 8, 2025" },
    { id: 2, name: "Product Launch", status: "Scheduled", visits: 0, conversions: 0, conversionRate: "0%", publishedDate: "Mar 22, 2025" },
    {
      id: 3,
      name: "Webinar Registration",
      status: "Published",
      visits: 852,
      conversions: 127,
      conversionRate: "14.9%",
      publishedDate: "Mar 5, 2025",
    },
  ];

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status.toLowerCase()) {
      case "sent":
      case "active":
      case "published":
        return "default"; // Typically green in themes
      case "scheduled":
        return "outline"; // Typically blue/yellow
      case "draft":
        return "secondary"; // Typically grey
      case "error":
      case "archived":
        return "destructive"; // Typically red
      default:
        return "secondary";
    }
  };

  const getStatusColorClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case "sent":
      case "active":
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "error":
      case "archived":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Monitor your recent campaigns, forms, and landing pages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="email"
          className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            {" "}
            {/* Use grid for better mobile */}
            <TabsTrigger value="email">Email Campaigns</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="landing">Landing Pages</TabsTrigger>
          </TabsList>

          {/* Email Campaigns Tab */}
          <TabsContent
            value="email"
            className="space-y-4">
            <div className="relative w-full overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Opens</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColorClass(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{campaign.opens.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{campaign.clicks.toLocaleString()}</TableCell>
                        <TableCell>{campaign.date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center">
                        No recent campaigns.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent
            value="forms"
            className="space-y-4">
            <div className="relative w-full overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Submissions</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formsData.length > 0 ? (
                    formsData.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">{form.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColorClass(form.status)}>
                            {form.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{form.submissions.toLocaleString()}</TableCell>
                        <TableCell>{form.conversionRate}</TableCell>
                        <TableCell>{form.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center">
                        No active forms.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Landing Pages Tab */}
          <TabsContent
            value="landing"
            className="space-y-4">
            <div className="relative w-full overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                    <TableHead className="text-right">Conversions</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landingPagesData.length > 0 ? (
                    landingPagesData.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColorClass(page.status)}>
                            {page.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{page.visits.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {page.conversions.toLocaleString()} ({page.conversionRate})
                        </TableCell>
                        <TableCell>{page.publishedDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center">
                        No landing pages found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
