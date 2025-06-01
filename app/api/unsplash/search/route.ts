import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";
  const orientation = searchParams.get("orientation") || "landscape";
  const category = searchParams.get("category") || "";

  if (!query && !category) {
    return NextResponse.json(
      { error: "Query or category is required" },
      { status: 400 }
    );
  }

  try {
    let searchQuery = query || "";
    if (category && category !== "all") {
      searchQuery = searchQuery ? `${searchQuery},${category}` : category;
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        searchQuery
      )}&page=${page}&per_page=${perPage}&orientation=${orientation}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Unsplash");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching Unsplash:", error);
    return NextResponse.json(
      { error: "Failed to search images" },
      { status: 500 }
    );
  }
}
