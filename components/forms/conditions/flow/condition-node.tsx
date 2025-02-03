"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

export const ConditionNode = memo(({ data }: NodeProps) => {
  return (
    <Card className="w-[200px]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm font-medium">{data.label}</div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {data.operator} {data.value}
        </div>
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </Card>
  );
});
