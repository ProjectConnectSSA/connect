import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PageNodeProps {
  data: {
    label: string;
    pageNumber: number;
    elementsCount: number;
    elements?: Array<{ id: string; title: string; type: string }>;
    onAddCondition?: (pageId: string, elementId: string) => void;
    id: string;
  };
  isConnectable: boolean;
}

export function PageNode({ data, isConnectable }: PageNodeProps) {
  const [showElementOptions, setShowElementOptions] = useState(false);

  return (
    <div className="p-4 rounded-md bg-blue-50 border-2 border-blue-200 shadow-md min-w-40">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex flex-col gap-1">
        <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 w-fit mb-1">Page {data.pageNumber}</div>

        <div className="text-sm font-semibold text-blue-900">{data.label}</div>

        <div className="text-xs text-blue-700 mb-2">
          {data.elementsCount} {data.elementsCount === 1 ? "element" : "elements"}
        </div>

        {data.onAddCondition && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 p-1 h-auto"
            onClick={() => setShowElementOptions(!showElementOptions)}>
            <PlusCircle className="h-3 w-3 mr-1" />
            {showElementOptions ? "Hide elements" : "Add condition"}
          </Button>
        )}

        {showElementOptions && data.elements && data.elements.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 bg-white p-2 rounded border border-blue-200">
            <div className="text-xs font-medium text-blue-900 mb-1">Select element:</div>
            {data.elements.map((element) => (
              <Button
                key={element.id}
                variant="ghost"
                size="sm"
                className="justify-start text-xs py-1 h-auto hover:bg-blue-100 text-blue-800"
                onClick={() => {
                  data.onAddCondition?.(data.id, element.id);
                  setShowElementOptions(false);
                }}>
                {element.title} ({element.type})
              </Button>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
}
