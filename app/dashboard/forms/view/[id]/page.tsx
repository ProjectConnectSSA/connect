"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  title: string;
  type: string;
  options?: string[];
  imageUrl?: string;
  imageAlignment?: string;
  maxRating?: number;
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

interface ViewFormPageProps {
  params: Promise<{ id: string }>;
}

export default function FormView({ params }: ViewFormPageProps) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null); // Track the start time
  const router = useRouter();

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    // Fetch form data when the component mounts.
    async function fetchFormData() {
      try {
        const response = await fetch(`/api/forms/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch form data");
        }
        const data = await response.json();
        setQuestions(data.question || []);
        setStartTime(new Date()); // Set the start time when form data loads
      } catch (error) {
        console.error("Error fetching form data:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    }

    fetchFormData();
  }, [id, router]);

  const handleResponseChange = (value: any) => {
    // Update the response for the current question
    if (currentQuestion) {
      setResponses((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          title: currentQuestion.title,
          type: currentQuestion.type,
          response: value,
        },
      }));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const endTime = new Date(); // Mark the end time
    const timeSpent = startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) + "s" : null;

    const responsePayload = {
      responses,
      meta: {
        status: "complete", // Mark as complete since the submit button is clicked
        completionTime: timeSpent,
        submittedAt: endTime.toISOString(),
      },
    };

    console.log("Submitting response:", responsePayload);

    try {
      const response = await fetch(`/api/form-submision/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responsePayload }),
      });

      if (!response.ok) throw new Error("Failed to submit responses");
      alert("Responses submitted successfully!");
      router.push("/thank-you");
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!questions || questions.length === 0) return <div>No questions available.</div>;

  return (
    <motion.div
      className="p-6 bg-gray-50 rounded-lg shadow-md min-h-[400px] flex flex-col justify-between"
      style={{
        backgroundColor: currentQuestion.style?.backgroundColor || "#ffffff",
        color: currentQuestion.style?.textColor || "#000000",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}>
      <h2 className="text-xl font-bold mb-4 text-center">Form Preview</h2>

      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
        {currentQuestion.imageUrl && currentQuestion.imageAlignment === "left" && (
          <motion.div
            className="flex-shrink-0 md:w-1/2 md:h-full flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            <img
              src={currentQuestion.imageUrl}
              alt="Question illustration"
              className="rounded-lg shadow-sm w-full h-auto object-cover"
            />
          </motion.div>
        )}

        <div className="flex flex-col md:w-1/2 px-4">
          <motion.h3
            className="text-lg font-medium text-center md:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}>
            {currentQuestion.title || "Untitled Question"}
          </motion.h3>

          {currentQuestion.type === "text" && (
            <motion.input
              type="text"
              placeholder="Type your answer..."
              className="w-full p-4 border rounded-md text-lg"
              onChange={(e) => handleResponseChange(e.target.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            />
          )}

          {currentQuestion.type === "multipleChoice" &&
            currentQuestion.options &&
            currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="w-full p-4 bg-gray-100 hover:bg-indigo-100 rounded-md text-left text-lg transition-colors"
                onClick={() => handleResponseChange(option)}>
                {option}
              </button>
            ))}

          {currentQuestion.type === "yesNo" && (
            <div className="flex space-x-4">
              <button
                className="flex-1 p-4 bg-green-100 hover:bg-green-200 rounded-md"
                onClick={() => handleResponseChange("Yes")}>
                Yes
              </button>
              <button
                className="flex-1 p-4 bg-red-100 hover:bg-red-200 rounded-md"
                onClick={() => handleResponseChange("No")}>
                No
              </button>
            </div>
          )}
        </div>

        {currentQuestion.imageUrl && currentQuestion.imageAlignment === "right" && (
          <motion.div
            className="flex-shrink-0 md:w-1/2 md:h-full flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            <img
              src={currentQuestion.imageUrl}
              alt="Question illustration"
              className="rounded-lg shadow-sm w-full h-auto object-cover"
            />
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentIndex === 0}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {questions.length}
        </span>
        <button
          onClick={currentIndex === questions.length - 1 ? handleSubmit : handleNext}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
          {currentIndex === questions.length - 1 ? "Submit" : <ChevronRight className="w-6 h-6 text-gray-600" />}
        </button>
      </div>
    </motion.div>
  );
}
