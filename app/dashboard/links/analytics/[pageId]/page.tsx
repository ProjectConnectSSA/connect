// app/dashboard/analytics/[pageId]/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, BarChart3, Users, Globe, ExternalLink, Smartphone, CalendarDays, LineChart as LineChartIcon, MapPin } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, parseISO, startOfDay, eachDayOfInterval, subDays, isValid } from "date-fns";

interface PageDetails {
  id: string;
  slug: string;
  custom_domain?: string | null;
}

interface ViewRecord {
  id: string;
  viewed_at: string;
  user_agent?: string | null;
  referrer?: string | null;
  country?: string | null;
  city?: string | null;
}

const getDeviceType = (uaString?: string | null): string => {
  if (!uaString) return "Unknown";
  const lowerUa = uaString.toLowerCase();
  if (lowerUa.includes("mobile") || lowerUa.includes("iphone") || lowerUa.includes("android")) return "Mobile";
  if (lowerUa.includes("tablet") || lowerUa.includes("ipad")) return "Tablet";
  if (lowerUa.includes("windows") || lowerUa.includes("macintosh") || lowerUa.includes("linux")) return "Desktop";
  return "Other";
};

const getReferrerHostname = (referrer?: string | null): string => {
  if (!referrer) return "Direct / Unknown";
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch (e) {
    return "Invalid Referrer URL";
  }
};

const PIE_CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

