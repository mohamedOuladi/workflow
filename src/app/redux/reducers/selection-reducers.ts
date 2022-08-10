import { Action, ActionTypes } from "../types";

export function selectionReducer(selection: number[] = [], action: Action): number[] {
    switch (action.type) {
        case ActionTypes.UPDATE_SELECTION:
            return action.payload;
        default:
            return selection;
    }
}
