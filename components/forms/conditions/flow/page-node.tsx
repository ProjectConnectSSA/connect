"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PageNode = memo(({ data }: NodeProps) => {
  return (
    <Card className="w-[300px]">
      <CardHeader className="p-4">
        <CardTitle className="text-sm">
          Page {data.pageNumber}: {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-xs text-muted-foreground">{data.elements?.length || 0} Elements</div>
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
