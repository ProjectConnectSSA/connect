"use client";

import React from "react";
import { Info } from "lucide-react"; // Optional icon for info message
import { cn } from "@/lib/utils"; // For conditional classes

interface LinkSettingsProps {
  slug: string;
  customDomain: string | null | undefined;
  active: boolean;
  isSaving: boolean; // Still useful to disable inputs during global save
  isLoading: boolean; // Still useful for initial load state
  isNewPage: boolean; // Added prop
  onSlugChange: (slug: string) => void;
  onCustomDomainChange: (domain: string) => void;
  onActiveChange: (active: boolean) => void;
  // onSave removed
}

export default function LinkSettings({
  slug,
  customDomain,
  active,
  isSaving,
  isLoading,
  isNewPage, // Accept the new prop
  onSlugChange,
  onCustomDomainChange,
  onActiveChange,
}: // onSave removed
LinkSettingsProps) {
  const isDisabled = isSaving || isLoading;

  return (
    <div className="p-4 space-y-6">
      {" "}
      {/* Added space-y for better spacing */}
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Page Settings</h2>
      {/* Slug Input */}
      <div>
        <label
          htmlFor="page-slug"
          className="block text-sm font-medium mb-1 text-gray-700">
          Page Slug (URL Path)
        </label>
        <div className="flex items-center mt-1 relative">
          <span className="absolute left-0 pl-3 flex items-center pointer-events-none text-sm text-gray-500">
            your-app.com/p/ {/* Adjust domain as needed */}
          </span>
          <input
            id="page-slug"
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            // Apply conditional padding-left to avoid text overlap
            className={cn(
              "block w-full pl-[calc(theme(spacing.3)_+_115px)] pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              isDisabled && "bg-gray-100 cursor-not-allowed" // Style when disabled
            )}
            placeholder="your-unique-slug"
            disabled={isDisabled}
            aria-describedby="slug-description"
          />
        </div>
        <p
          id="slug-description"
          className="text-xs text-gray-500 mt-1">
          Unique identifier. Use letters, numbers, hyphens only.
        </p>
        {isNewPage &&
          !slug && ( // Show guidance only on new pages if slug is empty
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 flex items-start">
              <Info
                size={14}
                className="mr-1.5 mt-0.5 flex-shrink-0"
              />
              <span>Enter a unique path for your page. This cannot be easily changed after the first save.</span>
            </div>
          )}
      </div>
      {/* Custom Domain */}
      <div>
        <label
          htmlFor="custom-domain"
          className="block text-sm font-medium mb-1 text-gray-700">
          Custom Domain (Optional)
        </label>
        <input
          id="custom-domain"
          type="text"
          value={customDomain || ""}
          onChange={(e) => onCustomDomainChange(e.target.value)}
          placeholder="yourdomain.com"
          className={cn(
            "w-full p-2 border rounded text-sm border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500",
            isDisabled && "bg-gray-100 cursor-not-allowed"
          )}
          disabled={isDisabled}
          aria-describedby="domain-description"
        />
        <p
          id="domain-description"
          className="text-xs text-gray-500 mt-1">
          Point CNAME/A record to our server.{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline">
            Learn more
          </a>
          .
        </p>
        {/* Kept local test info */}
        <p className="text-xs text-gray-500 mt-1">
          Local test: Edit hosts file (<code>127.0.0.1 mytest.local</code>) & enter <code>mytest.local</code>.
        </p>
      </div>
      {/* Active Toggle */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <label
            htmlFor="page-status-toggle"
            className="text-sm font-medium text-gray-700">
            Page Status
          </label>
          <p className="text-xs text-gray-500 mt-1">Controls if the page is publicly accessible.</p>
        </div>
        <label
          htmlFor="page-status-toggle"
          className="relative inline-flex items-center cursor-pointer">
          <input
            id="page-status-toggle"
            type="checkbox"
            className="sr-only peer"
            checked={active}
            onChange={(e) => onActiveChange(e.target.checked)}
            disabled={isDisabled}
          />
          {/* Styled Toggle Switch */}
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{active ? "Active" : "Inactive"}</span>
        </label>
      </div>
      {/* Removed Save Button */}
      {/* Settings are now saved globally via the Navbar */}
    </div>
  );
}
