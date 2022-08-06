import { Link, NodeX } from "../types";
import { Action, ActionTypes, State } from "./types";

let nodeId = 1; // latest node id
let linkId = 1; // latest link id

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

        case ActionTypes.DELETE_NODE:
            return nodes.filter(p => p.id !== action.payload);

        case ActionTypes.LOAD_STATE:
            nodeId = (action.payload.nodes as NodeX[]).reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
            return action.payload.nodes;

        case ActionTypes.SELECT_NODE:
            return nodes.map(p => {
                if (p.id === action.payload) {
                    p.selected = true;
                }
                return p;
            });

        case ActionTypes.DESELECT_NODE:
            return nodes.map(p => {
                if (p.id === action.payload) {
                    p.selected = false;
                }
                return p;
            });

        case ActionTypes.UPDATE_SELECTION:
            return nodes.map(p => {
                p.selected = action.payload.includes(p.id);
                return p;
            });                        

        default:
            return nodes;
    }
}

export function linkReducer(links: Link[] = [], action: Action): Link[] {
    switch (action.type) {

        case ActionTypes.LOAD_STATE:
            linkId = (action.payload.links as Link[]).reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
            return action.payload.links;

        case ActionTypes.CREATE_LINK:
            const { sourceId, x1, y1 } = action.payload;
            return [...links, { id: linkId++, sourceId, x1, y1, x2: x1, y2: y1 }];

        case ActionTypes.CONNECT_LINK:
            const link = links.find(c => c.id === action.payload.id) || links[links.length - 1];
            link.targetId = action.payload.targetId;
            link.x2 = action.payload.x;
            link.y2 = action.payload.y;
            return [...links];

        case ActionTypes.DESTROY_LINK:
            return action.payload === 0 ? links.slice(0, -1) : links.filter(c => c.id !== action.payload);

        case ActionTypes.MOVE_LINK_TAIL:
            const { id, x, y } = action.payload;

            const link2 = id ? links.find(c => c.id === id) : links[links.length - 1];
            if (link2) {
                link2.x2 = x;
                link2.y2 = y;
            }
            return [...links];

        case ActionTypes.MOVE_LINK_HEAD:
            const { id: id2, x: x2, y: y2 } = action.payload;
            const link3 = links.find(c => c.id === id2)!;
            link3.x1 = x2;
            link3.y1 = y2;
            return [...links];

        case ActionTypes.DISCONNECT_LINK:
            const link4 = links.find(c => c.id === action.payload)!;
            link4.targetId = undefined;
            return [...links];

        case ActionTypes.DELETE_NODE:
            return links.filter(c => c.sourceId !== action.payload && c.targetId !== action.payload);

        default:
            return links;
    }
}

export function selectionReducer(selection: number[] = [], action: Action): number[] {
    switch (action.type) {
        case ActionTypes.UPDATE_SELECTION:
            return action.payload;
        default:
            return selection;
    }
}

export function stateReducer(state: State, action: Action): State {
    return {
        nodes: nodeReducer(state.nodes, action),
        links: linkReducer(state.links, action),
        selection: selectionReducer(state.selection, action)
    };
}