// src/components/forms/conditions/flow-utils.ts (or your path)

import { Edge, MarkerType, Node } from "reactflow";
import type { Form, Page, ElementType, Condition } from "@/app/types/form"; // Adjust path
import { v4 as uuidv4 } from "uuid"; // Use UUID for IDs

const PAGE_NODE_WIDTH = 180;
const CONDITION_NODE_WIDTH = 240;
const HORIZONTAL_SPACING = 80;
const VERTICAL_SPACING_PAGE_CONDITION = 120;
const VERTICAL_SPACING_CONDITION_PAGE = 80;
const PAGE_Y_LEVEL = 100;
const CONDITION_Y_LEVEL = PAGE_Y_LEVEL + VERTICAL_SPACING_PAGE_CONDITION;

// Helper to get elements suitable for conditions
const getEligibleElements = (page: Page | undefined): ElementType[] => {
  if (!page || !page.elements) return [];
  // Filter elements that make sense in conditions
  return page.elements.filter((el) =>
    ["text", "select", "radio", "checkbox", "date", "number", "email", "phone", "rating", "yesno"].includes(el.type)
  );
};

// Helper to find page/element data (simplified)
const findPageById = (pages: Page[], id: string): Page | undefined => pages.find((p) => p.id === id);
const findElementById = (pages: Page[], pageId: string, elementId: string): ElementType | undefined => {
  const page = findPageById(pages, pageId);
  return page?.elements.find((el) => el.id === elementId);
};

// --- Build Nodes and Edges ---
export const buildNodesAndEdges = (
  form: Form,
  onAddCondition?: (pageId: string) => void, // Changed signature
  onDeleteCondition?: (conditionId: string) => void
) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const conditions = form.conditions || [];
  let conditionCount = 0; // To stagger condition nodes

  // --- 1. Page Nodes ---
  form.pages.forEach((page, index) => {
    const xPos = index * (PAGE_NODE_WIDTH + HORIZONTAL_SPACING);
    const eligibleElements = getEligibleElements(page);

    nodes.push({
      id: page.id,
      type: "pageNode",
      position: { x: xPos, y: PAGE_Y_LEVEL },
      data: {
        id: page.id,
        label: page.title || `Page ${index + 1}`,
        pageNumber: index + 1,
        elementsCount: page.elements.length,
        hasEligibleElements: eligibleElements.length > 0, // Pass flag
        onAddCondition: form.pages.length > 1 ? onAddCondition : undefined, // Only allow adding if > 1 page
      },
    });

    // --- 2. Default Edges Between Consecutive Pages ---
    if (index < form.pages.length - 1) {
      edges.push({
        id: `e-${page.id}-to-${form.pages[index + 1].id}`,
        source: page.id,
        target: form.pages[index + 1].id,
        type: "smoothstep", // Or 'default'
        style: { stroke: "#adb5bd", strokeDasharray: "5 5" }, // Dashed gray for default flow
        markerEnd: { type: MarkerType.ArrowClosed, color: "#adb5bd" },
        zIndex: 0, // Render behind condition edges
      });
    }
  });

  // --- 3. Condition Nodes and Edges ---
  conditions.forEach((condition) => {
    const sourcePage = findPageById(form.pages, condition.sourcePageId);
    const targetPage = findPageById(form.pages, condition.targetPageId);
    const element = condition.elementId ? findElementById(form.pages, condition.sourcePageId, condition.elementId) : undefined;

    if (!sourcePage) {
      console.warn(`Condition source page ${condition.sourcePageId} not found!`);
      return; // Skip condition if source page doesn't exist
    }

    const sourcePageIndex = form.pages.findIndex((p) => p.id === sourcePage.id);

    // Basic positioning for condition nodes below their source page, staggered
    const conditionXPos =
      sourcePageIndex * (PAGE_NODE_WIDTH + HORIZONTAL_SPACING) + PAGE_NODE_WIDTH / 2 - CONDITION_NODE_WIDTH / 2 + ((conditionCount % 3) - 1) * 20; // Stagger horizontally slightly
    const conditionYPos = CONDITION_Y_LEVEL + Math.floor(conditionCount / 3) * 80; // Stagger vertically
    conditionCount++;

    const conditionNodeId = `cond-${condition.id}`;

    nodes.push({
      id: conditionNodeId,
      type: "conditionNode",
      position: { x: conditionXPos, y: conditionYPos },
      data: {
        condition,
        sourcePageTitle: sourcePage?.title,
        targetPageTitle: targetPage?.title,
        elementTitle: element?.title,
        eligibleElements: getEligibleElements(sourcePage), // Pass eligible elements for dropdown
        pages: form.pages, // Pass pages for target dropdown
        onDeleteCondition: onDeleteCondition,
        // Pass a function to update the condition directly from the node
        onUpdateCondition: (field: keyof Condition, value: string) => {
          // This function needs to be implemented in the main component and passed down
          // For now, it's just a placeholder in the data structure
          console.log(`Update condition ${condition.id}: ${field} = ${value}`);
        },
      },
    });

    // Edge: Source Page -> Condition
    edges.push({
      id: `e-${condition.sourcePageId}-to-${conditionNodeId}`,
      source: condition.sourcePageId,
      target: conditionNodeId,
      type: "smoothstep",
      sourceHandle: "bottom", // Assuming PageNode has handle 'bottom'
      targetHandle: "top", // Assuming ConditionNode has handle 'top'
      style: { stroke: "#6366f1", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
      zIndex: 1,
    });

    // Edge: Condition -> Target Page
    if (targetPage) {
      // Only add edge if target exists
      edges.push({
        id: `e-${conditionNodeId}-to-${condition.targetPageId}`,
        source: conditionNodeId,
        target: condition.targetPageId,
        type: "smoothstep",
        sourceHandle: "bottom", // Assuming ConditionNode has handle 'bottom'
        targetHandle: "top", // Assuming PageNode has handle 'top'
        style: { stroke: "#8b5cf6", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#8b5cf6" },
        zIndex: 1,
      });
    } else {
      console.warn(`Condition target page ${condition.targetPageId} not found!`);
    }
  });

  return { nodes, edges };
};

// --- Create New Condition ---
// Creates a default condition originating from a specific page
export const createDefaultCondition = (sourcePageId: string, form: Form): Condition => {
  const sourcePage = findPageById(form.pages, sourcePageId);
  const eligibleElements = getEligibleElements(sourcePage);
  const firstElementId = eligibleElements.length > 0 ? eligibleElements[0].id : null; // Default to null or first eligible

  // Default target to the next page if possible, otherwise the first page (if different)
  const sourcePageIndex = form.pages.findIndex((p) => p.id === sourcePageId);
  let targetPageId = form.pages[0]?.id || ""; // Fallback to first page ID
  if (sourcePageIndex !== -1 && sourcePageIndex < form.pages.length - 1) {
    targetPageId = form.pages[sourcePageIndex + 1].id;
  } else if (form.pages.length > 1 && form.pages[0].id !== sourcePageId) {
    targetPageId = form.pages[0].id;
  } else if (form.pages.length > 1) {
    targetPageId = form.pages[1].id; // Fallback if source is first page
  }

  return {
    id: uuidv4(), // Use UUID
    sourcePageId,
    elementId: firstElementId ?? "", // User needs to select/confirm this
    operator: "equals", // Sensible default
    value: "",
    targetPageId: targetPageId,
  };
};
