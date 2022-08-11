import { NodeX } from "../../types";
import { Action, ActionTypes } from "../types";

let nodeId = 1; // latest node id

export function nodeReducer(nodes: NodeX[] = [], action: Action): NodeX[] {
    switch (action.type) {

        case ActionTypes.ADD_NODE:
            const newNode = { ...action.payload, id: nodeId++ };
            return [...nodes, newNode];

        case ActionTypes.MOVE_NODE:
            const node = nodes.find(p => p.id === action.payload.id);
            if (node) {
                node.x = action.payload.x;
                node.y = action.payload.y;
            }
            return [...nodes];

        case ActionTypes.MOVE_NODES_BY:
            const { dx, dy, ids } = action.payload;
            return nodes.map(node => {
                if (ids.includes(node.id)) {
                    node.x += dx;
                    node.y += dy;
                }
                return node;
            }).filter(node => node.x >= 0 && node.y >= 0);

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

        default:
            return nodes;
    }
}
