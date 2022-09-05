import { State } from "../types";

export function orderGraphNodes(graph: State) {
    const nodes = graph.nodes.slice();
    const links = graph.links.slice();

    let j = 0;
    const linksBySourceId = new Map<number, any>();
    const linksByTargetId = new Map<number, any>();
    links.forEach((link) => {
        j++;
        const v1 = linksBySourceId.get(link.sourceId) || [];
        v1.push(link);
        linksBySourceId.set(link.sourceId, v1);

        const v2 = linksByTargetId.get(link.targetId!) || [];
        v2.push(link);
        linksByTargetId.set(link.targetId!, v2);
    });
    const nodesMap = new Map<number, any>();
    nodes.forEach((node) => {
        j++;
        nodesMap.set(node.id!, node);
    });

    const orderedNodes = [nodes[0]];
    const queue = [nodes[0]];
    const visited = new Map<number, boolean>([[nodes[0].id!, true]]);

    while (queue.length > 0) {
        const node = queue.shift()!;
        j++;

        const outgoingLinks = linksBySourceId.get(node.id!) || [];
        for (const link of outgoingLinks) {
            const targetNode = nodesMap.get(link.targetId!)!;
            j++
            if (!visited.get(targetNode.id!)) {
                queue.push(targetNode);
                orderedNodes.push(targetNode);
                visited.set(targetNode.id!, true);
            }
        }

        const incomingLinks = linksByTargetId.get(node.id!) || [];
        for (const link of incomingLinks) {
            const sourceNode = nodesMap.get(link.sourceId!)!;
            j++
            if (!visited.get(sourceNode.id!)) {
                queue.push(sourceNode);
                orderedNodes.unshift(sourceNode);
                visited.set(sourceNode.id!, true);
            }
        }
    }

    console.log(j)
    console.log(orderedNodes.map(n => n.name));

    return orderedNodes;
}