export default function PageAnalyticsReport() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.pageId as string | undefined;

  const [allViewRecords, setAllViewRecords] = useState<ViewRecord[]>([]);
  const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [selectedPreset, setSelectedPreset] = useState<string>("all_time");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<string>("all");

  const supabase = createClientComponentClient</*Database*/ any>();

  useEffect(() => {
    if (!pageId) {
      setError("Page ID not found in URL.");
      setIsLoading(false);
      return;
    }
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);
      setPageDetails(null);
      setAllViewRecords([]);
      try {
        const { data: pageDataResult, error: pageError } = await supabase
          .from("link_forms")
          .select("id, slug, custom_domain")
          .eq("id", pageId)
          .single();
        if (pageError)
          throw new Error(
            pageError.code === "PGRST116" ? "Page details not found or permission denied." : `Error fetching page details: ${pageError.message}`
          );
        if (!pageDataResult) throw new Error("Page details not found.");
        setPageDetails(pageDataResult);

        const response = await fetch(`/api/links/analytics/${pageId}`); // CORRECTED API ENDPOINT
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          let detailedError = errorData.error || `Failed to fetch analytics: ${response.statusText}`;
          if (response.status === 401) detailedError = "Not authenticated to view analytics.";
          else if (response.status === 403) detailedError = "Permission denied to view analytics for this page.";
          else if (response.status === 404) detailedError = "Analytics data not found for this page.";
          throw new Error(detailedError);
        }
        const data = await response.json();
        setAllViewRecords(Array.isArray(data.viewRecords) ? data.viewRecords : []);
      } catch (err: any) {
        console.error("Error fetching data for analytics page:", err);
        toast.error(`${err.message}`);
        setError(`${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, [pageId, supabase]);

  const countryOptions = useMemo(() => {
    if (!allViewRecords.length) return [{ value: "all", label: "All Countries" }];
    const countries = new Set(allViewRecords.map((r) => r.country || "Unknown").filter((c) => c && c !== "Unknown"));
    return [
      { value: "all", label: "All Countries" },
      { value: "Unknown", label: "Unknown" },
      ...Array.from(countries)
        .sort()
        .map((c) => ({ value: c, label: c })),
    ];
  }, [allViewRecords]);

  const cityOptions = useMemo(() => {
    if (!allViewRecords.length) return [{ value: "all", label: "All Cities" }];
    if (selectedCountry === "all") return [{ value: "all", label: "All Cities (Select Country)" }];

    const cities = new Set(
      allViewRecords
        .filter((r) => (r.country || "Unknown") === selectedCountry)
        .map((r) => r.city || "Unknown")
        .filter((c) => c && c !== "Unknown")
    );
    const cityList = [{ value: "all", label: "All Cities in " + selectedCountry }];
    // Check if "Unknown" city exists for the selected country
    const unknownCityExistsForCountry = allViewRecords.some((r) => (r.country || "Unknown") === selectedCountry && (r.city === "Unknown" || !r.city));
    if (unknownCityExistsForCountry) {
      cityList.push({ value: "Unknown", label: "Unknown in " + selectedCountry });
    }
    Array.from(cities)
      .filter((c) => c !== "Unknown")
      .sort()
      .forEach((c) => cityList.push({ value: c, label: c }));
    return cityList.length > 1 ? cityList : [{ value: "all", label: "No cities for " + selectedCountry }];
  }, [allViewRecords, selectedCountry]);

  const deviceOptions = useMemo(() => {
    if (!allViewRecords.length) return [{ value: "all", label: "All Devices" }];
    const devices = new Set(allViewRecords.map((r) => getDeviceType(r.user_agent)));
    return [
      { value: "all", label: "All Devices" },
      ...Array.from(devices)
        .sort()
        .map((d) => ({ value: d, label: d })),
    ];
  }, [allViewRecords]);

  useEffect(() => {
    if (selectedCountry === "all") {
      setSelectedCity("all");
    } else {
      const currentCityStillValidInNewCountry = cityOptions.some((opt) => opt.value === selectedCity);
      if (!currentCityStillValidInNewCountry && selectedCity !== "all") {
        setSelectedCity("all");
      }
    }
  }, [selectedCountry, cityOptions, selectedCity]);

  const filteredViewRecords = useMemo(() => {
    return allViewRecords.filter((record) => {
      try {
        const recordDate = parseISO(record.viewed_at);
        if (!isValid(recordDate)) return false;
        const fromDate = dateRange.from ? startOfDay(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : null;
        if (fromDate && recordDate < fromDate) return false;
        if (toDate && recordDate > toDate) return false;
      } catch (e) {
        return false;
      }
      if (selectedCountry !== "all" && (record.country || "Unknown") !== selectedCountry) return false;
      if (selectedCity !== "all" && (record.city || "Unknown") !== selectedCity) return false;
      if (selectedDevice !== "all" && getDeviceType(record.user_agent) !== selectedDevice) return false;
      return true;
    });
  }, [allViewRecords, dateRange, selectedCountry, selectedCity, selectedDevice]);

  const totalViews = filteredViewRecords.length;
  const uniqueVisitors = useMemo(() => {
    if (!filteredViewRecords.length) return 0;
    const uniqueKeys = new Set<string>();
    filteredViewRecords.forEach((r) => {
      try {
        const d = parseISO(r.viewed_at);
        if (isValid(d)) uniqueKeys.add(`${getDeviceType(r.user_agent)}-${r.country || "U"}-${r.city || "U"}-${format(d, "yyyy-MM-dd")}`);
      } catch (e) {}
    });
    return uniqueKeys.size;
  }, [filteredViewRecords]);
  const topReferrers = useMemo(() => {
    if (!filteredViewRecords.length) return [];
    const c: { [k: string]: number } = {};
    filteredViewRecords.forEach((r) => {
      const h = getReferrerHostname(r.referrer);
      c[h] = (c[h] || 0) + 1;
    });
    return Object.entries(c)
      .map(([n, ct]) => ({ name: n, count: ct }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [filteredViewRecords]);
  const topCountries = useMemo(() => {
    if (!filteredViewRecords.length) return [];
    const c: { [k: string]: number } = {};
    filteredViewRecords.forEach((r) => {
      const cy = r.country || "Unknown";
      c[cy] = (c[cy] || 0) + 1;
    });
    return Object.entries(c)
      .map(([n, ct]) => ({ name: n, count: ct }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [filteredViewRecords]);
  const topCities = useMemo(() => {
    if (!filteredViewRecords.length) return [];
    const c: { [k: string]: number } = {};
    filteredViewRecords.forEach((r) => {
      const ci = r.city || "Unknown";
      c[ci] = (c[ci] || 0) + 1;
    });
    return Object.entries(c)
      .map(([n, ct]) => ({ name: n, count: ct }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [filteredViewRecords]);
  const viewsByDevice = useMemo(() => {
    if (!filteredViewRecords.length) return [];
    const c: { [k: string]: number } = {};
    filteredViewRecords.forEach((r) => {
      const d = getDeviceType(r.user_agent);
      c[d] = (c[d] || 0) + 1;
    });
    return Object.entries(c)
      .map(([n, ct]) => ({ name: n, count: ct }))
      .sort((a, b) => b.count - a.count);
  }, [filteredViewRecords]);
  const viewsOverTimeData = useMemo(() => {
    if (!filteredViewRecords.length) return [];
    let effStart = dateRange.from ? startOfDay(dateRange.from) : null;
    const effEnd = dateRange.to ? startOfDay(dateRange.to) : startOfDay(new Date());
    if (!effStart) {
      const earliest = filteredViewRecords.reduce((e, rec) => {
        try {
          const curr = startOfDay(parseISO(rec.viewed_at));
          return isValid(curr) && curr < e ? curr : e;
        } catch {
          return e;
        }
      }, startOfDay(new Date()));
      effStart = filteredViewRecords.length > 0 ? earliest : subDays(effEnd, 29);
    }
    if (!isValid(effStart) || !isValid(effEnd) || effStart > effEnd) return [];
    const buckets: { [k: string]: number } = {};
    eachDayOfInterval({ start: effStart, end: effEnd }).forEach((d) => {
      buckets[format(d, "yyyy-MM-dd")] = 0;
    });
    filteredViewRecords.forEach((rec) => {
      try {
        const d = parseISO(rec.viewed_at);
        if (isValid(d)) {
          const dayStr = format(startOfDay(d), "yyyy-MM-dd");
          if (buckets[dayStr] !== undefined) buckets[dayStr]++;
        }
      } catch (e) {}
    });
    return Object.entries(buckets)
      .map(([dS, v]) => ({ dISO: dS, dLbl: format(parseISO(dS), "MMM d"), views: v }))
      .sort((a, b) => parseISO(a.dISO).getTime() - parseISO(b.dISO).getTime())
      .map((i) => ({ date: i.dLbl, views: i.views }));
  }, [filteredViewRecords, dateRange]);

  const handleDatePresetChange = (value: string) => {
    setSelectedPreset(value);
    const today = new Date();
    let from: Date | undefined,
      to: Date | undefined = new Date(new Date().setHours(23, 59, 59, 999));
    switch (value) {
      case "today":
        from = startOfDay(today);
        break;
      case "yesterday":
        const yS = startOfDay(subDays(today, 1));
        const yE = new Date(subDays(today, 1).setHours(23, 59, 59, 999));
        from = yS;
        to = yE;
        break;
      case "last_7_days":
        from = startOfDay(subDays(today, 6));
        break;
      case "last_30_days":
        from = startOfDay(subDays(today, 29));
        break;
      default:
        from = undefined;
        to = undefined;
        break;
    }
    setDateRange({ from, to });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
        </div>
        <Toaster
          richColors
          position="bottom-right"
          theme="system"
        />
      </div>
    );
  }
  if (error && !pageDetails) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <BarChart3 className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Error Loading Page Data</h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}
            className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <Toaster
          richColors
          position="bottom-right"
          theme="system"
        />
      </div>
    );
  }
  if (!pageDetails && !isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Details Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Could not load details for this page.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}
            className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <Toaster
          richColors
          position="bottom-right"
          theme="system"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/links")}
            className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            {/* Date Preset Filter */}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Select
                value={selectedPreset}
                onValueChange={handleDatePresetChange}>
                <SelectTrigger className="w-auto min-w-[150px] md:w-[180px] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  <SelectItem
                    value="all_time"
                    className="dark:text-gray-200 dark:focus:bg-gray-700">
                    All Time
                  </SelectItem>
                  <SelectItem
                    value="today"
                    className="dark:text-gray-200 dark:focus:bg-gray-700">
                    Today
                  </SelectItem>
                  <SelectItem
                    value="yesterday"
                    className="dark:text-gray-200 dark:focus:bg-gray-700">
                    Yesterday
                  </SelectItem>
                  <SelectItem
                    value="last_7_days"
                    className="dark:text-gray-200 dark:focus:bg-gray-700">
                    Last 7 Days
                  </SelectItem>
                  <SelectItem
                    value="last_30_days"
                    className="dark:text-gray-200 dark:focus:bg-gray-700">
                    Last 30 Days
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Country Filter */}
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value); /* Reset city handled by useEffect */
                }}>
                <SelectTrigger className="w-auto min-w-[150px] md:w-[180px] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {countryOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="dark:text-gray-200 dark:focus:bg-gray-700">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* City Filter - CORRECTED AND PRESENT */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={
                  selectedCountry === "all" ||
                  (cityOptions.length <= 1 &&
                    (cityOptions[0]?.value === "all" ||
                      cityOptions[0]?.label.includes("No cities") ||
                      cityOptions[0]?.label.includes("(Select Country)")))
                }>
                <SelectTrigger className="w-auto min-w-[150px] md:w-[180px] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {cityOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="dark:text-gray-200 dark:focus:bg-gray-700">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Device Filter */}
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Select
                value={selectedDevice}
                onValueChange={setSelectedDevice}
                disabled={deviceOptions.length <= 1 && deviceOptions[0]?.value === "all"}>
                <SelectTrigger className="w-auto min-w-[150px] md:w-[180px] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                  <SelectValue placeholder="Device" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                  {deviceOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="dark:text-gray-200 dark:focus:bg-gray-700">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {pageDetails && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Analytics for: {pageDetails.slug || pageDetails.custom_domain || `Page ID: ${pageId}`}
            </h1>
          </div>
        )}
        {error && pageDetails && !allViewRecords.length && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
            <p>Could not load analytics data: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">Total Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-gray-100">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-gray-300">Unique Visitors (Approx.)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-gray-100">{uniqueVisitors.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 md:mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center dark:text-gray-200">
              <LineChartIcon className="mr-2 h-5 w-5" /> Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2 pr-4 md:pr-6">
            {viewsOverTimeData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={300}>
                <LineChart data={viewsOverTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    strokeOpacity={0.2}
                    className="dark:stroke-gray-600"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    className="dark:fill-gray-400"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="dark:fill-gray-400"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.375rem" }}
                    labelStyle={{ color: "hsl(var(--card-foreground))" }}
                    itemStyle={{ color: "hsl(var(--card-foreground))" }}
                    wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600"
                    labelClassName="dark:!text-gray-200"
                    formatter={(value: number) => [value.toLocaleString(), "Views"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                    name="Page Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground dark:text-gray-400">Not enough data to display views over time for this period.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center dark:text-gray-200">
                <ExternalLink className="mr-2 h-5 w-5" /> Top Referrers
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 md:pr-4">
              {topReferrers.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}>
                  <BarChart
                    data={topReferrers}
                    layout="vertical"
                    margin={{ left: 30, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      strokeOpacity={0.2}
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      className="dark:fill-gray-400"
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fontSize: 10, textAnchor: "end" }}
                      className="dark:fill-gray-400"
                      interval={0}
                    />
                    <Tooltip
                      wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600"
                      labelClassName="dark:!text-gray-200"
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                      barSize={15}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400 p-4">No referrer data for this period.</p>
              )}
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center dark:text-gray-200">
                <Globe className="mr-2 h-5 w-5" /> Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 md:pr-4">
              {topCountries.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}>
                  <BarChart
                    data={topCountries}
                    layout="vertical"
                    margin={{ left: 30, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      strokeOpacity={0.2}
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      className="dark:fill-gray-400"
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{ fontSize: 10, textAnchor: "end" }}
                      className="dark:fill-gray-400"
                      interval={0}
                    />
                    <Tooltip
                      wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600"
                      labelClassName="dark:!text-gray-200"
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Bar
                      dataKey="count"
                      fill="#82ca9d"
                      radius={[0, 4, 4, 0]}
                      barSize={15}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400 p-4">No country data for this period.</p>
              )}
            </CardContent>
          </Card>

          {/* Top Cities Card - CORRECTED AND PRESENT */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center dark:text-gray-200">
                <MapPin className="mr-2 h-5 w-5" /> Top Cities
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-0 pr-2 md:pr-4">
              {topCities.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}>
                  <BarChart
                    data={topCities}
                    layout="vertical"
                    margin={{ left: 30, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      strokeOpacity={0.2}
                      className="dark:stroke-gray-600"
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      className="dark:fill-gray-400"
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fontSize: 10, textAnchor: "end" }}
                      className="dark:fill-gray-400"
                      interval={0}
                    />
                    <Tooltip
                      wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600"
                      labelClassName="dark:!text-gray-200"
                      formatter={(value: number) => value.toLocaleString()}
                    />
                    <Bar
                      dataKey="count"
                      fill="#FFBB28"
                      radius={[0, 4, 4, 0]}
                      barSize={15}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400 p-4">No city data for this period. Select a country to see cities.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 md:mt-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center dark:text-gray-200">
                <Smartphone className="mr-2 h-5 w-5" /> Views by Device Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewsByDevice.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}>
                  <PieChart>
                    <Pie
                      data={viewsByDevice}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 20;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="hsl(var(--muted-foreground))"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={12}
                            className="dark:fill-gray-400">{`${name} (${(percent * 100).toFixed(0)}%)`}</text>
                        );
                      }}>
                      {viewsByDevice.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      wrapperClassName="dark:!bg-gray-700 dark:!border-gray-600"
                      labelClassName="dark:!text-gray-200"
                      formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                    />
                    <Legend
                      iconSize={10}
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground dark:text-gray-400">No device data for this period.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Toaster
          richColors
          position="bottom-right"
          theme="system"
        />
      </main>
    </div>
  );
}
