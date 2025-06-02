import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Keep for compatibility with existing code
import { GoogleGenAI } from "@google/genai"; // Add new import

// Configuration for API providers
const LM_STUDIO_URL =
  process.env.LM_STUDIO_URL || "http://localhost:1234/v1/chat/completions";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_TOKENS = 4000;
const TEMPERATURE = 0.7;

// Helper function to build the system prompt - keep existing implementation
function buildPrompt(userPrompt: string): string {
  // Your existing prompt building function
  return `Create a visually appealing landing page based on this description: "${userPrompt}"Add commentMore actions

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

    // Try Gemini API first
    if (GEMINI_API_KEY) {
      try {
        console.log("Attempting to generate with Gemini API");

        // Initialize using the new SDK
        const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        // Create the prompt with system instructions
        const systemPrompt = buildPrompt(prompt);

        try {
          // Call the API with the new SDK
          const response = await genai.models.generateContent({
            model: "gemini-1.5-pro", // Use the latest available model
            contents: systemPrompt,
            generationConfig: {
              temperature: TEMPERATURE,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: MAX_TOKENS,
            },
          });

          const text = response.text;

          console.log(
            "Gemini response received:",
            text.substring(0, 200) + "..."
          );

          // Extract JSON from text response
          try {
            // Clean up the response to extract the JSON part
            let cleanedContent = text.trim();

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

            console.log(
              "Cleaned JSON from Gemini:",
              cleanedContent.substring(0, 100) + "..."
            );

            // Parse the JSON response
            const landingPageData = JSON.parse(cleanedContent);
            validateAndFixLandingPageData(landingPageData);
            return NextResponse.json(landingPageData, { status: 200 });
          } catch (parseError) {
            console.error(
              "Failed to parse Gemini response as JSON:",
              parseError
            );
            console.log("Falling back to LM Studio");
            // Continue to LM Studio fallback
          }
        } catch (geminiCallError) {
          console.error("Error calling Gemini API:", geminiCallError);
          console.log("Falling back to LM Studio");
          // Continue to LM Studio fallback
        }
      } catch (geminiError) {
        console.error("Error using Gemini API:", geminiError);
        console.log("Falling back to LM Studio");
        // Continue to LM Studio fallback
      }
    } else {
      console.log("No Gemini API key found, using LM Studio directly");
    }

    // Fall back to LM Studio - keep your existing implementation
    try {
      console.log("Attempting to generate with LM Studio");
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
        throw new Error(
          `Failed to get response from LM Studio: ${response.statusText}`
        );
      }

      // Parse the LM Studio response
      const data = await response.json();

      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error("Invalid LM Studio response structure:", data);
        throw new Error("Invalid response from LM Studio");
      }

      // Extract content from the response
      const aiContent = data.choices[0].message.content;

      // Extract JSON from the content
      try {
        let cleanedContent = aiContent.trim();
        const jsonStartIndex = cleanedContent.indexOf("{");
        if (jsonStartIndex > 0) {
          cleanedContent = cleanedContent.substring(jsonStartIndex);
        }

        // Find matching closing brace
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

        const landingPageData = JSON.parse(cleanedContent);
        validateAndFixLandingPageData(landingPageData);
        return NextResponse.json(landingPageData, { status: 200 });
      } catch (error) {
        console.error("JSON extraction error:", error);
        throw new Error("Failed to extract JSON from AI response");
      }
    } catch (lmStudioError) {
      console.error("Error using LM Studio:", lmStudioError);
      throw new Error(
        "Both Gemini API and LM Studio failed to generate content"
      );
    }
  } catch (error: any) {
    console.error("Unhandled error in landing AI route:", error);
    return NextResponse.json(
      {
        error: error.message || "An internal server error occurred",
        details: "Both Gemini API and local LM Studio fallback failed.",
      },
      { status: 500 }
    );
  }
}

// Keep your existing validation function
function validateAndFixLandingPageData(data: any) {
  // Your existing validation function
  if (!data.sections || !Array.isArray(data.sections)) {
    console.warn("No sections array found, adding empty array");
    data.sections = [];
  }

  // Ensure each section has the required structure
  data.sections.forEach((section: any, index: number) => {
    if (!section.content) {
      console.warn(`Section ${index} missing content, adding empty object`);
      section.content = {};
    }

    // For hero sections, ensure they have the correct structure
    if (section.type === "hero") {
      if (!section.content.cta) {
        section.content.cta = { text: "Learn More", url: "#" };
      }
      if (!section.content.heading) {
        section.content.heading = "Welcome";
      }
      if (!section.content.subheading) {
        section.content.subheading = "Add your subheading here";
      }
      if (!section.content.image) {
        section.content.image = "";
      }
    }

    // For features sections, ensure they have items array
    if (section.type === "features") {
      if (!section.content.items || !Array.isArray(section.content.items)) {
        section.content.items = [
          {
            title: "Feature 1",
            description: "Description of feature 1",
            icon: "Zap",
          },
        ];
      }
      if (!section.content.heading) {
        section.content.heading = "Features";
      }
    }

    // For content sections, ensure they have a body property
    if (section.type === "content") {
      if (!section.content.heading) {
        section.content.heading = "Content Section";
      }
      if (!section.content.body) {
        section.content.body = "Add your content here";
      }
      if (!section.content.image) {
        section.content.image = "";
      }
      if (!section.content.alignment) {
        section.content.alignment = "left";
      }
    }

    // For footer sections, ensure they have the necessary properties
    if (section.type === "footer") {
      if (!section.content.heading) {
        section.content.heading = "Footer";
      }
      if (!section.content.companyName) {
        section.content.companyName = "Your Company";
      }
      if (!section.content.tagline) {
        section.content.tagline = "Your company tagline here";
      }
      if (!section.content.copyright) {
        section.content.copyright = `© ${new Date().getFullYear()} Your Company. All rights reserved.`;
      }
      if (!section.content.links || !Array.isArray(section.content.links)) {
        section.content.links = [
          { label: "Home", url: "#" },
          { label: "About", url: "#" },
          { label: "Contact", url: "#" },
        ];
      }
      if (
        !section.content.socialLinks ||
        !Array.isArray(section.content.socialLinks)
      ) {
        section.content.socialLinks = [
          { platform: "Twitter", url: "#", icon: "Twitter" },
          { platform: "Facebook", url: "#", icon: "Facebook" },
        ];
      }
    }
  });

  // Add minimum required sections if none exist
  if (data.sections.length === 0) {
    data.sections.push({
      id: "1",
      type: "hero",
      content: {
        heading: "Welcome",
        subheading: "This is a generated landing page",
        image: "",
        cta: { text: "Get Started", url: "#" },
      },
    });
  }

  // Ensure we have styles
  if (!data.styles) {
    data.styles = {
      theme: "modern",
      fontFamily: "Inter",
      colors: {
        primary: "#7c3aed",
        background: "#ffffff",
        text: "#1f2937",
      },
    };
  }

  return data;
}
