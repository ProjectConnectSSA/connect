// src/components/forms/conditions/page-node.tsx (or your path)

import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { ElementType } from "@/app/types/form"; // Adjust path

interface PageNodeData {
  id: string;
  label: string;
  pageNumber: number;
  elementsCount: number;
  hasEligibleElements: boolean; // Flag if elements suitable for conditions exist
  onAddCondition?: (pageId: string) => void; // Only needs pageId now
}

interface PageNodeProps {
  data: PageNodeData;
  isConnectable: boolean;
}

export function PageNode({ data, isConnectable }: PageNodeProps) {
  const handleAddClick = () => {
    if (data.onAddCondition) {
      data.onAddCondition(data.id);
    }
  };

  return (
    <div className="p-3 rounded-lg bg-sky-50 border-2 border-sky-200 shadow hover:shadow-md transition-shadow duration-150 w-48">
      {" "}
      {/* Fixed width */}
      {/* Target Handle (Top) */}
      <Handle
        type="target"
        id="top" // Explicit ID
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-sky-500" // Use !important prefix if needed
        style={{ top: -5 }}
      />
      {/* Source Handle (Bottom) for default flow */}
      <Handle
        type="source"
        id="bottom" // Explicit ID
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-sky-500"
        style={{ bottom: -5 }}
      />
      {/* Source Handle (Right) - Optional for condition branching start */}
      <Handle
        type="source"
        id="right" // Explicit ID
        position={Position.Right}
        isConnectable={isConnectable} // Connectable for conditions
        className="w-2.5 h-2.5 !bg-indigo-500" // Different color for condition source?
        style={{ right: -5 }}
      />
      {/* Node Content */}
      <div className="flex flex-col gap-1 items-center">
        <div className="text-[10px] font-semibold text-sky-600 uppercase tracking-wider">Page {data.pageNumber}</div>
        <div
          className="text-sm font-bold text-center text-sky-900 mb-1 truncate w-full"
          title={data.label}>
          {data.label}
        </div>
        <div className="text-xs text-sky-700">
          {data.elementsCount} {data.elementsCount === 1 ? "element" : "elements"}
        </div>

        {/* Add Condition Button */}
        {data.onAddCondition && (
          <Button
            variant="outline"
            size="sm" // Use a smaller size if available or custom class
            className="text-xs bg-sky-100 hover:bg-sky-200 text-sky-800 border-sky-300 mt-2 py-1 px-2 h-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddClick}
            disabled={!data.hasEligibleElements} // Disable if no elements to base condition on
            title={!data.hasEligibleElements ? "No elements available on this page for conditions" : "Add a conditional rule"}>
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        )}
      </div>
      {/* Removed the element list dropdown */}
    </div>
  );
}
