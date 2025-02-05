"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart } from "@/components/analytics/chart";

interface ResponsesAnalyticsProps {
  submissions: any[];
  totalSubmissions: number;
}

export function ResponsesAnalytics({ submissions, totalSubmissions }: ResponsesAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Filter submissions based on selected time range
  const filteredSubmissions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "24h":
        filterDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        break;
    }

    return submissions.filter((sub) => new Date(sub.timestamp) >= filterDate);
  }, [submissions, timeRange]);

  // Filter submissions by source type
  const finalSubmissions = useMemo(() => {
    if (sourceFilter === "all") return filteredSubmissions;
    return filteredSubmissions.filter((sub) => sub.source === sourceFilter);
  }, [filteredSubmissions, sourceFilter]);

  // Format data for charts
  const lineChartData = useMemo(() => {
    const groupedData: Record<string, number> = {};

    finalSubmissions.forEach((sub) => {
      const date = new Date(sub.timestamp).toLocaleDateString();
      groupedData[date] = (groupedData[date] || 0) + 1;
    });

    return Object.keys(groupedData).map((date) => ({
      name: date,
      value: groupedData[date],
    }));
  }, [finalSubmissions]);

  const barChartData = useMemo(() => {
    return [
      { name: "Fast", value: finalSubmissions.filter((sub) => sub.responseTime < 60).length },
      { name: "Medium", value: finalSubmissions.filter((sub) => sub.responseTime >= 60 && sub.responseTime < 180).length },
      { name: "Slow", value: finalSubmissions.filter((sub) => sub.responseTime >= 180).length },
    ];
  }, [finalSubmissions]);

  const pieChartData = useMemo(() => {
    return [
      { name: "Direct", value: finalSubmissions.filter((sub) => sub.source === "direct").length, color: "#8b5cf6" },
      { name: "Social", value: finalSubmissions.filter((sub) => sub.source === "social").length, color: "#06b6d4" },
      { name: "Email", value: finalSubmissions.filter((sub) => sub.source === "email").length, color: "#10b981" },
    ];
  }, [finalSubmissions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs
          value={timeRange}
          onValueChange={setTimeRange}
          className="w-[400px]">
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={sourceFilter}
          onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="direct">Direct</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="social">Social</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Response Trends (Line Chart) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Response Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LineChart data={lineChartData} />
          </CardContent>
        </Card>

        {/* Completion Rate (Pie Chart) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieChartData} />
          </CardContent>
        </Card>

        {/* Response Time Distribution (Bar Chart) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Response Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <BarChart data={barChartData} />
          </CardContent>
        </Card>

        {/* Question Analysis */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>What type of customer are you?</span>
                  <span className="text-muted-foreground">Drop-off: 2%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[98%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>What's your company name?</span>
                  <span className="text-muted-foreground">Drop-off: 5%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[95%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>How satisfied are you?</span>
                  <span className="text-muted-foreground">Drop-off: 1%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full w-[99%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
