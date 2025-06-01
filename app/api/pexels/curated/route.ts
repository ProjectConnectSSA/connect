import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "20";

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching curated Pexels images:", error);
    return NextResponse.json(
      { error: "Failed to fetch curated images" },
      { status: 500 }
    );
  }
}
