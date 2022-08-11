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

        case ActionTypes.MOVE_NODES_BY:
            const { dx, dy, ids } = action.payload as { dx: number, dy: number, ids: number[] };
            return nodes.map(p => {
                if (ids.includes(p.id!)) {
                    p.x += dx;
                    p.y += dy;
                }
                return p;
            });

        default:
            return nodes;
    }
}
