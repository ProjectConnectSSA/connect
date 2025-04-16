// src/components/links/SettingsContent.tsx
"use client";

import React from "react";

interface LinkSettingsProps {
  slug: string;
  customDomain: string | null | undefined;
  isSaving: boolean;
  isLoading: boolean;
  onSlugChange: (slug: string) => void;
  onCustomDomainChange: (domain: string) => void;
  onSave: () => void;
}

export default function LinkSettings({ slug, customDomain, isSaving, isLoading, onSlugChange, onCustomDomainChange, onSave }: LinkSettingsProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Page Settings</h2>
      {/* Slug Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Page Slug (URL Path)</label>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-1">your-app.com/p/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="flex-grow p-2 border rounded text-sm"
            placeholder="your-unique-slug"
            disabled={isSaving || isLoading}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Unique identifier. Use letters, numbers, hyphens.</p>
      </div>
      {/* Custom Domain Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">Custom Domain (Optional)</label>
        <input
          type="text"
          placeholder="yourdomain.com"
          value={customDomain || ""}
          onChange={(e) => onCustomDomainChange(e.target.value)}
          className="w-full p-2 border rounded text-sm"
          disabled={isSaving || isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">Point CNAME/A record to our server.</p>
        <p className="text-xs text-blue-600 mt-1">
          Local test: Edit hosts file (<code>127.0.0.1 mytest.local</code>) &amp; enter <code>mytest.local</code>.
        </p>
      </div>
      {/* Save Button in Settings */}
      <button
        onClick={onSave}
        disabled={isSaving || isLoading}
        className="w-full mt-6 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
        {isSaving ? "Saving..." : "Save Page Settings"}
      </button>
    </div>
  );
}
