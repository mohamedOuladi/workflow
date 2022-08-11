import { Link } from "../../types";
import { Action, ActionTypes } from "../types";

let linkId = 1; // latest link id

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
            })

        case ActionTypes.DISCONNECT_LINK:
            const link4 = links.find(c => c.id === action.payload)!;
            link4.targetId = undefined;
            return [...links];

        case ActionTypes.DELETE_NODES:
            return links.filter(c => !action.payload.includes(c.sourceId) && !action.payload.includes(c.targetId));

        default:
            return links;
    }
}
