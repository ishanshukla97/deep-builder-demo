export const buildGraph = (nodes: any): Array<[string, string]> => {
    const edges: Array<[string, string]> = [];

    for (const node of nodes) {
        if (!node.id) { return edges; }

        for (const edgeEntry of node.edges) {
            edges.push([node.id, edgeEntry]);
        }
    }

    return edges;
}