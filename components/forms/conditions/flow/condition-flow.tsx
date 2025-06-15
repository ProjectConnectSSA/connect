// src/components/forms/conditions/ConditionFlow.tsx (or your path)

"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { PageNode } from "./page-node";
import { ConditionNode } from "./condition-node";
import { buildNodesAndEdges, createDefaultCondition } from "./flow-utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, RefreshCw, GitBranchPlus } from "lucide-react"; // Added GitBranchPlus
import type { Form, Condition } from "@/app/types/form"; // Adjust path
import { toast } from "sonner";
import { produce } from "immer"; // Import immer

const nodeTypes: NodeTypes = {
  pageNode: PageNode,
  conditionNode: ConditionNode,
};

// Inner component using React Flow context
function ConditionFlowInner({ form, setForm }: { form: Form; setForm: (form: Form) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, zoomIn, zoomOut, getViewport } = useReactFlow();

  // --- State Update Helper ---
  const updateForm = useCallback(
    (updater: (draft: Form) => void) => {
      try {
        const nextState = produce(form, updater);
        if (nextState !== form) {
          setForm(nextState);
        }
      } catch (e) {
        console.error("Failed to update form state:", e);
        toast.error("An error occurred while updating conditions.");
      }
    },
    [form, setForm]
  );

  // --- Condition Handlers ---
  const handleAddCondition = useCallback(
    (pageId: string) => {
      updateForm((draft) => {
        const newCondition = createDefaultCondition(pageId, draft);
        if (!draft.conditions) draft.conditions = [];
        draft.conditions.push(newCondition);
      });
      toast.info("New condition rule added. Configure below.");
    },
    [updateForm]
  );

  const handleDeleteCondition = useCallback(
    (conditionId: string) => {
      updateForm((draft) => {
        draft.conditions = (draft.conditions || []).filter((c) => c.id !== conditionId);
      });
      toast.success("Condition rule removed.");
    },
    [updateForm]
  );

  const handleUpdateCondition = useCallback(
    (conditionId: string, field: keyof Condition, value: string) => {
      updateForm((draft) => {
        const conditionIndex = (draft.conditions || []).findIndex((c) => c.id === conditionId);
        if (conditionIndex !== -1 && draft.conditions) {
          // Type assertion for dynamic key assignment
          (draft.conditions[conditionIndex] as any)[field] = value;

          // If element is changed, potentially validate operator/value? (Advanced)
          // If target page is changed, ensure it's valid?
        }
      });
    },
    [updateForm]
  );

  // --- Build Nodes and Edges Memoized ---
  // Rebuild only when form pages or conditions change structure/length
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    console.log("Rebuilding nodes and edges for form:", form);
    return buildNodesAndEdges(form, handleAddCondition, handleDeleteCondition);
    // Add handleUpdateCondition if needed directly in node data later
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pages, form.conditions, handleAddCondition, handleDeleteCondition]); // Dependencies causing rebuild

  // --- Sync React Flow state with calculated nodes/edges ---
  useEffect(() => {
    console.log("Syncing flow state");
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]); // Sync when calculated values change

  // --- Fit View on Initial Load/Reset ---
  const handleLayout = useCallback(() => {
    // TODO: Implement better layout algorithm if needed (e.g., Dagre)
    // For now, just fitView
    console.log("Fitting view");
    fitView({ padding: 0.2, duration: 200 });
  }, [fitView]);

  useEffect(() => {
    // Fit view shortly after initial nodes are set
    const timer = setTimeout(() => handleLayout(), 100);
    return () => clearTimeout(timer);
  }, [initialNodes, handleLayout]); // Run when initialNodes change

  const handleResetLayout = () => {
    // Currently just fits view, replace with actual layout logic if implemented
    handleLayout();
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView // Initial fitView on mount
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      className="bg-gray-50" // Lighter background
      nodesDraggable={true} // Allow dragging
      elementsSelectable={true}
      proOptions={{ hideAttribution: true }} // Hide React Flow attribution
    >
      <Background
        color="#e0e0e0"
        gap={16}
        size={0.5}
      />
      <Controls
        showInteractive={false}
        className="bg-white border shadow-sm"
      />
      <MiniMap
        nodeColor={(node: Node) => {
          if (node.type === "pageNode") return "#3b82f6"; // Blue
          if (node.type === "conditionNode") return "#a855f7"; // Purple
          return "#6b7280"; // Gray fallback
        }}
        maskColor="rgba(240, 240, 240, 0.6)"
        className="bg-white shadow border !h-24 !w-36" // Adjust size
        pannable
        zoomable
      />

      {/* Use custom panel for better styling/positioning */}
      <div className="react-flow__panel react-flow__controls bottom-4 left-4 h-auto flex gap-1 p-1.5 bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-md">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={() => zoomIn()}
          title="Zoom In">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={() => zoomOut()}
          title="Zoom Out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6"
          onClick={handleLayout}
          title="Fit View">
          <Maximize className="h-3.5 w-3.5" />
        </Button>
        {/* Removed Reset button as it just fits view now */}
        {/* <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={handleResetLayout} title="Reset Layout">
            <RefreshCw className="h-3.5 w-3.5" />
        </Button> */}
      </div>
    </ReactFlow>
  );
}

// --- Main Exported Component ---
export function ConditionFlow({ form, setForm }: { form: Form; setForm: (form: Form) => void }) {
  // Provide a flexible height container
  return (
    <div
      // style={{ height: "600px", width: "100%" }} // Example: Fixed height
      className="w-full h-[60vh] min-h-[400px] max-h-[700px] rounded-lg border bg-card shadow-sm overflow-hidden relative" // Responsive height
    >
      <ReactFlowProvider>
        <ConditionFlowInner
          form={form}
          setForm={setForm}
        />
      </ReactFlowProvider>
    </div>
  );
}
