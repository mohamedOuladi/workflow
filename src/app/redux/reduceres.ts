import { Link, PluginX } from "../types";
import { Action, ActionTypes, State } from "./types";

let pluginId = 0;
let connectionId = 0;

export function pluginReducer(plugins: PluginX[] = [], action: Action): PluginX[] {
    switch (action.type) {

        case ActionTypes.ADD_PLUGIN:
            const newPlugin = { ...action.payload, id: pluginId++ };
            return [...plugins, newPlugin];

        case ActionTypes.MOVE_PLUGIN:
            const plugin = plugins.find(p => p.id === action.payload.id);
            if (plugin) {
                plugin.x = action.payload.x;
                plugin.y = action.payload.y;
            }
            return [...plugins];

        case ActionTypes.LOAD_STATE:
            pluginId = (action.payload.plugins as PluginX[]).reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
            return action.payload.plugins;

        default:
            return plugins;
    }
}

export function linkReducer(links: Link[] = [], action: Action): Link[] {
    switch (action.type) {

        case ActionTypes.LOAD_STATE:
            connectionId = (action.payload.links as Link[]).reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
            return action.payload.links;

        case ActionTypes.START_LINK:
            const { sourceId, x1, y1 } = action.payload;
            return [...links, { id: connectionId++, sourceId, x1, y1, x2: x1, y2: y1 }];

        case ActionTypes.FINISH_LINK:
            const connection = links.find(c => c.id === action.payload.id) || links[links.length - 1];
            connection.targetId = action.payload.targetId;
            connection.x2 = action.payload.x;
            connection.y2 = action.payload.y;
            return [...links];

        case ActionTypes.CANCEL_LINK:
            return action.payload === -1 ? links.slice(0, -1) : links.filter(c => c.id !== action.payload);

        case ActionTypes.MOVE_LINK_TAIL:
            const { id, x, y } = action.payload;

            const connection2 = id > -1 ? links.find(c => c.id === id) : links[links.length - 1];
            if (connection2) {
                connection2.x2 = x;
                connection2.y2 = y;
            }
            return [...links];

        case ActionTypes.MOVE_LINK_HEAD:
            const { id: id2, x: x2, y: y2 } = action.payload;
            const connection3 = links.find(c => c.id === id2)!;
            connection3.x1 = x2;
            connection3.y1 = y2;
            return [...links];

        default:
            return links;
    }
}

export function stateReducer(state: State, action: Action): State {
    return {
        plugins: pluginReducer(state.plugins, action),
        links: linkReducer(state.links, action)
    };
}