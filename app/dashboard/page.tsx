import DashboardSidebar from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link2, FileText, Mail, Globe, Bell, Book, ArrowUpRight, BarChart2, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: "New Email Templates Available",
      description: "We've added 15 new responsive email templates to the gallery.",
      date: "March 15, 2025",
      type: "feature",
    },
    {
      id: 2,
      title: "Form Analytics Update",
      description: "Track conversion rates and drop-offs with our new analytics dashboard.",
      date: "March 10, 2025",
      type: "update",
    },
    {
      id: 3,
      title: "Scheduled Maintenance",
      description: "Brief downtime expected on March 20 from 2-4am EST.",
      date: "March 8, 2025",
      type: "maintenance",
    },
  ];

  // Mock data for tutorials
  const tutorials = [
    {
      id: 1,
      title: "Creating Your First Email Campaign",
      duration: "5 min",
      difficulty: "Beginner",
      image: "/tutorials/email-campaign.jpg",
    },
    {
      id: 2,
      title: "Advanced Form Validation",
      duration: "8 min",
      difficulty: "Intermediate",
      image: "/tutorials/form-validation.jpg",
    },
    {
      id: 3,
      title: "Landing Page Optimization",
      duration: "12 min",
      difficulty: "Advanced",
      image: "/tutorials/landing-page.jpg",
    },
    {
      id: 4,
      title: "A/B Testing Your Templates",
      duration: "10 min",
      difficulty: "Intermediate",
      image: "/tutorials/ab-testing.jpg",
    },
  ];

  // Mock data for recent campaigns
  const recentCampaigns = [
    {
      id: 1,
      name: "March Newsletter",
      status: "Sent",
      opens: 2456,
      clicks: 873,
      date: "Mar 10, 2025",
    },
    {
      id: 2,
      name: "Product Launch Announcement",
      status: "Draft",
      opens: 0,
      clicks: 0,
      date: "Mar 18, 2025",
    },
    {
      id: 3,
      name: "Spring Sale Promotion",
      status: "Scheduled",
      opens: 0,
      clicks: 0,
      date: "Mar 21, 2025",
    },
  ];

  // Mock data for upcoming tasks
  const upcomingTasks = [
    {
      id: 1,
      title: "Finalize Q2 Email Templates",
      due: "Mar 20, 2025",
      priority: "High",
    },
    {
      id: 2,
      title: "Update Customer Feedback Form",
      due: "Mar 22, 2025",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Review Landing Page Analytics",
      due: "Mar 25, 2025",
      priority: "Low",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-6">
          {/* Welcome and quick actions section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's an overview of your marketing tools.</p>
            </div>
            <div className="flex space-x-2">
              <Button>
                New Campaign <Mail className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">
                View Analytics <BarChart2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Usage cards grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Links Usage Card */}
            <Card className="bg-blue-100 bg-opacity-50 backdrop-blur-md shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Links Usage</CardTitle>
                <Link2 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10/1000</div>
                <Progress
                  value={1}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">1% of your monthly quota</p>
              </CardContent>
            </Card>

            {/* Forms Usage Card */}
            <Card className="bg-orange-100 bg-opacity-50 backdrop-blur-md shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forms Usage</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5/500</div>
                <Progress
                  value={1}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">1% of your monthly quota</p>
              </CardContent>
            </Card>

            {/* Emails Usage Card */}
            <Card className="bg-purple-100 bg-opacity-50 backdrop-blur-md shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emails Usage</CardTitle>
                <Mail className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25/2000</div>
                <Progress
                  value={1.25}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">1.25% of your monthly quota</p>
              </CardContent>
            </Card>

            {/* Landing Page Usage Card */}
            <Card className="bg-green-100 bg-opacity-50 backdrop-blur-md shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Landing Page Usage</CardTitle>
                <Globe className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15/300</div>
                <Progress
                  value={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">5% of your monthly quota</p>
              </CardContent>
            </Card>
          </div>

          {/* Announcements Component */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                <div className="flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-600" />
                  Announcements
                </div>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-start space-x-4 rounded-lg border p-3 transition-colors hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {announcement.type === "feature" && (
                        <div className="rounded-full bg-green-100 p-2">
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                      {announcement.type === "update" && (
                        <div className="rounded-full bg-blue-100 p-2">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {announcement.type === "maintenance" && (
                        <div className="rounded-full bg-orange-100 p-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <p className="text-sm text-gray-600">{announcement.description}</p>
                      <span className="text-xs text-gray-500 mt-1 block">{announcement.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Two column layout for tutorials and recent activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tutorials Component */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>
                  <div className="flex items-center">
                    <Book className="mr-2 h-5 w-5 text-purple-600" />
                    Quick Tutorials
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm">
                  View Library
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tutorials.map((tutorial) => (
                    <div
                      key={tutorial.id}
                      className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50 cursor-pointer">
                      <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-200">
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
                          <Book className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{tutorial.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="mr-1 h-3 w-3" />
                          {tutorial.duration} | {tutorial.difficulty}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns with Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Monitor your recent campaigns and their performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="email"
                className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="email">Email Campaigns</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="landing">Landing Pages</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="email"
                  className="space-y-4">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left font-medium">Campaign</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Opens</th>
                          <th className="h-12 px-4 text-left font-medium">Clicks</th>
                          <th className="h-12 px-4 text-left font-medium">Date</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCampaigns.map((campaign) => (
                          <tr
                            key={campaign.id}
                            className="border-b transition-colors hover:bg-gray-50">
                            <td className="p-4 align-middle font-medium">{campaign.name}</td>
                            <td className="p-4 align-middle">
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  campaign.status === "Sent"
                                    ? "bg-green-100 text-green-800"
                                    : campaign.status === "Draft"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                {campaign.status}
                              </div>
                            </td>
                            <td className="p-4 align-middle">{campaign.opens.toLocaleString()}</td>
                            <td className="p-4 align-middle">{campaign.clicks.toLocaleString()}</td>
                            <td className="p-4 align-middle">{campaign.date}</td>
                            <td className="p-4 align-middle">
                              <Button
                                variant="ghost"
                                size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent
                  value="forms"
                  className="space-y-4">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left font-medium">Form Name</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Submissions</th>
                          <th className="h-12 px-4 text-left font-medium">Conversion Rate</th>
                          <th className="h-12 px-4 text-left font-medium">Last Updated</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Customer Feedback</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                              Active
                            </div>
                          </td>
                          <td className="p-4 align-middle">123</td>
                          <td className="p-4 align-middle">32.4%</td>
                          <td className="p-4 align-middle">Mar 15, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Product Registration</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                              Active
                            </div>
                          </td>
                          <td className="p-4 align-middle">85</td>
                          <td className="p-4 align-middle">28.6%</td>
                          <td className="p-4 align-middle">Mar 12, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Newsletter Signup</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                              Draft
                            </div>
                          </td>
                          <td className="p-4 align-middle">0</td>
                          <td className="p-4 align-middle">0%</td>
                          <td className="p-4 align-middle">Mar 16, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent
                  value="landing"
                  className="space-y-4">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="h-12 px-4 text-left font-medium">Page Name</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Visits</th>
                          <th className="h-12 px-4 text-left font-medium">Conversions</th>
                          <th className="h-12 px-4 text-left font-medium">Published Date</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Spring Sale</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                              Published
                            </div>
                          </td>
                          <td className="p-4 align-middle">1,245</td>
                          <td className="p-4 align-middle">186 (14.9%)</td>
                          <td className="p-4 align-middle">Mar 8, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Product Launch</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                              Scheduled
                            </div>
                          </td>
                          <td className="p-4 align-middle">0</td>
                          <td className="p-4 align-middle">0</td>
                          <td className="p-4 align-middle">Mar 22, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">Webinar Registration</td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                              Published
                            </div>
                          </td>
                          <td className="p-4 align-middle">852</td>
                          <td className="p-4 align-middle">127 (14.9%)</td>
                          <td className="p-4 align-middle">Mar 5, 2025</td>
                          <td className="p-4 align-middle">
                            <Button
                              variant="ghost"
                              size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Subscribers Growth Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Subscribers Growth</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">+248 this month</p>
                <div className="mt-4 h-10 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="bg-blue-500 h-full w-3/4"
                    style={{ width: "75%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Last month: 1,984</span>
                  <span>Current: 2,232</span>
                </div>
              </CardContent>
            </Card>

            {/* Form Conversions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Form Conversions</CardTitle>
                <FileText className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.7%</div>
                <p className="text-xs text-muted-foreground">+4.2% from last week</p>
                <div className="mt-4 h-10 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="bg-orange-500 h-full"
                    style={{ width: "32.7%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Submissions: 326</span>
                  <span>Views: 998</span>
                </div>
              </CardContent>
            </Card>

            {/* Email Open Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Email Open Rate</CardTitle>
                <Mail className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.3%</div>
                <p className="text-xs text-muted-foreground">-1.2% from last campaign</p>
                <div className="mt-4 h-10 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="bg-purple-500 h-full"
                    style={{ width: "24.3%" }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Opens: 2,456</span>
                  <span>Sent: 10,104</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access Tools</CardTitle>
              <CardDescription>Frequently used tools to create and manage your marketing assets.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Mail className="h-6 w-6" />
                  <span>Email Builder</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Form Builder</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Globe className="h-6 w-6" />
                  <span>Landing Pages</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Link2 className="h-6 w-6" />
                  <span>Link Manager</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Contacts</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <BarChart2 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Scheduler</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center space-y-2">
                  <Bell className="h-6 w-6" />
                  <span>Notifications</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
