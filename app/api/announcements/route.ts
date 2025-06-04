// app/api/announcements/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Announcement } from "@/components/dashboard/widgets/AnnouncementsWidget"; // Import your type

export async function GET() {
  // Note: We call createClient() here inside the handler as cookies() from next/headers
  // can only be called from a Server Component, Route Handler, or Server Action.
  const supabase = createClient();

  try {
    const { data, error } = await (await supabase)
      .from("announcements")
      .select("id, title, description, date, type")
      .order("date", { ascending: false }); // Fetch newest first

    if (error) {
      console.error("Supabase error fetching announcements:", error);
      throw error; // Let the catch block handle it
    }

    // Transform the data to match the Announcement interface, especially the date
    const formattedAnnouncements: Announcement[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      // Format the date string as your component expects (e.g., "March 15, 2025")
      date: new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      type: item.type as Announcement["type"], // Assert the type
    }));

    return NextResponse.json(formattedAnnouncements);
  } catch (error: any) {
    console.error("API error fetching announcements:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch announcements" }, { status: 500 });
  }
}
