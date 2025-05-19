import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/app/actions";

export interface LandingPageData {
  id?: string;
  user_id?: string;
  title: string;
  description: string;
  sections: any[];
  styles: {
    theme: string;
    fontFamily: string;
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    spacing?: string;
    animation?: string;
    borderRadius?: string;
    darkMode?: boolean;
    responsiveImages?: boolean;
  };
  domain?: {
    subdomain: string;
    custom?: string;
    status: string;
  };
  isactive?: boolean;
}

export async function createLandingPage(landingPageData: LandingPageData) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const payload = {
      ...landingPageData,
      user_id: currentUser.id,
    };

    const response = await fetch("/api/landings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create landing page");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error creating landing page:", error);
    throw error;
  }
}

export async function updateLandingPage(
  id: string,
  landingPageData: LandingPageData
) {
  try {
    const response = await fetch("/api/landings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...landingPageData }),
    });

    if (!response.ok) {
      throw new Error("Failed to update landing page");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating landing page:", error);
    throw error;
  }
}

export async function getLandingPage(id: string) {
  try {
    const response = await fetch(`/api/landings/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch landing page");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching landing page:", error);
    throw error;
  }
}

export async function deleteLandingPage(id: string) {
  try {
    const response = await fetch("/api/landings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete landing page");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting landing page:", error);
    throw error;
  }
}
