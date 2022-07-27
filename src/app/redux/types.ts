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
    START_LINK = "START_LINK",
    FINISH_LINK = "FINISH_LINK",
    CANCEL_LINK = "CANCEL_LINK",
    MOVE_LINK_TAIL = "MOVE_LINK_TAIL",
    MOVE_LINK_HEAD = "MOVE_LINK_HEAD"
}
