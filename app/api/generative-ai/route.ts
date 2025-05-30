// src/app/api/generate-bio/route.ts
// Using Next.js App Router convention

import { NextResponse } from "next/server";
// No longer need BioElement types or uuid for this simple chat

// --- Configuration ---
const LM_STUDIO_URL = process.env.LM_STUDIO_URL || "http://localhost:1234/v1/chat/completions";
const MAX_TOKENS_RESPONSE = 1024; // Can be adjusted for chat response length
const AI_TEMPERATURE = 0.7;

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
          { role: "user", content: userPrompt }, // Directly use the user's prompt
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
      // Try to parse errorBody if it's JSON from LM Studio for more details
      let detailedError = errorBody;
      try {
        const parsedError = JSON.parse(errorBody);
        if (parsedError.error && parsedError.error.message) {
          detailedError = parsedError.error.message;
        }
      } catch (e) {
        /* ignore parsing error of errorBody */
      }
      throw new Error(`LM Studio request failed: ${response.statusText} (${response.status}). Details: ${detailedError}`);
    }

    const data = await response.json();
    console.log("Raw response data from LM Studio:", JSON.stringify(data, null, 2));

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Invalid response structure from LM Studio:", data);
      throw new Error("Received invalid response structure from AI model.");
    }

    const aiResponseContent = data.choices[0].message.content.trim();
    console.log("AI response content:", aiResponseContent);

    // Return the AI's text response
    return NextResponse.json({ response: aiResponseContent }, { status: 200 });
  } catch (error: any) {
    console.error("Error during AI generation:", error);
    return NextResponse.json({ error: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
