import React, { useState } from "react";
import { BioElement, StyleProps } from "@/app/types/links/types";
import { Trash2 } from "lucide-react";

interface SubscribeElementProps {
  element: BioElement;
  styles: StyleProps;
  updateElement: (id: string, updated: Partial<BioElement>) => void;
  deleteElement: (id: string) => void;
}

export default function SubscribeElement({ element, styles, updateElement, deleteElement }: SubscribeElementProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setSubmitting(true);
    try {
      // Replace with real API call
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "",
          email,
          sourceType: "link",
          sourceId: element.id,
          createdAt: new Date().toISOString(),
          status: "pending",
        }),
      });
      setEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative group my-4 p-4 rounded border shadow bg-white text-center">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitting}
        className="w-full mb-2 p-2 border rounded"
        style={{ borderColor: styles.buttonColor, color: styles.textColor }}
      />
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full p-2 rounded"
        style={{ backgroundColor: styles.buttonColor, color: styles.buttonTextColor, opacity: submitting ? 0.6 : 1 }}>
        {submitting ? "Submitting..." : "Subscribe"}
      </button>
      <button
        onClick={() => deleteElement(element.id)}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100"
        aria-label="Delete Subscribe">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
