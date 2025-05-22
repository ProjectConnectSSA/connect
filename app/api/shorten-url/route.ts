import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Make the request to CleanURI API
    const response = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create shortened link: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    // CleanURI returns result_url in the response
    return NextResponse.json({ shortUrl: data.result_url });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Error shortening the link" },
      { status: 500 }
    );
  }
}
