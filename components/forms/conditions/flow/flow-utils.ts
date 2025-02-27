import { Edge, Node } from "reactflow";

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

// Helper function to find page and element titles
const findPageById = (pages: Page[], id: string): Page | undefined => {
  return pages.find((page) => page.id === id);
};

const findElementById = (pages: Page[], pageId: string, elementId: string): Element | undefined => {
  const page = findPageById(pages, pageId);
  return page?.elements.find((element) => element.id === elementId);
};

// Function to create a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const buildNodesAndEdges = (form: Form, onAddCondition?: (pageId: string, elementId: string) => void) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add page nodes
  form.pages.forEach((page, index) => {
    const pageNode: Node = {
      id: page.id,
      type: "pageNode",
      position: { x: index * 250, y: 0 }, // Simple positioning logic
      data: {
        id: page.id,
        label: page.title,
        pageNumber: index + 1,
        elementsCount: page.elements.length,
        elements: page.elements,
        onAddCondition: onAddCondition,
      },
    };
    nodes.push(pageNode);
  });

  // Add condition nodes and edges
  if (form.conditions && form.conditions.length > 0) {
    form.conditions.forEach((condition, index) => {
      const sourcePage = findPageById(form.pages, condition.sourcePageId);
      const targetPage = findPageById(form.pages, condition.targetPageId);
      const element = findElementById(form.pages, condition.sourcePageId, condition.elementId);

      // Condition node
      const conditionNodeId = `condition-${condition.id}`;
      const conditionNode: Node = {
        id: conditionNodeId,
        type: "conditionNode",
        position: { x: index * 250, y: 150 }, // Position conditions below pages
        data: {
          label: `Condition ${index + 1}`,
          condition,
          sourcePageTitle: sourcePage?.title,
          targetPageTitle: targetPage?.title,
          elementTitle: element?.title,
        },
      };
      nodes.push(conditionNode);

      // Edge from source page to condition
      const sourceEdge: Edge = {
        id: `edge-${condition.sourcePageId}-${conditionNodeId}`,
        source: condition.sourcePageId,
        target: conditionNodeId,
        animated: true,
        style: { stroke: "#6366f1" },
      };
      edges.push(sourceEdge);

      // Edge from condition to target page
      const targetEdge: Edge = {
        id: `edge-${conditionNodeId}-${condition.targetPageId}`,
        source: conditionNodeId,
        target: condition.targetPageId,
        animated: true,
        style: { stroke: "#8b5cf6" },
      };
      edges.push(targetEdge);
    });
  }

  // Add direct edges between consecutive pages if there are no conditions
  if (!form.conditions || form.conditions.length === 0) {
    for (let i = 0; i < form.pages.length - 1; i++) {
      const edge: Edge = {
        id: `edge-${form.pages[i].id}-${form.pages[i + 1].id}`,
        source: form.pages[i].id,
        target: form.pages[i + 1].id,
        style: { stroke: "#3b82f6" },
      };
      edges.push(edge);
    }
  }

  return { nodes, edges };
};

// Helper function to create a new condition
export const createNewCondition = (sourcePageId: string, elementId: string, form: Form): Form => {
  const newCondition: Condition = {
    id: generateId(),
    sourcePageId,
    elementId,
    operator: "eq", // Default operator
    value: "", // Empty default value
    targetPageId: form.pages[0].id, // Default to first page, can be updated
  };

  return {
    ...form,
    conditions: [...(form.conditions || []), newCondition],
  };
};
