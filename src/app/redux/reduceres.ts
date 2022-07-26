import { ConnectionX, PluginX } from "../types";
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

export function connectionReducer(connections: ConnectionX[] = [], action: Action): ConnectionX[] {
    switch (action.type) {
        
        case ActionTypes.LOAD_STATE:
            connectionId = (action.payload.connections as ConnectionX[]).reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
            return action.payload.connections;

        case ActionTypes.START_CONNECTION:
            return [...connections, { id: connectionId++, sourceId: action.payload }];

        case ActionTypes.FINISH_CONNECTION:
            const connection = connections.find(c => c.id === action.payload.id) || connections[connections.length - 1];
            connection.targetId = action.payload.targetId;
            return [...connections];
            
        case ActionTypes.CANCEL_CONNECTION:

            return action.payload === -1 ? connections.slice(0, -1) : connections.filter(c => c.id !== action.payload);
            
        default:
            return connections;
    }
}

export function stateReducer(state: State, action: Action): State {
    return {
        plugins: pluginReducer(state.plugins, action),
        connections: connectionReducer(state.connections, action)
    };
}