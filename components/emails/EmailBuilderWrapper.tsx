// components/emails/EmailBuilderWrapper.tsx
"use client";

import React, { useEffect, useRef, memo } from "react";

// 🚨 CRITICAL ASSUMPTION: This code assumes "@ftw/email-builder"
// exports a function or class that can be initialized programmatically
// like this. You MUST verify this from the library's documentation or source code.
// If it only provides the `email-builder develop` command, this approach will fail.
import EmailBuilder from "@ftw/email-builder";

interface EmailBuilderWrapperProps {
  content?: any; // Define a more specific type based on the library's expected format
  onChange?: (newContent: any) => void;
}

// Using React.memo can help prevent re-renders if props are unchanged
const EmailBuilderWrapper: React.FC<EmailBuilderWrapperProps> = memo(({
  content,
  onChange,
}) => {
  const editorRef = useRef<any>(null); // To hold the editor instance
  const containerId = `email-builder-container-${React.useId()}`; // Unique ID for container

  useEffect(() => {
    let editorInstance: any = null;

    // Ensure the container div is mounted in the DOM
    const containerElement = document.getElementById(containerId);
    if (!containerElement) {
      console.error(`[EmailBuilderWrapper] Container element #${containerId} not found.`);
      // If the container isn't ready, React might re-run the effect later.
      // If it consistently fails, there's a rendering lifecycle issue.
      return;
    }

    // Initialize the editor only if it hasn't been created yet.
    if (!editorRef.current) {
      console.log(`[EmailBuilderWrapper] Initializing editor in #${containerId}...`);
      try {
        // --- This is the core initialization attempt ---
        editorInstance = EmailBuilder({
          container: `#${containerId}`, // Target the unique container
          appearance: {
            theme: "light", // Consider making this a prop
          },
          // ❓ Does the library accept initial content here?
          // Or does it need `editor.loadContent(content)` called separately?
          content: content || {}, // Pass initial content if supported
        });

        editorRef.current = editorInstance; // Store the instance in the ref

        // --- Attach change listener ---
        if (onChange && typeof editorInstance?.on === 'function') {
          console.log("[EmailBuilderWrapper] Attaching 'change' listener.");
          editorInstance.on("change", (updatedContent: any) => {
            // console.log("[EmailBuilderWrapper] Content changed:", updatedContent);
            onChange(updatedContent); // Call the passed-in handler
          });
        } else if (onChange) {
          console.warn("[EmailBuilderWrapper] onChange prop provided, but editor instance has no 'on' method.");
        }

      } catch (error) {
        console.error("[EmailBuilderWrapper] Failed to initialize EmailBuilder:", error);
        // You might want to set an error state here to show feedback in the UI
      }
    } else {
      // --- Editor already initialized ---
      // ❓ How should content updates be handled? Check the library's API.
      // Example if a method exists (you would need to call this based on prop changes):
      // if (editorRef.current.loadContent && content) {
      //   editorRef.current.loadContent(content);
      // }
      console.log("[EmailBuilderWrapper] Editor already initialized. Current logic doesn't update existing instance content via props. Check library API for an update method.");
    }

    // --- Cleanup function ---
    return () => {
      console.log("[EmailBuilderWrapper] Cleanup: Destroying editor instance...");
      // Use the instance stored in the ref for cleanup
      const currentEditor = editorRef.current;
      if (currentEditor && typeof currentEditor.destroy === 'function') {
        try {
          currentEditor.destroy();
          console.log("[EmailBuilderWrapper] Editor destroyed.");
        } catch (error) {
          console.error("[EmailBuilderWrapper] Error destroying editor:", error);
        }
      } else {
        // console.warn("[EmailBuilderWrapper] Cleanup: No editor instance found or no destroy method available.");
      }
      editorRef.current = null; // Clear the ref
    };
    // Dependencies:
    // - onChange: If the callback function identity changes, re-run to attach the new one.
    // - content: Re-running the effect when content changes is complex. The current setup
    //   doesn't automatically update the editor's content if it's already initialized.
    //   You might need a separate effect or mechanism if the editor has an update method.
    //   Keeping it here might be needed if `EmailBuilder({...})` is the only way to load content.
  }, [content, onChange, containerId]); // Include containerId as it's used in the effect

  // Render the container div that the editor will attach to
  return (
    <div id={containerId} style={{ height: "80vh", width: "100%", border: "1px solid #ccc" }} />
  );
});

EmailBuilderWrapper.displayName = 'EmailBuilderWrapper'; // Helps in React DevTools

export default EmailBuilderWrapper;