import { Handle, Position } from "reactflow";

interface PageNodeProps {
  data: {
    label: string;
    pageNumber: number;
    elementsCount: number;
  };
  isConnectable: boolean;
}

export function PageNode({ data, isConnectable }: PageNodeProps) {
  return (
    <div className="p-4 rounded-md bg-blue-50 border-2 border-blue-200 shadow-md min-w-32">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="flex flex-col gap-1">
        <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 w-fit mb-1">Page {data.pageNumber}</div>
        <div className="text-sm font-semibold text-blue-900">{data.label}</div>
        <div className="text-xs text-blue-700">
          {data.elementsCount} {data.elementsCount === 1 ? "element" : "elements"}
        </div>
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
