"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link2, FileText, Mail, Globe, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

// --- Define the Limits ---
const USAGE_LIMITS = {
  links: 10,
  forms: 10,
  emails: 10,
  landingPages: 10,
};

// --- Define your API Endpoints (Base paths) ---
const API_ENDPOINTS = {
  links: "/api/links",
  forms: "/api/forms",
  emails: "/api/drafts", // Base path, user_id will be added
  landingPages: "/api/landings",
};

// --- State structures (remain the same) ---
interface UsageStatValue {
  current: number;
  limit: number;
}
interface AllUsageData {
  links: UsageStatValue | null;
  forms: UsageStatValue | null;
  emails: UsageStatValue | null;
  landingPages: UsageStatValue | null;
}
interface UsageErrors {
  links: string | null;
  forms: string | null;
  emails: string | null;
  landingPages: string | null;
}

// Helper to calculate percentage safely
const calculatePercentage = (current?: number, limit?: number): number => {
  const currentVal = current ?? 0;
  const limitVal = limit ?? 0;
  if (limitVal === 0) return 0;
  return Math.min((currentVal / limitVal) * 100, 100);
};

// --- Reusable UsageCard Component (Supabase logic removed) ---
interface UsageCardProps {
  title: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  // indicatorColorClass: string; // Removing as direct indicator styling via class is tricky
  data: UsageStatValue | null;
  error: string | null;
}

function UsageCard({ title, icon: Icon, iconColorClass, bgColorClass, /*indicatorColorClass,*/ data, error }: UsageCardProps) {
  const percentage = calculatePercentage(data?.current, data?.limit);

  return (
    <Card className={`${bgColorClass} backdrop-blur-md shadow-sm hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center text-xs text-destructive">
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>{error || "Failed to load"}</span>
          </div>
        ) : data ? (
          <>
            <div className="text-2xl font-bold">
              {data.current.toLocaleString()} / {data.limit.toLocaleString()}
            </div>
            {/* Apply color classes if needed directly, assuming default indicator styling otherwise */}
            <Progress
              value={percentage}
              className={`mt-2 h-2`} // Removed indicatorColorClass here
              aria-label={`${percentage.toFixed(0)}% ${title} Usage`}
            />
            <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(2)}% of your monthly quota</p>
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
  const supabase = createClient(); // Initialize Supabase client
  const [user, setUser] = useState<any>(null); // State for user session
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true); // Separate loading for auth

  const [usageData, setUsageData] = useState<AllUsageData>({
    links: null,
    forms: null,
    emails: null,
    landingPages: null,
  });
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true); // Loading for API data
  const [errors, setErrors] = useState<UsageErrors>({
    links: null,
    forms: null,
    emails: null,
    landingPages: null,
  });

  // Effect 1: Fetch User Session on Mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsAuthLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null); // Set user or null
      } catch (error: any) {
        console.error("Error fetching user session:", error);
        setUser(null); // Ensure user is null on error
        // Optionally set a specific auth error state here
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, [supabase]); // Dependency on supabase client instance

  // Effect 2: Fetch API Data once User is available (or determined to be null)
  useEffect(() => {
    // Only proceed if auth check is complete
    if (isAuthLoading) {
      return; // Wait for user session fetch to finish
    }

    // Function to fetch data for a single stat and return { current, limit }
    const fetchStatCount = async (
      endpoint: string,
      limit: number,
      dataPath?: string,
      userId?: string // Add optional userId parameter
    ): Promise<UsageStatValue> => {
      // Append userId as query param if provided
      const url = userId ? `${endpoint}?user_id=${encodeURIComponent(userId)}` : endpoint;

      const response = await fetch(url);
      if (!response.ok) {
        let errorMsg = `Request failed: ${response.status} on ${url}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (e) {
          /* Ignore */
        }
        throw new Error(errorMsg);
      }
      const jsonData = await response.json();
      const dataArray = dataPath ? jsonData?.[dataPath] : jsonData;

      if (!Array.isArray(dataArray)) {
        console.error(`Expected an array from ${url}${dataPath ? ` at path '${dataPath}'` : ""}, but received:`, dataArray);
        throw new Error(`Invalid data format received from ${endpoint.split("/").pop()}.`);
      }
      return { current: dataArray.length, limit: limit };
    };

    // Function to fetch all stats concurrently
    const fetchAllStats = async () => {
      setIsDataLoading(true); // Start data loading
      setErrors({ links: null, forms: null, emails: null, landingPages: null });

      // Prepare promises, passing user.id only for the email fetch
      const promises = [
        fetchStatCount(API_ENDPOINTS.links, USAGE_LIMITS.links, "data"),
        fetchStatCount(API_ENDPOINTS.forms, USAGE_LIMITS.forms),
        fetchStatCount(API_ENDPOINTS.emails, USAGE_LIMITS.emails, undefined, user?.id), // Pass user.id here
        fetchStatCount(API_ENDPOINTS.landingPages, USAGE_LIMITS.landingPages),
      ];

      // Execute all promises
      const results = await Promise.allSettled(promises);

      // Process results
      setUsageData({
        links: results[0].status === "fulfilled" ? results[0].value : null,
        forms: results[1].status === "fulfilled" ? results[1].value : null,
        emails: results[2].status === "fulfilled" ? results[2].value : null,
        landingPages: results[3].status === "fulfilled" ? results[3].value : null,
      });

      setErrors({
        links: results[0].status === "rejected" ? results[0].reason?.message : null,
        forms: results[1].status === "rejected" ? results[1].reason?.message : null,
        // If user was required but null, set a specific error for emails
        emails: results[2].status === "rejected" ? results[2].reason?.message : !user?.id ? "User ID missing" : null,
        landingPages: results[3].status === "rejected" ? results[3].reason?.message : null,
      });

      setIsDataLoading(false); // Finish data loading
    };

    fetchAllStats(); // Call the fetch function
  }, [user, isAuthLoading]); // Re-run this effect if user or isAuthLoading changes

  // --- Combined Loading State ---
  // Show loading skeletons if either auth check or data fetch is in progress
  const showLoadingSkeletons = isAuthLoading || isDataLoading;

  if (showLoadingSkeletons) {
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

  // --- Render Cards ---
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UsageCard
        title="Links Usage"
        icon={Link2}
        iconColorClass="text-blue-600"
        bgColorClass="bg-blue-100/50"
        data={usageData.links}
        error={errors.links}
      />
      <UsageCard
        title="Forms Usage"
        icon={FileText}
        iconColorClass="text-orange-600"
        bgColorClass="bg-orange-100/50"
        data={usageData.forms}
        error={errors.forms}
      />
      <UsageCard
        title="Emails Usage"
        icon={Mail}
        iconColorClass="text-purple-600"
        bgColorClass="bg-purple-100/50"
        data={usageData.emails}
        error={errors.emails} // Will show "User ID missing" if applicable
      />
      <UsageCard
        title="Landing Page Usage"
        icon={Globe}
        iconColorClass="text-green-600"
        bgColorClass="bg-green-100/50"
        data={usageData.landingPages}
        error={errors.landingPages}
      />
    </div>
  );
}
