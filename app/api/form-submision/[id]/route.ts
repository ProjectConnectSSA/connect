import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

// GET Request Handler
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id: formId } = context.params;

    // Validate the form ID
    if (!formId) {
      return NextResponse.json({ error: "Form ID is required." }, { status: 400 });
    }

    // Fetch submissions for the given form ID
    const { data, error } = await supabase
      .from("Submissions")
      .select("*") // Adjust columns based on your schema
      .eq("form_id", formId);

    if (error) {
      throw new Error(error.message);
    }

    // Parse the response JSON
    const submissions = data?.map((submission) => ({
      ...submission,
      response: JSON.parse(submission.response), // Parse the response field
    }));

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Request Handler
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id: formId } = context.params;
    const body = await req.json();
    const { response } = body;

    // Validate the request body
    if (!formId || !response || typeof response !== "object") {
      return NextResponse.json({ error: "Invalid request. Form ID and response are required." }, { status: 400 });
    }

    // Insert the response into the database
    const { error } = await supabase.from("Submissions").insert([
      {
        form_id: formId,
        response: JSON.stringify(response.responses), // Convert response to JSON
        meta: JSON.stringify(response.meta),
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: "Response submitted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error submitting response:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
