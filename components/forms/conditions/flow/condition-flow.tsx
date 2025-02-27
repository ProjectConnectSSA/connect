"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, NodeTypes, Panel, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import { PageNode } from "./page-node";
import { ConditionNode } from "./condition-node";
import { buildNodesAndEdges, createNewCondition } from "./flow-utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, RefreshCw } from "lucide-react";

const nodeTypes: NodeTypes = {
  pageNode: PageNode,
  conditionNode: ConditionNode,
};

// Define form interface
interface Element {
  id: string;
  title: string;
  type: string;
}

interface Page {
  id: string;
  title: string;
  elements: Element[];
}

interface Condition {
  id: string;
  sourcePageId: string;
  elementId: string;
  operator: string;
  value: string;
  targetPageId: string;
}

interface Form {
  pages: Page[];
  conditions?: Condition[];
  title?: string;
  description?: string;
}

// This is the inner component that uses the flow hooks
function ConditionFlowInner({ form, setForm }: { form: Form; setForm: (form: Form) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // Handler for adding a new condition
  const handleAddCondition = useCallback(
    (pageId: string, elementId: string) => {
      const updatedForm = createNewCondition(pageId, elementId, form);
      setForm(updatedForm);
    },
    [form, setForm]
  );

  const initializeFlow = useCallback(() => {
    if (!form?.pages?.length) return;

    // Debugging
    console.log("Building flow with form:", form);
    console.log("Conditions:", form.conditions || []);

    const { nodes: initialNodes, edges: initialEdges } = buildNodesAndEdges(form, handleAddCondition);
    console.log("Generated nodes:", initialNodes);
    console.log("Generated edges:", initialEdges);

    setNodes(initialNodes);
    setEdges(initialEdges);
    setTimeout(() => fitView({ padding: 0.2 }), 50);
    setIsLoaded(true);
  }, [form, setNodes, setEdges, fitView, handleAddCondition]);

  // Re-initialize when form changes (especially conditions)
  useEffect(() => {
    if (form?.pages?.length) {
      setIsLoaded(false);
    }
  }, [form?.conditions]);

  useEffect(() => {
    if (form?.pages?.length && !isLoaded) {
      initializeFlow();
    }
  }, [form, isLoaded, initializeFlow]);

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

  const handleReset = useCallback(() => {
    setIsLoaded(false);
    initializeFlow();
  }, [initializeFlow]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      className="bg-background"
      nodesDraggable
      elementsSelectable>
      <Background
        color="#ddd"
        gap={16}
        size={1}
      />
      <Controls
        showInteractive={false}
        className="bg-card border border-border shadow-md"
      />
      <MiniMap
        nodeColor={(node) => {
          return node.type === "pageNode" ? "#0284c7" : "#7c3aed";
        }}
        maskColor="rgba(240, 240, 240, 0.6)"
        className="bg-card shadow-md border border-border"
      />

      <Panel
        position="top-right"
        className="flex gap-2 p-2 bg-card/80 backdrop-blur border border-border rounded-md shadow-sm">
        <Button
          variant="outline"
          size="icon"
          onClick={() => zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fitView({ padding: 0.2 })}>
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Panel>
    </ReactFlow>
  );
}

// This is the main exported component that provides the ReactFlow context
export function ConditionFlow({ form, setForm }: { form: Form; setForm: (form: Form) => void }) {
  return (
    <div
      style={{ height: "calc(100vh - 120px)", width: "1000px" }}
      className="w-full rounded-lg border border-border shadow-sm overflow-hidden relative">
      <ReactFlowProvider>
        <ConditionFlowInner
          form={form}
          setForm={setForm}
        />
      </ReactFlowProvider>
    </div>
  );
}
