// src/app/api/generate-bio/route.ts
// Using Next.js App Router convention

import { NextResponse } from "next/server";
// No longer need BioElement types or uuid for this simple chat

// --- Configuration ---
// Make sure your LM Studio server is running!
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || "http://localhost:1234/v1/chat/completions";
// You might need to adjust max_tokens based on the complexity you expect
const MAX_TOKENS_RESPONSE = 1024;
const AI_TEMPERATURE = 0.7; // Controls randomness (0 = deterministic, >1 = more random)

// --- Helper Function to Build the AI Prompt ---
function buildChatSystemPrompt(): string {
  // A more general prompt for a chat assistant
  return `
You are a helpful AI assistant. Respond to the user's query concisely and informatively.
Do not use markdown formatting unless explicitly part of the requested content (e.g., user asks for a code snippet).
`;
}

// --- API Route Handler ---
export async function POST(request: Request) {
  console.log("API route /api/generate-bio (now acting as chat) hit");
  let userPrompt: string;

  try {
    const body = await request.json();
    userPrompt = body.prompt;
    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
      console.error("Invalid prompt received:", userPrompt);
      return NextResponse.json({ error: "Prompt is required and must be a non-empty string." }, { status: 400 });
    }
    console.log("Received user prompt:", userPrompt);
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const systemPrompt = buildChatSystemPrompt();

  try {
    console.log("Sending request to LM Studio at:", LM_STUDIO_URL);
    const response = await fetch(LM_STUDIO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "local-model", // Model name isn't usually critical for LM Studio default endpoint
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate the bio elements based on this description: "${userPrompt}"` },
        ],
        temperature: AI_TEMPERATURE,
        max_tokens: MAX_TOKENS_RESPONSE,
        stream: false,
      }),
    });

    console.log("Received response status from LM Studio:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`LM Studio request failed with status ${response.status}:`, errorBody);
      throw new Error(`LM Studio request failed: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    console.log("Raw response data from LM Studio:", JSON.stringify(data, null, 2));

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Invalid response structure from LM Studio:", data);
      throw new Error("Received invalid response structure from AI model.");
    }

    const aiResponseContent = data.choices[0].message.content.trim();
    console.log("AI response content:", aiResponseContent);

    // --- Attempt to Parse the AI Response ---
    let generatedElements: BioElement[];
    try {
      // Sometimes the AI might still wrap the JSON in markdown, try to strip it
      const cleanJsonResponse = aiResponseContent.replace(/^```json\s*|```$/g, "").trim();
      generatedElements = JSON.parse(cleanJsonResponse);

      // --- Basic Validation and Cleanup ---
      if (!Array.isArray(generatedElements)) {
        throw new Error("AI response is not a JSON array.");
      }

      // Ensure IDs and order are present (even if AI was asked, double-check/fix)
      generatedElements = generatedElements.map((el, index) => ({
        ...el,
        id: el.id || uuidv4(), // Generate UUID if missing
        order: typeof el.order === "number" ? el.order : index, // Assign order if missing/invalid
        // Add more validation/cleanup as needed (e.g., check URL format)
      }));

      // Sort by order just in case AI didn't do it sequentially
      generatedElements.sort((a, b) => a.order - b.order);

      console.log("Successfully parsed and validated elements:", generatedElements);
      return NextResponse.json(generatedElements, { status: 200 });
    } catch (parseError: any) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw AI response that failed parsing:", aiResponseContent);
      // Return the raw response along with the error for debugging on the client
      return NextResponse.json(
        {
          error: `Failed to parse AI response: ${parseError.message}`,
          rawResponse: aiResponseContent, // Send raw response back for debugging
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error during AI generation:", error);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
