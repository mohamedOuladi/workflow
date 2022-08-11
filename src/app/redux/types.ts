import { Link, NodeX } from "../types";

export interface State {
    nodes: NodeX[];
    links: Link[];
    selection: number[];
}

export interface Action {
    type: string;
    payload?: any;
}


export enum ActionTypes {
    ADD_NODE = 'ADD_NODE',
    MOVE_NODE = "MOVE_NODE",
    LOAD_STATE = "LOAD_STATE",
    CREATE_LINK = "CREATE_LINK",
    CONNECT_LINK = "CONNECT_LINK",
    DESTROY_LINK = "DESTROY_LINK",
    MOVE_LINK_TAIL = "MOVE_LINK_TAIL",
    MOVE_LINK_HEAD = "MOVE_LINK_HEAD",
    DISCONNECT_LINK = "DISCONNECT_LINK",
    DELETE_NODES = "DELETE_NODES",
    UPDATE_SELECTION = "UPDATE_SELECTION",
    EXPAND_NODE = "EXPAND_NODE",
    MOVE_NODES_BY = "MOVE_NODES_BY"
}
