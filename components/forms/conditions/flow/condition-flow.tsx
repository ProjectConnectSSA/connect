"use client";

import { useCallback } from "react";
import ReactFlow, { Background, Controls, Edge, Node, NodeProps, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";
import { PageNode } from "./page-node";
import { ConditionNode } from "./condition-node";
import { buildNodesAndEdges } from "./flow-utils";

const nodeTypes = {
  pageNode: PageNode,
  conditionNode: ConditionNode,
};

interface ConditionFlowProps {
  form: any;
  setForm: (form: any) => void;
}

export function ConditionFlow({ form, setForm }: ConditionFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onInit = useCallback(() => {
    const { nodes: initialNodes, edges: initialEdges } = buildNodesAndEdges(form);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [form, setNodes, setEdges]);

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: any) => {
      const updatedPages = form.pages.map((page: any) => {
        if (page.id === nodeId) {
          return {
            ...page,
            ...data,
          };
        }
        return page;
      });

      setForm({
        ...form,
        pages: updatedPages,
      });
    },
    [form, setForm]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        className="bg-muted/10">
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
