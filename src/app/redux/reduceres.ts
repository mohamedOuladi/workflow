import { PluginX } from "../types";
import { Action, ActionTypes, State } from "./types";

let pluginId = 0;

export function pluginReducer(plugins: PluginX[] = [], action: Action): PluginX[] {
    switch (action.type) {
        case ActionTypes.ADD_PLUGIN:
            const newPlugin = { ...action.payload, id: pluginId++ };
            return [...plugins, newPlugin];
        case ActionTypes.UPDATE_PLUGIN_COORDINATES:
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

export function stateReducer(state: State, action: Action): State {
    return { ...state, plugins: pluginReducer(state.plugins, action) };
}