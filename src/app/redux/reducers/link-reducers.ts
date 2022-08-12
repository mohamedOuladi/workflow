import { Link, NodeX } from "../../types";
import { Action, ActionTypes } from "../types";

let linkId = 1; // latest link id

export function linkReducer(links: Link[] = [], action: Action): Link[] {
    switch (action.type) {

        case ActionTypes.LOAD_STATE:
            linkId = (action.payload.links as Link[]).reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
            return action.payload.links;

        case ActionTypes.CREATE_LINK:
            const { source, target } = action.payload as { source: NodeX, target: NodeX };
            const link1: Link = {
                id: linkId++,
                sourceId: source.id!,
                targetId: target.id!,
                x1: source.x + source.width!,
                y1: source.y + 27,
                x2: target.x,
                y2: target.y + 27
            };
            return [...links, link1];

        case ActionTypes.DESTROY_LINK:
            return action.payload === 0 ? links.slice(0, -1) : links.filter(c => c.id !== action.payload);

        case ActionTypes.MOVE_NODES_BY:
            const { dx, dy, ids } = action.payload as { dx: number, dy: number, ids: number[] };
            return links.map(l => {
                if (ids.includes(l.sourceId)) {
                    l.x1 += dx;
                    l.y1 += dy;
                }
                if (ids.includes(l.targetId!)) {
                    l.x2 += dx;
                    l.y2 += dy;
                }
                return l;
            });

        case ActionTypes.UPDATE_LINK_TARGET:
            const { id, node } = action.payload as { id: number, node: NodeX };
            return links.map(l => {
                if (l.id === action.payload.id) {
                    l.targetId = node.id;
                    l.x2 = node.x;
                    l.y2 = node.y + 27;
                }
                return l;
            });

        case ActionTypes.DELETE_NODES:
            return links.filter(c => !action.payload.includes(c.sourceId) && !action.payload.includes(c.targetId));

        default:
            return links;
    }
}
