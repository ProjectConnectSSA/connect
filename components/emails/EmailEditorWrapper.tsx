"use client";

import React, { useState } from "react";
import { EmailEditorProvider } from "easy-email-editor";
import { EmailEditor } from "easy-email-editor";
import { ExtensionProps, StandardLayout } from "easy-email-extensions";
import "easy-email-editor/lib/style.css";
import "easy-email-extensions/lib/style.css";

interface EmailEditorWrapperProps {
  initialContent?: any; // Define the type based on your content structure
  onSave?: (content: any) => void; // Callback for saving the email content
}

const EmailEditorWrapper: React.FC<EmailEditorWrapperProps> = ({
  initialContent,
  onSave,
}) => {
  const [emailContent, setEmailContent] = useState(initialContent || {});

  const handleSave = () => {
    if (onSave) {
      onSave(emailContent);
    }
  };

  return (
    <EmailEditorProvider
      data={emailContent}
      onChange={setEmailContent}
      height="100vh"
    >
      {() => (
        <StandardLayout categories={[]}>
          <EmailEditor />
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
          >
            Save Email
          </button>
        </StandardLayout>
      )}
    </EmailEditorProvider>
  );
};

export default EmailEditorWrapper;