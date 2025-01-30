import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link2, FileText, Mail, Globe } from "lucide-react";

export default function DashboardPage() {
  return (
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
        </CardContent>
      </Card>
    </div>
  );
}
