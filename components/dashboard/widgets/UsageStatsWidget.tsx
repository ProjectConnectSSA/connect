"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, FileText, Mail, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- API Response Structure (Unchanged) ---
interface UsageStat {
  current: number | null;
  limit: number | null;
}
interface AllUsageData {
  links: UsageStat | null;
  forms: UsageStat | null;
  emails: UsageStat | null;
  landingPages: UsageStat | null;
}
interface ProfileApiResponse {
  id: string;
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  company: string | null;
  planId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  usage: AllUsageData;
}
// --- End Structure Definition ---

const USAGE_API_ENDPOINT = "/api/profile";

const calculatePercentage = (current?: number | null, limit?: number | null): number => {
  const currentVal = current ?? 0;
  const limitVal = limit ?? 0;
  if (limitVal === 0 || limitVal === Infinity || limitVal < 0) return 0;
  if (currentVal >= limitVal) return 100;
  return Math.min((currentVal / limitVal) * 100, 100);
};

// --- Updated UsageCard component with semi-transparent blue design ---
interface UsageCardProps {
  title: string;
  icon: React.ElementType;
  data: UsageStat | null;
}

function UsageCard({ title, icon: Icon, data }: UsageCardProps) {
  const percentage = calculatePercentage(data?.current, data?.limit);
  const isUnlimited = data?.limit === Infinity || (data?.limit ?? 0) <= 0;

  return (
    <Card
      className={cn(
        "backdrop-blur-sm border-2 shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:bg-blue-600/20 hover:border-blue-500 hover:shadow-blue-500/25"
      )}
      style={{ 
        backgroundColor: 'rgba(37, 99, 235, 0.1)', 
        borderColor: '#2563eb' 
      }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-blue-200/30">
        <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</CardTitle>
        <Icon className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent className="pt-4">
        {data ? (
          <>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {(data.current ?? 0).toLocaleString()}
              {!isUnlimited && <span className="text-base font-normal text-gray-600 dark:text-gray-400"> / {(data.limit ?? 0).toLocaleString()}</span>}
              {isUnlimited && <span className="text-base font-normal text-gray-600 dark:text-gray-400"> / ∞</span>}
            </div>
            {!isUnlimited ? (
              <>
                <Progress
                  value={percentage}
                  className="mt-2 h-2"
                  style={{ 
                    "--progress-background": "rgba(37, 99, 235, 0.2)",
                    "--progress-foreground": "#2563eb"
                  } as React.CSSProperties}
                  aria-label={`${percentage.toFixed(0)}% ${title} Usage`}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(2)}% of your quota</p>
              </>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pt-[12px]">Unlimited usage</p>
            )}
          </>
        ) : (
          <>
            <Skeleton className="h-7 w-1/3 mb-2 bg-blue-200/30" />
            <Skeleton className="h-2 w-full mb-1 bg-blue-200/30" />
            <Skeleton className="h-3 w-3/4 bg-blue-200/30" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function UsageStatsWidget() {
  const [allProfileData, setAllProfileData] = useState<ProfileApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... fetchUsage logic remains exactly the same ...
    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(USAGE_API_ENDPOINT);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data: ProfileApiResponse = await response.json();
        setAllProfileData(data);
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
    // ... Loading skeleton logic is unchanged ...
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
    // ... Error component logic is unchanged ...
    return (
      <Card className="md:col-span-2 lg:col-span-4 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const usageData = allProfileData?.usage;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        title="Links Usage"
        icon={Link2}
        data={usageData?.links ?? null}
      />
      <UsageCard
        title="Forms Usage"
        icon={FileText}
        data={usageData?.forms ?? null}
      />
      <UsageCard
        title="Emails Usage"
        icon={Mail}
        data={usageData?.emails ?? null}
      />
      <UsageCard
        title="Landing Page Usage"
        icon={Globe}
        data={usageData?.landingPages ?? null}
      />
    </div>
  );
}
