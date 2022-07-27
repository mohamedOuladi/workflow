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
            console.log(action.payload);
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

export function linkReducer(connections: Link[] = [], action: Action): Link[] {
    switch (action.type) {
        
        case ActionTypes.LOAD_STATE:
            connectionId = (action.payload.connections as Link[]).reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
            return action.payload.connections;

        case ActionTypes.START_LINK:
            const { sourceId, x1, y1 } = action.payload;
            return [...connections, { id: connectionId++, sourceId, x1, y1, x2: x1, y2: y1 }];

        case ActionTypes.FINISH_LINK:
            const connection = connections.find(c => c.id === action.payload.id) || connections[connections.length - 1];
            connection.targetId = action.payload.targetId;
            connection.x2 = action.payload.x;
            connection.y2 = action.payload.y;
            return [...connections];
            
        case ActionTypes.CANCEL_LINK:
            return action.payload === -1 ? connections.slice(0, -1) : connections.filter(c => c.id !== action.payload);
        
        case ActionTypes.MOVE_LINK:
            const { id, x, y } = action.payload;

            const connection2 = id > -1 ? connections.find(c => c.id === id) : connections[connections.length - 1];
            if (connection2) {
                connection2.x2 = x;
                connection2.y2 = y;
            }
            return [...connections];
            
        default:
            return connections;
    }
}

export function stateReducer(state: State, action: Action): State {
    return {
        plugins: pluginReducer(state.plugins, action),
        links: linkReducer(state.links, action)
    };
}