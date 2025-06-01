import { NextRequest, NextResponse } from "next/server";

// Configuration for LM Studio
const LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions";
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.7;

// Helper function to build the system prompt
function buildPrompt(userPrompt: string): string {
  return `Create a visually appealing landing page based on this description: "${userPrompt}"

IMPORTANT: YOU MUST RESPOND WITH ONLY VALID JSON. DO NOT INCLUDE ANY TEXT BEFORE OR AFTER THE JSON.
DO NOT ADD ANY EXPLANATIONS. DO NOT USE MARKDOWN CODE BLOCKS.
YOUR ENTIRE RESPONSE MUST BE PARSEABLE AS JSON.
DO NOT START YOUR RESPONSE WITH PHRASES LIKE "Here is a landing page design" OR "Here's the JSON".
JUST RETURN THE RAW JSON OBJECT WITH NO ADDITIONAL TEXT.

Your response MUST be a valid JSON object with exactly this structure:
{
  "title": "Page title based on the description",
  "description": "Brief description of the page",
  "sections": [
    // 3-5 sections total with appropriate mix of section types
    // Include at least one hero section (first) and one footer section (last)
    // Possible section types: "hero", "features", "content", "footer"
    {
      "id": "1",
      "type": "hero",
      "content": {
        "heading": "Main headline text",
        "subheading": "Supporting text that explains value proposition",
        "image": "", // Leave empty, will be filled with Unsplash images later
        "cta": {
          "text": "Button text",
          "url": "#"
        }
      }
    },
    // Features section example
    {
      "id": "2", 
      "type": "features",
      "content": {
        "heading": "Section heading",
        "items": [
          {
            "title": "Feature name",
            "description": "Feature description",
            "icon": "Zap" // Use one of: Zap, Shield, Star, Users, Tool, etc.
          }
          // Add 2-4 more feature items
        ]
      }
    },
    // Content section example
    {
      "id": "3",
      "type": "content",
      "content": {
        "heading": "Section heading",
        "body": "Main content with paragraphs and bullet points if needed",
        "image": "", // Leave empty
        "alignment": "left" // or "right"
      }
    },
    // Footer MUST be last
    {
      "id": "last",
      "type": "footer",
      "content": {
        "heading": "Contact heading",
        "companyName": "Company name based on the description",
        "tagline": "Company slogan or tagline",
        "links": [
          {"label": "Home", "url": "#"},
          {"label": "About", "url": "#"},
          {"label": "Services", "url": "#"},
          {"label": "Contact", "url": "#"}
        ],
        "socialLinks": [
          {"platform": "Twitter", "url": "#", "icon": "Twitter"},
          {"platform": "Facebook", "url": "#", "icon": "Facebook"},
          {"platform": "Instagram", "url": "#", "icon": "Instagram"}
        ],
        "copyright": "© ${new Date().getFullYear()} Company Name. All rights reserved."
      }
    }
  ],
  "styles": {
    "theme": "modern", // Pick one: modern, minimal, bold, elegant, clean, professional
    "fontFamily": "Inter", // Pick one: Inter, Poppins, Montserrat, Roboto, etc.
    "colors": {
      "primary": "#hexcolor", // Choose an appropriate brand color
      "background": "#ffffff", // Usually white or very light color
      "text": "#1f2937" // Usually dark for readability
    }
  }
}`;
}

export async function POST(request: NextRequest) {
  try {
    // Get prompt from request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    console.log("Received landing page generation prompt:", prompt);

    // Send request to LM Studio
    try {
      const response = await fetch(LM_STUDIO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert web designer who creates landing pages in JSON format ONLY.",
            },
            {
              role: "user",
              content: buildPrompt(prompt),
            },
          ],
          model: "local-model",
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`LM Studio error (${response.status}):`, errorText);
        return NextResponse.json(
          {
            error: `Failed to get response from AI service: ${response.statusText}`,
          },
          { status: 502 }
        );
      }

      // Parse the LM Studio response
      const data = await response.json();
      console.log(
        "LM Studio response received:",
        JSON.stringify(data).substring(0, 200) + "..."
      );

      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("Invalid LM Studio response structure:", data);
        return NextResponse.json(
          { error: "Invalid response from AI service" },
          { status: 500 }
        );
      }

      // Extract content from the response
      const aiContent = data.choices[0].message.content;
      console.log("AI content excerpt:", aiContent.substring(0, 200) + "...");

      // Extract JSON from the content using a more robust approach
      try {
        // Step 1: Try to find the first occurrence of a valid JSON object
        let cleanedContent = aiContent.trim();

        // Remove any text before the first {
        const jsonStartIndex = cleanedContent.indexOf("{");
        if (jsonStartIndex > 0) {
          cleanedContent = cleanedContent.substring(jsonStartIndex);
        }

        // Find a matching closing brace
        let openBraces = 0;
        let endIndex = -1;

        for (let i = 0; i < cleanedContent.length; i++) {
          if (cleanedContent[i] === "{") openBraces++;
          if (cleanedContent[i] === "}") {
            openBraces--;
            if (openBraces === 0) {
              endIndex = i + 1;
              break;
            }
          }
        }

        if (endIndex > 0) {
          cleanedContent = cleanedContent.substring(0, endIndex);
        }

        console.log("Cleaned JSON:", cleanedContent.substring(0, 100) + "...");

        try {
          const landingPageData = JSON.parse(cleanedContent);
          return NextResponse.json(landingPageData, { status: 200 });
        } catch (parseError) {
          console.error("JSON parse error:", parseError);

          // Try an alternative approach - use regex to find the first instance of what looks like a JSON object
          const jsonRegex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
          const matches = cleanedContent.match(jsonRegex);

          if (matches && matches.length > 0) {
            try {
              const jsonCandidate = matches[0];
              const landingPageData = JSON.parse(jsonCandidate);
              return NextResponse.json(landingPageData, { status: 200 });
            } catch (nestedParseError) {
              console.error(
                "Alternative parsing also failed:",
                nestedParseError
              );
              return NextResponse.json(
                {
                  error: "Failed to parse AI response as valid JSON",
                  rawResponse: aiContent.substring(0, 1000),
                },
                { status: 500 }
              );
            }
          } else {
            return NextResponse.json(
              {
                error: "Could not extract JSON from AI response",
                rawResponse: aiContent.substring(0, 1000),
              },
              { status: 500 }
            );
          }
        }
      } catch (error) {
        console.error("JSON extraction error:", error);
        return NextResponse.json(
          {
            error: "Failed to extract JSON from AI response",
            rawResponse: aiContent.substring(0, 1000),
          },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      console.error("Error fetching from LM Studio:", fetchError);
      return NextResponse.json(
        {
          error:
            "Failed to connect to LM Studio. Is it running on your machine?",
          details: fetchError.message,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in landing AI route:", error);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
