"use client";

import React from "react";
import { Share, Eye, Save, ArrowLeftToLine } from "lucide-react"; // Use lucide-react for icons
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavbarProps {
  onSave: () => Promise<void>; // Function to call when save is clicked
  isSaving: boolean;
  pageSlug?: string; // Optional: Slug for preview link
}

export default function Navbar({ onSave, isSaving, pageSlug }: NavbarProps) {
  const router = useRouter();
  // Add props for save actions, etc. later
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className=" flex items-center font-bold text-xl text-blue-600">Link Editor</div>
          <div className="flex items-center space-x-3">
            {/* Add functionality later */}
            {pageSlug && (
              <Link
                href={`/p/${pageSlug}`}
                target="_blank"
                legacyBehavior>
                <a className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </a>
              </Link>
            )}
            <button
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Share className="mr-2 h-4 w-4" /> Share
            </button>
            <button
              onClick={() => router.push("/dashboard/links")}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <ArrowLeftToLine className="mr-2 h-4 w-4" /> Exit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
