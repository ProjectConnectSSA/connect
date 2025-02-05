"use client";

import React, { useState } from "react";

interface IntegrationPanelProps {
  submissions: any[];
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ submissions }) => {
  // State to track whether the user has connected their Google Sheets account.
  const [googleSheetsConnected, setGoogleSheetsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Simulate an OAuth connection flow for Google Sheets.
  const connectGoogleSheets = async () => {
    // In a real app, you would start the OAuth flow here.
    setGoogleSheetsConnected(true);
    setMessage("Google Sheets connected successfully.");
  };

  // Function to export submissions to Google Sheets.
  const exportToGoogleSheets = async () => {
    setLoading(true);
    setMessage("");
    try {
      // Call your API route that handles exporting data to Google Sheets.
      // This endpoint should be responsible for communicating with the Google Sheets API.
      const response = await fetch("/api/integrations/google-sheets/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissions }),
      });
      if (!response.ok) {
        throw new Error("Failed to export data to Google Sheets.");
      }
      setMessage("Data exported successfully to Google Sheets.");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Integrations</h1>
      <div className="space-y-2">
        {/* Google Sheets Integration */}
        <div className="border p-4 rounded-md">
          <h2 className="text-lg font-semibold">Google Sheets</h2>
          {googleSheetsConnected ? (
            <div className="mt-2">
              <p className="text-green-500 mb-2">Connected</p>
              <button
                onClick={exportToGoogleSheets}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded">
                {loading ? "Exporting..." : "Export to Google Sheets"}
              </button>
            </div>
          ) : (
            <button
              onClick={connectGoogleSheets}
              className="px-4 py-2 bg-blue-600 text-white rounded">
              Connect to Google Sheets
            </button>
          )}
        </div>

        {/* Additional integrations can be added here in a similar fashion */}
      </div>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};
