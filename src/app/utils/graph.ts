import { State } from "../types";

/**
 * Flatten a state tree into a list of nodes by priority order
 * @param graph State graph with nodes and links
 * @returns ordered list of nodes
 */
export function orderGraphNodes(graph: State) {
    const nodes = graph.nodes.slice();
    const links = graph.links.slice();

    const res = [nodes[0]];
    // console.log('----orderGraph-----');
    // console.log(res);
    const queue = [nodes[0]];
    nodes.splice(0, 1);

    while (queue.length > 0) {
        const node = queue.shift()!;

        const outLinks = links.filter((l) => l.sourceId === node.id);
        for (const link of outLinks) {
            const targetNode = nodes.find((n) => n.id === link.targetId);
            if (targetNode) {
                queue.push(targetNode);
                res.splice(res.indexOf(node) + 1, 0, targetNode);
                nodes.splice(nodes.indexOf(targetNode), 1);
            }
            links.splice(links.indexOf(link), 1);
        }

        const inLinks = links.filter((l) => l.targetId === node.id);
        for (const link of inLinks) {
            const sourceNode = nodes.find((n) => n.id === link.sourceId);
            if (sourceNode) {
                queue.push(sourceNode);
                res.splice(res.indexOf(node), 0, sourceNode);
                nodes.splice(nodes.indexOf(sourceNode), 1);
            }
            links.splice(links.indexOf(link), 1);
        }

        if (queue.length === 0 && nodes.length > 0) {
            queue.push(nodes[0]);
            res.push(nodes[0]);
            nodes.splice(0, 1);
        }
    }

    return res;
}