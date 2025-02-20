import { Handle, Position } from "reactflow";

interface ConditionData {
  label: string;
  condition: {
    id: string;
    sourcePageId: string;
    elementId: string;
    operator: string;
    value: string;
    targetPageId: string;
  };
}

interface ConditionNodeProps {
  data: ConditionData;
  isConnectable: boolean;
}

export function ConditionNode({ data, isConnectable }: ConditionNodeProps) {
  return (
    <div className="p-3 rounded-md bg-purple-100 border-2 border-purple-300 shadow-md">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />

      <div className="text-sm font-medium text-purple-800">{data.label}</div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
}
