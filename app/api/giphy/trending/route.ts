import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "24", 10);

  // Calculate offset based on page and perPage
  const offset = (page - 1) * perPage;

  try {
    const apiKey = process.env.GIPHY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GIPHY API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${perPage}&offset=${offset}&rating=g`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from GIPHY");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending GIFs" },
      { status: 500 }
    );
  }
}
