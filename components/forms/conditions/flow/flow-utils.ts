export function buildNodesAndEdges(form: any) {
  const nodes: any[] = [];
  const edges: any[] = [];
  let nodeCount = 0;

  // Add page nodes
  form.pages.forEach((page: any, index: number) => {
    const pageNode = {
      id: page.id,
      type: "pageNode",
      position: { x: index * 400, y: 100 },
      data: {
        ...page,
        pageNumber: index + 1,
      },
    };
    nodes.push(pageNode);

    // Add condition nodes and edges
    (page.conditions || []).forEach((condition: any, condIndex: number) => {
      const conditionId = `condition-${condition.id}`;
      const sourceElement = form.pages.flatMap((p: any) => p.elements).find((el: any) => el.id === condition.elementId);

      const conditionNode = {
        id: conditionId,
        type: "conditionNode",
        position: { x: index * 400 + 200, y: 300 + condIndex * 150 },
        data: {
          ...condition,
          label: sourceElement ? sourceElement.title : "Field",
        },
      };
      nodes.push(conditionNode);

      // Edge from page to condition
      edges.push({
        id: `e-${page.id}-${conditionId}`,
        source: page.id,
        target: conditionId,
        animated: true,
        style: { stroke: "hsl(var(--primary))" },
      });

      // Edge from condition to target page
      if (condition.targetPageId) {
        edges.push({
          id: `e-${conditionId}-${condition.targetPageId}`,
          source: conditionId,
          target: condition.targetPageId,
          animated: true,
          style: { stroke: "hsl(var(--primary))" },
        });
      }
    });
  });

  return { nodes, edges };
}
