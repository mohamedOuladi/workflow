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

        case ActionTypes.DELETE_NODES:
            return links.filter(c => !action.payload.includes(c.sourceId) && !action.payload.includes(c.targetId));

        default:
            return links;
    }
}
