import { ConnectionX, PluginX } from "../types";

export interface State {
    plugins: PluginX[];
    connections: ConnectionX[];
}

export interface Action {
    type: string;
    payload?: any;
}


export enum ActionTypes {
    ADD_PLUGIN = 'ADD_PLUGIN',
    MOVE_PLUGIN = "MOVE_PLUGIN",
    LOAD_STATE = "LOAD_STATE",
    START_CONNECTION = "START_CONNECTION",
    FINISH_CONNECTION = "FINISH_CONNECTION",
    CANCEL_CONNECTION = "CANCEL_CONNECTION",
    MOVE_CONNECTION = "MOVE_CONNECTION"
}
