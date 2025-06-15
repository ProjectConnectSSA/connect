"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LandingPreview } from "@/components/landing/landing-preview";
import { Loader2 } from "lucide-react";
import { getLandingPage } from "@/services/landingPageService";
import Head from "next/head";

const incrementVisitCount = async (landingPageId: string) => {
  try {
    const response = await fetch(`/api/landings/${landingPageId}/visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to increment visit count");
    }
  } catch (error) {
    console.error("Error tracking page visit:", error);
  }
};

export default function PublicLandingPage() {
  const params = useParams();
  const id = params?.id as string;
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Landing Page");

  useEffect(() => {
    async function fetchLandingPage() {
      try {
        setLoading(true);
        const data = await getLandingPage(id);
        setContent(data);

        // Set the page title based on the landing page title
        if (data?.title) {
          setPageTitle(data.title);
          // Update the document title
          document.title = data.title;
        }
      } catch (err: any) {
        setError(err.message || "Failed to load landing page");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLandingPage();
    }
  }, [id]);

  useEffect(() => {
    // Temporarily remove environment check for testing
    // if (process.env.NODE_ENV === "production") {
    incrementVisitCount(id);
    // }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="block mt-4 text-sm text-gray-500">
          Launchly by Shrey · Suresh · Akash
        </span>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600">{error || "Landing page not found"}</p>
      </div>
    );
  }

  return (
    <>
      <LandingPreview content={content} />
    </>
  );
}
