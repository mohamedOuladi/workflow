import { Action, State } from "../types";
import { linkReducer } from "./link-reducers";
import { nodeReducer } from "./node-reducers";
import { selectionReducer } from "./selection-reducers";

export function stateReducer(state: State, action: Action): State {
    return {
        nodes: nodeReducer(state.nodes, action),
        links: linkReducer(state.links, action),
        selection: selectionReducer(state.selection, action)
    };
}