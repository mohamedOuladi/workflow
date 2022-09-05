import { State } from "../types";

export function orderGraphNodes(graph: State) {
    const nodes = graph.nodes.slice();
    const links = graph.links.slice();

    const res = [nodes[0]];
    const queue = [nodes[0]];
    const visited = new Map<number, boolean>([[nodes[0].id!, true]]);

    while (queue.length > 0) {
        const node = queue.shift()!;

        const outgoingLinks = links.filter((l) => l.sourceId === node.id);
        for (const link of outgoingLinks) {
            const targetNode = nodes.find((n) => n.id === link.targetId)!;
            if (!visited.get(targetNode.id!)) {
                queue.push(targetNode);
                res.push(targetNode);
                visited.set(targetNode.id!, true);
            }
        }

        const incomingLinks = links.filter((l) => l.targetId === node.id);
        for (const link of incomingLinks) {
            const sourceNode = nodes.find((n) => n.id === link.sourceId)!;
            if (!visited.get(sourceNode.id!)) {
                queue.push(sourceNode);
                res.unshift(sourceNode);
                visited.set(sourceNode.id!, true);
            }
        }
    }

    console.log(res.map(n => n.name));

    return res;
}