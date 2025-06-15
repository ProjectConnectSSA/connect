"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Mail } from "lucide-react";

// Interfaces for dynamic data later
interface StatOverview {
  value: string;
  changeDescription: string;
  progressPercent: number;
  detailLeft: string;
  detailRight: string;
}

interface StatsOverviewWidgetProps {
  subscribersStat?: StatOverview;
  formConversionsStat?: StatOverview;
  emailOpenRateStat?: StatOverview;
}

export function StatsOverviewWidget({
  subscribersStat = {
    value: "+12.5%",
    changeDescription: "+248 this month",
    progressPercent: 75,
    detailLeft: "Last month: 1,984",
    detailRight: "Current: 2,232",
  },
  formConversionsStat = {
    value: "32.7%",
    changeDescription: "+4.2% from last week",
    progressPercent: 32.7,
    detailLeft: "Submissions: 326",
    detailRight: "Views: 998",
  },
  emailOpenRateStat = {
    value: "24.3%",
    changeDescription: "-1.2% from last campaign",
    progressPercent: 24.3,
    detailLeft: "Opens: 2,456",
    detailRight: "Sent: 10,104",
  },
}: StatsOverviewWidgetProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Subscribers Growth Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Subscribers Growth</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscribersStat.value}</div>
          <p className="text-xs text-muted-foreground">{subscribersStat.changeDescription}</p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            {" "}
            {/* Use rounded-full */}
            <div
              className="bg-blue-500 h-full rounded-full" // Add rounded-full here too
              style={{ width: `${subscribersStat.progressPercent}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{subscribersStat.detailLeft}</span>
            <span>{subscribersStat.detailRight}</span>
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
          <div className="text-2xl font-bold">{formConversionsStat.value}</div>
          <p className="text-xs text-muted-foreground">{formConversionsStat.changeDescription}</p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full"
              style={{ width: `${formConversionsStat.progressPercent}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formConversionsStat.detailLeft}</span>
            <span>{formConversionsStat.detailRight}</span>
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
          <div className="text-2xl font-bold">{emailOpenRateStat.value}</div>
          <p className="text-xs text-muted-foreground">{emailOpenRateStat.changeDescription}</p>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${emailOpenRateStat.progressPercent}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{emailOpenRateStat.detailLeft}</span>
            <span>{emailOpenRateStat.detailRight}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
