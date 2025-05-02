"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, FileText, Mail, Globe, AlertCircle, Loader2 } from "lucide-react";
// No need to import createClient here unless fetching user profile for other reasons

// --- Expected API Response Structure ---
interface UsageStat {
  current: number;
  limit: number;
}
interface AllUsageData {
  links: UsageStat | null;
  forms: UsageStat | null;
  emails: UsageStat | null;
  landingPages: UsageStat | null;
}
// --- End Structure Definition ---

// API Endpoint
const USAGE_API_ENDPOINT = "/api/profile";

// Helper to calculate percentage safely
const calculatePercentage = (current?: number, limit?: number): number => {
  const currentVal = current ?? 0;
  const limitVal = limit ?? 0;
  // Handle "unlimited" represented by a very large number or specific value if needed
  if (limitVal === 0 || limitVal === Infinity) return 0; // Or handle Infinity display differently
  if (currentVal >= limitVal) return 100; // Cap at 100 if current exceeds limit
  return Math.min((currentVal / limitVal) * 100, 100);
};

// --- Reusable UsageCard Component (No changes needed from previous version) ---
interface UsageCardProps {
  title: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  data: UsageStat | null; // Expects { current, limit } or null
  // Removed error prop as parent handles overall error
}

function UsageCard({ title, icon: Icon, iconColorClass, bgColorClass, data }: UsageCardProps) {
  const percentage = calculatePercentage(data?.current, data?.limit);
  const isUnlimited = data?.limit === Infinity || (data?.limit ?? 0) <= 0; // Simple check for 0 or Infinity as unlimited

  return (
    <Card className={`${bgColorClass} backdrop-blur-md shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        {data ? (
          <>
            <div className="text-2xl font-bold">
              {data.current.toLocaleString()}
              {!isUnlimited && ( // Only show limit if it's not unlimited
                <span className="text-base font-normal text-muted-foreground"> / {data.limit.toLocaleString()}</span>
              )}
              {isUnlimited && ( // Show 'Unlimited' text
                <span className="text-base font-normal text-muted-foreground"> / ∞</span>
              )}
            </div>
            {!isUnlimited ? (
              <>
                <Progress
                  value={percentage}
                  className={`mt-2 h-2`}
                  aria-label={`${percentage.toFixed(0)}% ${title} Usage`}
                />
                <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(2)}% of your quota</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground mt-1 pt-[12px]">Unlimited usage</p> // Add padding to align text
            )}
          </>
        ) : (
          // Placeholder/Skeleton
          <>
            <Skeleton className="h-7 w-1/3 mb-2" />
            <Skeleton className="h-2 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
// --- End Reusable UsageCard Component ---

export function UsageStatsWidget() {
  // State to hold combined usage data from the single API call
  const [usageData, setUsageData] = useState<AllUsageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(USAGE_API_ENDPOINT);
        if (!response.ok) {
          let errorMsg = `Error: ${response.status}`;
          try {
            const errData = await response.json();
            errorMsg = errData.error || errData.message || errorMsg;
          } catch {}
          throw new Error(errorMsg);
        }
        const data: AllUsageData = await response.json();
        setUsageData(data);
      } catch (err: any) {
        console.error("Failed to fetch usage data:", err);
        setError(err.message || "Could not load usage data.");
        setUsageData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []); // Runs once on mount

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/4" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/3 mb-2" />
              <Skeleton className="h-2 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Card className="md:col-span-2 lg:col-span-4 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Usage Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // --- Render Cards with data from the single API call ---
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        title="Links Usage"
        icon={Link2}
        iconColorClass="text-blue-600"
        bgColorClass="bg-blue-100/50"
        data={usageData?.links ?? null} // Pass specific slice or null
      />
      <UsageCard
        title="Forms Usage"
        icon={FileText}
        iconColorClass="text-orange-600"
        bgColorClass="bg-orange-100/50"
        data={usageData?.forms ?? null}
      />
      <UsageCard
        title="Emails Usage"
        icon={Mail}
        iconColorClass="text-purple-600"
        bgColorClass="bg-purple-100/50"
        data={usageData?.emails ?? null}
      />
      <UsageCard
        title="Landing Page Usage"
        icon={Globe}
        iconColorClass="text-green-600"
        bgColorClass="bg-green-100/50"
        data={usageData?.landingPages ?? null}
      />
    </div>
  );
}
