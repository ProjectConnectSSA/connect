// src/components/forms/conditions/condition-node.tsx (or your path)

import { Handle, Position, useReactFlow, useStoreApi } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";
import type { Condition, ElementType, Page } from "@/app/types/form"; // Adjust path

interface ConditionNodeData {
  condition: Condition;
  sourcePageTitle?: string;
  targetPageTitle?: string;
  elementTitle?: string;
  eligibleElements: ElementType[]; // Elements from source page suitable for conditions
  pages: Page[]; // All pages for target selection
  onDeleteCondition?: (conditionId: string) => void;
  // Callback to update the condition in the main form state
  onUpdateCondition: (conditionId: string, field: keyof Condition, value: string) => void;
}

interface ConditionNodeProps {
  id: string; // Node id is passed automatically
  data: ConditionNodeData;
  isConnectable: boolean;
}

export function ConditionNode({ id: nodeId, data, isConnectable }: ConditionNodeProps) {
  const { setNodes } = useReactFlow(); // Optional: for advanced updates if needed
  const store = useStoreApi();

  const { condition, eligibleElements, pages, onDeleteCondition, onUpdateCondition } = data;

  // Handle field changes and call the update callback
  const handleFieldChange = (field: keyof Condition, value: string) => {
    onUpdateCondition(condition.id, field, value);

    // Optional: Force re-render if React Flow doesn't pick up data change for labels
    // This is often not needed if parent state updates correctly
    // const { nodeInternals } = store.getState();
    // const nodes = Array.from(nodeInternals.values());
    // setNodes(nodes);
  };

  const handleDeleteClick = () => {
    if (onDeleteCondition) {
      onDeleteCondition(condition.id);
    }
  };

  // Check if selected element/target still exist
  const isElementValid = condition.elementId && eligibleElements.some((el) => el.id === condition.elementId);
  const isTargetValid = pages.some((p) => p.id === condition.targetPageId);
  const hasMissingElement = condition.elementId === null || !isElementValid; // True if element needs selection or is invalid

  // Prepare operator display names (or use a map)
  const operatorMap: Record<string, string> = {
    equals: "Equals",
    not_equals: "Not Equals",
    contains: "Contains",
    greater_than: ">",
    less_than: "<",
    is_empty: "Is Empty",
    is_not_empty: "Is Not Empty",
    // Add other operators as needed
  };
  const operatorDisplay = operatorMap[condition.operator] || condition.operator;

  return (
    <div
      className={`p-3 rounded-lg bg-purple-50 border-2 ${
        hasMissingElement || !isTargetValid ? "border-red-400" : "border-purple-200"
      } shadow hover:shadow-md transition-shadow duration-150 w-64 relative group`}>
      {" "}
      {/* Fixed width */}
      {/* Handles */}
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-purple-500"
        style={{ top: -5 }}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-purple-500"
        style={{ bottom: -5 }}
      />
      {/* Delete Button (Top Right Corner) */}
      {onDeleteCondition && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-100 opacity-50 group-hover:opacity-100 transition-opacity"
          title="Delete Condition">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
      {/* Node Content */}
      <div className="flex flex-col gap-2 text-xs">
        {/* Header */}
        <div className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider mb-1">Condition Rule</div>

        {/* Warning for invalid configuration */}
        {(hasMissingElement || !isTargetValid) && (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 p-1.5 rounded border border-red-200 text-[10px]">
            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
            <span>Configuration needed</span>
          </div>
        )}

        {/* IF: Element */}
        <div className="space-y-1">
          <Label className="text-[10px] font-medium text-gray-600">IF Element</Label>
          <Select
            value={condition.elementId ?? ""} // Use empty string for placeholder if null
            onValueChange={(val) => handleFieldChange("elementId", val)}
            disabled={eligibleElements.length === 0}>
            <SelectTrigger className={`h-8 text-xs ${hasMissingElement ? "border-red-400" : ""}`}>
              <SelectValue placeholder={eligibleElements.length === 0 ? "No eligible elements on source page" : "Select element..."} />
            </SelectTrigger>
            <SelectContent>
              {eligibleElements.map((element) => (
                <SelectItem
                  key={element.id}
                  value={element.id}
                  className="text-xs">
                  {element.title || "Untitled"} ({element.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* WHEN: Operator */}
        <div className="space-y-1">
          <Label className="text-[10px] font-medium text-gray-600">WHEN</Label>
          <Select
            value={condition.operator}
            onValueChange={(val) => handleFieldChange("operator", val)}
            disabled={hasMissingElement} // Disable if no element selected
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select operator..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(operatorMap).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="text-xs">
                  {label}
                </SelectItem>
              ))}
              {/* Add other operators manually if not in map */}
              <SelectItem
                value="is_empty"
                className="text-xs">
                Is Empty
              </SelectItem>
              <SelectItem
                value="is_not_empty"
                className="text-xs">
                Is Not Empty
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* VALUE: Input (hide for empty/not empty) */}
        {condition.operator !== "is_empty" && condition.operator !== "is_not_empty" && (
          <div className="space-y-1">
            <Label className="text-[10px] font-medium text-gray-600">Matches Value</Label>
            <Input
              value={condition.value}
              onChange={(e) => handleFieldChange("value", e.target.value)}
              placeholder="Enter value..."
              className="h-8 text-xs"
              disabled={hasMissingElement} // Disable if no element selected
            />
          </div>
        )}

        {/* THEN GO TO: Target Page */}
        <div className="space-y-1">
          <Label className="text-[10px] font-medium text-gray-600">THEN GO TO</Label>
          <Select
            value={condition.targetPageId}
            onValueChange={(val) => handleFieldChange("targetPageId", val)}>
            <SelectTrigger className={`h-8 text-xs ${!isTargetValid ? "border-red-400" : ""}`}>
              <SelectValue placeholder="Select target page..." />
            </SelectTrigger>
            <SelectContent>
              {pages.map((p, i) => (
                <SelectItem
                  key={p.id}
                  value={p.id}
                  className="text-xs">
                  Page {i + 1}: {p.title || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
