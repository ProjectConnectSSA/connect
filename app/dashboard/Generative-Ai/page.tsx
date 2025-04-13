// src/components/AiGeneratorForm.tsx (or wherever you want this UI)
"use client"; // This component needs interactivity

import { useState } from "react";
import { BioElement } from "@/app/types/links/types"; // Adjust path if needed
import DashboardSidebar from "@/components/dashboard/sidebar";

interface AiGeneratorFormProps {
  onElementsGenerated: (elements: BioElement[]) => void; // Callback to update parent state
  // Optional: Pass existing elements if you want to add/replace
  // existingElements?: BioElement[];
}

export default function AiGeneratorForm({ onElementsGenerated }: AiGeneratorFormProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawAiResponse, setRawAiResponse] = useState<string | null>(null); // For debugging

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRawAiResponse(null); // Clear previous debug info

    try {
      console.log("Sending prompt to backend:", prompt);
      const response = await fetch("/api/generative-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      console.log("Received response status from backend:", response.status);
      const data = await response.json();

      if (!response.ok) {
        console.error("Backend API error:", data);
        // If the backend sent back the raw AI response on error, store it
        if (data.rawResponse) {
          setRawAiResponse(data.rawResponse);
        }
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      // Assuming the backend returns BioElement[] on success
      const generatedElements = data as BioElement[];
      console.log("Received generated elements from backend:", generatedElements);
      onElementsGenerated(generatedElements); // Pass data to parent component
      setPrompt(""); // Optionally clear prompt on success
    } catch (err: any) {
      console.error("Error calling generation API:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="my-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Generate Form with AI</h3>
        <p className="text-sm text-gray-600 mb-3">
          Describe the elements you want (e.g., "My profile with name Jane Doe, bio 'Artist & Designer'. Add links to my portfolio example.com and
          Twitter twitter.com/janedoe"). The AI will try to create the structure.
        </p>
        <textarea
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Enter your description here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className={`mt-3 px-4 py-2 rounded-md text-white font-medium ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition duration-150 ease-in-out`}>
          {isLoading ? "Generating..." : "Generate Elements"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            <p>
              <strong>Error:</strong> {error}
            </p>
            {rawAiResponse && (
              <div className="mt-2">
                <p className="font-semibold">Raw AI Response (for debugging):</p>
                <pre className="mt-1 p-2 bg-red-50 border border-red-200 text-xs text-red-900 rounded overflow-auto whitespace-pre-wrap break-words">
                  {rawAiResponse}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
