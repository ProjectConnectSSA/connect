import DashboardSidebar from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar"; // Import the new TopBar
import { WelcomeHeaderWidget } from "@/components/dashboard/widgets/WelcomeHeaderWidget";
import { UsageStatsWidget } from "@/components/dashboard/widgets/UsageStatsWidget";
import {
  AnnouncementsWidget,
  Announcement,
} from "@/components/dashboard/widgets/AnnouncementsWidget";
import {
  TutorialsWidget,
  Tutorial,
} from "@/components/dashboard/widgets/TutorialsWidget";
import {
  RecentActivityWidget,
  Campaign,
} from "@/components/dashboard/widgets/RecentActivityWidget";
import { StatsOverviewWidget } from "@/components/dashboard/widgets/StatsOverviewWidget";
import { QuickAccessWidget } from "@/components/dashboard/widgets/QuickAccessWidget";

// --- Keep your mock data definitions here (or fetch them) ---
// (Announcements, Tutorials, Campaigns data...)
const announcements: Announcement[] = [
  {
    id: 1,
    title: "New Email Templates Available",
    description: "We've added 15 new responsive email templates.",
    date: "March 15, 2025",
    type: "feature",
  },
  {
    id: 2,
    title: "Form Analytics Update",
    description: "Track conversion rates and drop-offs easily.",
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

const tutorials: Tutorial[] = [
  {
    id: 1,
    title: "Creating Your First Email Campaign",
    duration: "5 min",
    difficulty: "Beginner",
    image: "/placeholder-img.svg",
  },
  {
    id: 2,
    title: "Advanced Form Validation Techniques",
    duration: "8 min",
    difficulty: "Intermediate",
    image: "/placeholder-img.svg",
  },
  {
    id: 3,
    title: "Optimizing Landing Page Conversion Rates",
    duration: "12 min",
    difficulty: "Advanced",
    image: "/placeholder-img.svg",
  },
  {
    id: 4,
    title: "A/B Testing Your Email Templates",
    duration: "10 min",
    difficulty: "Intermediate",
    image: "/placeholder-img.svg",
  },
];

const recentCampaigns: Campaign[] = [
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

// You might fetch user data here in a real app - or use the one from TopBar if needed elsewhere
// const userName = "Marketing Team"; // Example user name - Can be derived from TopBar's user state if needed

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      {/* Main Content Area */}
      {/* Changed to flex-col to allow TopBar and scrolling content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar /> {/* Add the TopBar here */}
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Widgets Container */}
          <div className="flex flex-col space-y-6">
            {/* Usage Statistics */}
            <UsageStatsWidget />

            {/* Two Column Layout: Announcements & Tutorials */}
            <div className="grid gap-6 lg:grid-cols-2">
              <AnnouncementsWidget announcements={announcements} />
              <TutorialsWidget tutorials={tutorials} />
            </div>

            {/* Recent Activity Tabs */}
            <RecentActivityWidget recentCampaigns={recentCampaigns} />

            {/* Statistics Overview */}
            <StatsOverviewWidget />

            {/* Quick Access Tools */}
            <QuickAccessWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
