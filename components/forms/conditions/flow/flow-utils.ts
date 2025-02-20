import { Edge, Node, Position } from "reactflow";

// Define type for form and its components
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
}

// Helper to get element title
const getElementTitle = (form: Form, pageId: string, elementId: string): string => {
  const page = form.pages.find((p) => p.id === pageId);
  if (!page) return "Unknown Element";

  const element = page.elements.find((e) => e.id === elementId);
  return element?.title || "Unknown Element";
};

// Helper to get operator label
const getOperatorLabel = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    equals: "=",
    not_equals: "≠",
    contains: "contains",
    greater_than: ">",
    less_than: "<",
  };

  return operatorMap[operator] || operator;
};

export const buildNodesAndEdges = (form: Form) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!form || !form.pages) {
    return { nodes, edges };
  }

  // 1. Add page nodes
  form.pages.forEach((page, index) => {
    nodes.push({
      id: page.id,
      type: "pageNode",
      position: { x: index * 250, y: 50 },
      data: {
        label: page.title || `Page ${index + 1}`,
        pageNumber: index + 1,
        elementsCount: page.elements.length || 0,
      },
    });
  });

  // 2. Create sequential edges between pages (if no conditions)
  if (!form.conditions || form.conditions.length === 0) {
    for (let i = 0; i < form.pages.length - 1; i++) {
      edges.push({
        id: `sequential-${i}`,
        source: form.pages[i].id,
        target: form.pages[i + 1].id,
        animated: true,
        style: { stroke: "#94a3b8" },
      });
    }
  }
  // 3. Add condition nodes and edges if conditions exist
  else if (form.conditions && form.conditions.length > 0) {
    form.conditions.forEach((condition, index) => {
      // 3.1 Create condition node
      const conditionId = `condition-${condition.id}`;
      const elementTitle = getElementTitle(form, condition.sourcePageId, condition.elementId);
      const operatorLabel = getOperatorLabel(condition.operator);

      nodes.push({
        id: conditionId,
        type: "conditionNode",
        position: { x: (index + 1) * 200, y: 200 },
        data: {
          label: `${elementTitle} ${operatorLabel} ${condition.value}`,
          condition,
        },
      });

      // 3.2 Create edge from source page to condition
      edges.push({
        id: `source-to-condition-${condition.id}`,
        source: condition.sourcePageId,
        target: conditionId,
        animated: true,
        style: { stroke: "#6366f1" },
        sourceHandle: Position.Bottom,
        targetHandle: Position.Top,
      });

      // 3.3 Create edge from condition to target page
      edges.push({
        id: `condition-to-target-${condition.id}`,
        source: conditionId,
        target: condition.targetPageId,
        animated: true,
        style: { stroke: "#10b981" },
        sourceHandle: Position.Bottom,
        targetHandle: Position.Top,
      });
    });
  }

  return { nodes, edges };
};
