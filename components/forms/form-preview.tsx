import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormPreviewProps {
  questions?: Question[];
}

interface Question {
  id: string;
  title: string;
  type: string; // e.g., "text", "multipleChoice", "yesNo", "starRating"
  options?: string[]; // For multiple choice questions
  imageUrl?: string;
  imageAlignment?: string;
  maxRating?: number; // For star rating
  style?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

export function FormPreview({ questions = [] }: FormPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  const currentQuestion = questions[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handleStarRating = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md min-h-[300px] flex items-center justify-center">
        <p className="text-center text-gray-500">No questions available.</p>
      </div>
    );
  }

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
      <div
        className={`flex ${
          currentQuestion.imageUrl && currentQuestion.imageAlignment === "left"
            ? "flex-row"
            : currentQuestion.imageUrl && currentQuestion.imageAlignment === "right"
            ? "flex-row-reverse"
            : "flex-col"
        } items-center space-y-4 space-x-4`}>
        {currentQuestion.imageUrl && (
          <motion.div
            className="w-1/2 h-auto max-w-[300px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            <img
              src={currentQuestion.imageUrl}
              alt="Question illustration"
              className="rounded-lg shadow-sm w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          className="w-full flex flex-col items-center justify-center space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}>
          <motion.h3
            className="text-lg font-medium text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}>
            {currentQuestion.title || "Untitled Question"}
          </motion.h3>

          {currentQuestion.type === "text" && (
            <motion.input
              type="text"
              placeholder="Type your answer..."
              className="w-full p-4 border rounded-md text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            />
          )}

          {currentQuestion.type === "multipleChoice" && currentQuestion.options && (
            <motion.div
              className="flex flex-col space-y-4 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-4 bg-gray-100 hover:bg-indigo-100 rounded-md text-left text-lg transition-colors">
                  {option}
                </button>
              ))}
            </motion.div>
          )}

          {currentQuestion.type === "yesNo" && (
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}>
              <button className="flex-1 p-4 bg-green-100 hover:bg-green-200 rounded-md">Yes</button>
              <button className="flex-1 p-4 bg-red-100 hover:bg-red-200 rounded-md">No</button>
            </motion.div>
          )}

          {currentQuestion.type === "starRating" && (
            <motion.div
              className="flex justify-center items-center space-x-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}>
              {[...Array(currentQuestion.maxRating || 5)].map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleStarRating(currentQuestion.id, index + 1)}
                  className={`w-8 h-8 flex justify-center items-center rounded-full ${
                    ratings[currentQuestion.id] > index ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}>
                  ★
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
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
          onClick={handleNext}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          disabled={currentIndex === questions.length - 1}>
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </motion.div>
  );
}
