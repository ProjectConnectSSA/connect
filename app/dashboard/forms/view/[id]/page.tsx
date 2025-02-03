"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Types based on your new Form schema
interface Form {
  title: string;
  description: string;
  pages: Page[];
  background?: string;
  styles?: {
    width?: string;
    height?: string;
    columns?: number;
  };
  isActive?: boolean;
  isMultiPage?: boolean;
}

interface Page {
  id: string;
  title: string;
  elements: Element[];
  background?: string;
}

interface Element {
  id: string;
  title: string;
  styles: {
    backgroundColor?: string;
    width?: string;
    height?: string;
  };
  type: string; // e.g. "text", "multipleChoice", "yesNo", "rating", etc.
  required: boolean;
  options?: string[]; // If you need for multiple choice or other custom data
}

interface ViewFormPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewFormPage({ params }: ViewFormPageProps) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const { id } = unwrappedParams;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Fetch form on mount
  useEffect(() => {
    async function fetchFormData() {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();

        // The response shape depends on your API implementation.
        // Adjust accordingly if your API structure is different.
        setForm(data || null);
        setStartTime(new Date());
      } catch (error) {
        console.error("Error fetching form data:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }
    fetchFormData();
  }, [id, router]);

  // Helper to handle user input for a specific element
  const handleElementResponse = (pageId: string, elementId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      // Use combined key "pageId_elementId" or create nested structure
      [`${pageId}_${elementId}`]: value,
    }));
  };

  // Go to previous page
  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  // Go to next page
  const handleNext = () => {
    if (form && currentPageIndex < form.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  // Submit the entire form
  const handleSubmit = async () => {
    if (!form) return;

    const endTime = new Date();
    const timeSpent = startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) + "s" : null;

    // Build response payload
    const responsePayload = {
      responses, // Key-value store of user responses
      meta: {
        status: "complete",
        completionTime: timeSpent,
        submittedAt: endTime.toISOString(),
      },
    };

    try {
      const response = await fetch(`/api/form-submision/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responsePayload }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit responses");
      }

      alert("Responses submitted successfully!");
      router.push("/thank-you");
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  // Renders a single element based on its type
  // Adjust or expand this function to handle more element types
  const renderElement = (element: Element, pageId: string) => {
    // We'll store the user response in "responses[`${pageId}_${element.id}`]"
    const existingValue = responses[`${pageId}_${element.id}`] || "";

    switch (element.type) {
      case "text":
        return (
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 border rounded-md text-lg"
            placeholder={`Enter ${element.title}...`}
            value={existingValue}
            onChange={(e) => handleElementResponse(pageId, element.id, e.target.value)}
          />
        );

      case "multipleChoice":
        // If your actual data structure for options differs, adjust accordingly
        return (
          <div className="space-y-2">
            {element.options?.map((option, idx) => (
              <button
                key={idx}
                className={`w-full p-4 rounded-md text-left text-lg transition-colors ${
                  existingValue === option ? "bg-blue-100" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleElementResponse(pageId, element.id, option)}>
                {option}
              </button>
            ))}
          </div>
        );

      case "yesNo":
        return (
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}>
            <button
              className={`flex-1 p-4 rounded-md ${existingValue === "Yes" ? "bg-green-200" : "bg-green-100 hover:bg-green-200"}`}
              onClick={() => handleElementResponse(pageId, element.id, "Yes")}>
              Yes
            </button>
            <button
              className={`flex-1 p-4 rounded-md ${existingValue === "No" ? "bg-red-200" : "bg-red-100 hover:bg-red-200"}`}
              onClick={() => handleElementResponse(pageId, element.id, "No")}>
              No
            </button>
          </motion.div>
        );

      // Add more cases (e.g., rating, image upload, etc.) as needed
      default:
        return (
          <p className="text-gray-500">
            Unsupported element type: <strong>{element.type}</strong>
          </p>
        );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div className="text-red-500">No form found or an error occurred.</div>;
  }

  // If multi-page, we show only the current page; otherwise, show all pages at once
  const pagesToRender = form.isMultiPage ? [form.pages[currentPageIndex]] : form.pages;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{form.title || "Untitled Form"}</h2>
      <p className="text-md mb-8 text-center text-gray-600">{form.description || "No description provided."}</p>

      {pagesToRender.map((page, pageIndex) => (
        <motion.div
          key={page.id}
          className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md"
          style={{
            backgroundColor: page.background || "#ffffff",
            // If you want to incorporate form.styles into each page, do so here
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}>
          <h3 className="text-xl font-semibold mb-4">{page.title || `Page ${pageIndex + 1}`}</h3>

          <div className="space-y-6">
            {page.elements.map((element) => (
              <div
                key={element.id}
                className="flex flex-col space-y-2">
                <label className="font-medium text-lg">
                  {element.title} {element.required && <span className="text-red-500">*</span>}
                </label>
                {renderElement(element, page.id)}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Navigation / Submit buttons */}
      {form.isMultiPage ? (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            disabled={currentPageIndex === 0}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <span className="text-sm text-gray-500">
            {currentPageIndex + 1} / {form.pages.length}
          </span>

          <button
            onClick={currentPageIndex === form.pages.length - 1 ? handleSubmit : handleNext}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300">
            {currentPageIndex === form.pages.length - 1 ? "Submit" : <ChevronRight className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
      ) : (
        // If single-page form, only show a submit button at the end
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
