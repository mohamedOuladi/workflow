import { PluginX } from "../types";

export interface State {
    plugins: PluginX[];
}

export interface Action {
    type: string;
    payload?: any;
}

export enum ActionTypes {
    ADD_PLUGIN = 'ADD_PLUGIN',
    UPDATE_PLUGIN_COORDINATES = "UPDATE_PLUGIN_COORDINATES"
}

