"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailEditor() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSaveDraft = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/email-drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
        }),
      });

      if (!response.ok) throw new Error("Failed to save draft");

      alert("Draft saved!");
      router.push("/dashboard/email");
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Email Editor</h2>

      <input
        type="text"
        placeholder="Email Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <textarea
        placeholder="Write your email here..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full p-3 border rounded mb-4"
        rows={8}
      />

      <button
        onClick={handleSaveDraft}
        disabled={isSaving}
        className={`px-4 py-2 ${isSaving ? "bg-gray-500" : "bg-green-500"} text-white rounded`}
      >
        {isSaving ? "Saving..." : "Save Draft"}
      </button>
    </div>
  );
}
