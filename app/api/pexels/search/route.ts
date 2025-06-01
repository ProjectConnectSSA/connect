import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";
  const orientation = searchParams.get("orientation") || "landscape";
  const size = searchParams.get("size") || "large";
  const color = searchParams.get("color") || "";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    let url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${perPage}`;

    // Add optional parameters if provided
    if (orientation) {
      url += `&orientation=${orientation}`;
    }
    if (size) {
      url += `&size=${size}`;
    }
    if (color) {
      url += `&color=${color}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching Pexels:", error);
    return NextResponse.json(
      { error: "Failed to search images" },
      { status: 500 }
    );
  }
}
