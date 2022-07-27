import { Link, PluginX } from "../types";

export interface State {
    plugins: PluginX[];
    links: Link[];
}

export interface Action {
    type: string;
    payload?: any;
}

export enum ActionTypes {
    ADD_PLUGIN = 'ADD_PLUGIN',
    MOVE_PLUGIN = "MOVE_PLUGIN",
    LOAD_STATE = "LOAD_STATE",
    CREATE_LINK = "CREATE_LINK",
    CONNECT_LINK = "CONNECT_LINK",
    DESTROY_LINK = "DESTROY_LINK",
    MOVE_LINK_TAIL = "MOVE_LINK_TAIL",
    MOVE_LINK_HEAD = "MOVE_LINK_HEAD",
    DISCONNECT_LINK = "DISCONNECT_LINK"
}
