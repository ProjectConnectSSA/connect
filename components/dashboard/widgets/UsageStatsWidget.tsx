"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming this is your custom Skeleton or from a UI library
import { Link2, FileText, Mail, Globe, AlertCircle } from "lucide-react"; // Removed Loader2 as it's handled by Skeleton

// --- Expected API Response Structure from /api/profile ---
interface UsageStat {
  current: number | null; // Allow null from API
  limit: number | null; // Allow null from API
}
interface AllUsageData {
  // This matches the 'usage' field in ProfileApiResponse
  links: UsageStat | null;
  forms: UsageStat | null;
  emails: UsageStat | null;
  landingPages: UsageStat | null;
}
// This is the full structure returned by /api/profile
interface ProfileApiResponse {
  id: string;
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null;
  planId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  usage: AllUsageData; // The nested usage object
}
// --- End Structure Definition ---

const USAGE_API_ENDPOINT = "/api/profile";

const calculatePercentage = (current?: number | null, limit?: number | null): number => {
  const currentVal = current ?? 0;
  const limitVal = limit ?? 0;
  if (limitVal === 0 || limitVal === Infinity || limitVal < 0) return 0; // Handle 0, Infinity, or negative limit as no quota or unlimited
  if (currentVal >= limitVal) return 100;
  return Math.min((currentVal / limitVal) * 100, 100);
};

interface UsageCardProps {
  title: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  data: UsageStat | null;
}

function UsageCard({ title, icon: Icon, iconColorClass, bgColorClass, data }: UsageCardProps) {
  const percentage = calculatePercentage(data?.current, data?.limit);
  const isUnlimited = data?.limit === Infinity || (data?.limit ?? 0) <= 0;

  return (
    <Card className={`${bgColorClass} backdrop-blur-md shadow-sm hover:shadow-md transition-shadow dark:border-gray-700`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium dark:text-gray-200">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClass}`} />
      </CardHeader>
      <CardContent className="dark:text-gray-300">
        {data ? ( // Check if data for this specific card exists
          <>
            <div className="text-2xl font-bold">
              {(data.current ?? 0).toLocaleString()}
              {!isUnlimited && (
                <span className="text-base font-normal text-muted-foreground dark:text-gray-400"> / {(data.limit ?? 0).toLocaleString()}</span>
              )}
              {isUnlimited && <span className="text-base font-normal text-muted-foreground dark:text-gray-400"> / ∞</span>}
            </div>
            {!isUnlimited ? (
              <>
                <Progress
                  value={percentage}
                  className={`mt-2 h-2`}
                  aria-label={`${percentage.toFixed(0)}% ${title} Usage`}
                />
                <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1">{percentage.toFixed(2)}% of your quota</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1 pt-[12px]">Unlimited usage</p>
            )}
          </>
        ) : (
          // Skeleton specific to a card if its data is missing but overall load is complete
          <>
            <Skeleton className="h-7 w-1/3 mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-2 w-full mb-1 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function UsageStatsWidget() {
  const [allProfileData, setAllProfileData] = useState<ProfileApiResponse | null>(null); // Store full profile
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(USAGE_API_ENDPOINT); // Fetches from /api/profile
        if (!response.ok) {
          let errorMsg = `Error: ${response.status}`;
          try {
            const errData = await response.json();
            errorMsg = errData.error || errData.message || errorMsg;
          } catch {
            /* Ignore if error response is not JSON */
          }
          throw new Error(errorMsg);
        }
        const data: ProfileApiResponse = await response.json(); // Expects the full ProfileApiResponse
        setAllProfileData(data); // Store the full response
      } catch (err: any) {
        console.error("Failed to fetch usage data:", err);
        setError(err.message || "Could not load usage data.");
        setAllProfileData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card
            key={index}
            className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/3 mb-2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-2 w-full mb-1 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="md:col-span-2 lg:col-span-4 border-destructive bg-destructive/10 dark:bg-red-900/20 dark:border-red-700">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive dark:text-red-400">
            <AlertCircle className="mr-2 h-5 w-5" /> Error Loading Usage Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive dark:text-red-300">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Extract usage data from the full profile data
  const usageData = allProfileData?.usage;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        title="Links Usage"
        icon={Link2}
        iconColorClass="text-blue-600 dark:text-blue-400"
        bgColorClass="bg-blue-100/50 dark:bg-blue-900/30"
        data={usageData?.links ?? null}
      />
      <UsageCard
        title="Forms Usage"
        icon={FileText}
        iconColorClass="text-orange-600 dark:text-orange-400"
        bgColorClass="bg-orange-100/50 dark:bg-orange-900/30"
        data={usageData?.forms ?? null}
      />
      <UsageCard
        title="Emails Usage"
        icon={Mail}
        iconColorClass="text-purple-600 dark:text-purple-400"
        bgColorClass="bg-purple-100/50 dark:bg-purple-900/30"
        data={usageData?.emails ?? null}
      />
      <UsageCard
        title="Landing Page Usage"
        icon={Globe}
        iconColorClass="text-green-600 dark:text-green-400"
        bgColorClass="bg-green-100/50 dark:bg-green-900/30"
        data={usageData?.landingPages ?? null}
      />
    </div>
  );
}
