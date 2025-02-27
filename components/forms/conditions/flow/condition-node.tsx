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
  sourcePageTitle?: string;
  targetPageTitle?: string;
  elementTitle?: string;
}

interface ConditionNodeProps {
  data: ConditionData;
  isConnectable: boolean;
}

export function ConditionNode({ data, isConnectable }: ConditionNodeProps) {
  // Prepare operator for display
  const getOperatorDisplay = (operator: string) => {
    switch (operator) {
      case "eq":
        return "equals";
      case "neq":
        return "not equals";
      case "gt":
        return "greater than";
      case "lt":
        return "less than";
      case "contains":
        return "contains";
      case "startsWith":
        return "starts with";
      case "endsWith":
        return "ends with";
      case "empty":
        return "is empty";
      case "notEmpty":
        return "is not empty";
      default:
        return operator;
    }
  };

  return (
    <div className="p-3 rounded-md bg-purple-100 border-2 border-purple-300 shadow-md min-w-56">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />

      <div className="flex flex-col gap-2">
        <div className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5 w-fit">Condition</div>

        <div className="text-sm font-medium text-purple-800 mb-1">{data.label}</div>

        <div className="bg-white p-2 rounded border border-purple-200 text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <span className="font-medium text-purple-700">From:</span>
              <span className="text-purple-900">{data.sourcePageTitle || "Page " + data.condition.sourcePageId}</span>
            </div>

            <div className="flex gap-1">
              <span className="font-medium text-purple-700">Element:</span>
              <span className="text-purple-900">{data.elementTitle || data.condition.elementId}</span>
            </div>

            <div className="flex gap-1">
              <span className="font-medium text-purple-700">When:</span>
              <span className="text-purple-900">
                {getOperatorDisplay(data.condition.operator)} "{data.condition.value}"
              </span>
            </div>

            <div className="flex gap-1">
              <span className="font-medium text-purple-700">Go to:</span>
              <span className="text-purple-900">{data.targetPageTitle || "Page " + data.condition.targetPageId}</span>
            </div>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
}
