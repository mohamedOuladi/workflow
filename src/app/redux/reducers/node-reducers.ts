import { NodeX } from "../../types";
import { Action, ActionTypes } from "../types";

let nodeId = 1; // latest node id

export function nodeReducer(nodes: NodeX[] = [], action: Action): NodeX[] {
    switch (action.type) {

        case ActionTypes.ADD_NODE:
            const newNode = { ...action.payload, id: nodeId++ };
            return [...nodes, newNode];

        case ActionTypes.DELETE_NODES:
            return nodes.filter(p => !action.payload.includes(p.id));

        case ActionTypes.LOAD_STATE:
            nodeId = (action.payload.nodes as NodeX[]).reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
            return action.payload.nodes;

        case ActionTypes.UPDATE_SELECTION:
            return nodes.map(p => {
                p.selected = action.payload.includes(p.id);
                return p;
            });

        case ActionTypes.UPDATE_NODES_POSITION:
            return nodes.map(p => {
                const node = action.payload.find((q:NodeX) => q.id === p.id);
                if (node) {
                    p.x = node.x;
                    p.y = node.y;
                }
                return p;
            }).filter(p => p.x !== undefined && p.y !== undefined);

        default:
            return nodes;
    }
}
