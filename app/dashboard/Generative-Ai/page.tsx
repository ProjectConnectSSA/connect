// src/components/AiGeneratorForm.tsx (renamed to AiChatInterface.tsx conceptually, but keeping file name for simplicity)
"use client";

import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar"; // Assuming you want to keep this
import { v4 as uuidv4 } from "uuid"; // For unique keys for messages

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function AiChatInterface() {
  // Renamed component function for clarity
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // For scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll whenever messages update

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) {
      setError("Please enter a message.");
      return;
    }

    const newUserMessage: ChatMessage = {
      id: uuidv4(),
      sender: "user",
      text: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setCurrentMessage(""); // Clear input field immediately
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending message to backend:", newUserMessage.text);
      // The API endpoint is still /api/generate-bio, but it's now a chat API
      const response = await fetch("/api/generative-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: newUserMessage.text }), // Send user's message as prompt
      });

      console.log("Received response status from backend:", response.status);
      const data = await response.json();

      if (!response.ok) {
        console.error("Backend API error:", data);
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      const aiResponseText = data.response; // Expecting { response: "AI text" }
      if (typeof aiResponseText !== "string") {
        throw new Error("AI response was not in the expected format.");
      }

      const newAiMessage: ChatMessage = {
        id: uuidv4(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
      console.log("Received AI response:", aiResponseText);
    } catch (err: any) {
      console.error("Error calling chat API:", err);
      setError(err.message || "An unexpected error occurred.");
      // Optionally add the error as an AI message
      const errorAiMessage: ChatMessage = {
        id: uuidv4(),
        sender: "ai",
        text: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline in textarea
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar /> {/* Keep sidebar if needed for your app structure */}
      <div className="flex flex-col flex-grow p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Chat</h2>

        {/* Chat Messages Area */}
        <div className="flex-grow bg-white border border-gray-300 rounded-lg p-4 overflow-y-auto mb-4 shadow">
          {messages.length === 0 && <p className="text-center text-gray-500">No messages yet. Start chatting!</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg max-w-md lg:max-w-xl shadow-sm ${
                  msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-500"} text-right`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Element to scroll to */}
        </div>

        {/* Error Display */}
        {error &&
          !isLoading && ( // Show error only if not loading a new message
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

        {/* Input Area */}
        <div className="flex items-center bg-white border border-gray-300 rounded-lg p-2 shadow-sm">
          <textarea
            rows={1}
            className="flex-grow p-2 border-none focus:ring-0 resize-none text-sm text-gray-700"
            placeholder="Type your message here... (Enter to send, Shift+Enter for newline)"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{ maxHeight: "100px", overflowY: "auto" }} // Prevent excessive growth
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading || !currentMessage.trim()}
            className={`ml-2 px-4 py-2 rounded-md text-white font-medium transition duration-150 ease-in-out ${
              isLoading || !currentMessage.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
