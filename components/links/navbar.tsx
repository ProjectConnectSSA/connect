import React from "react";
import { Share, Eye, Save } from "lucide-react"; // Use lucide-react for icons

export default function Navbar() {
  // Add props for save actions, etc. later
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center font-bold text-xl text-blue-600">MyBioLink Editor</div>
          <div className="flex items-center space-x-3">
            {/* Add functionality later */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Save className="mr-2 h-4 w-4" /> Save
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Share className="mr-2 h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
