import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "24", 10);

  // Calculate offset based on page and perPage
  const offset = (page - 1) * perPage;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.GIPHY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GIPHY API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
        query
      )}&limit=${perPage}&offset=${offset}&rating=g`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from GIPHY");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching GIPHY:", error);
    return NextResponse.json(
      { error: "Failed to search GIFs" },
      { status: 500 }
    );
  }
}
