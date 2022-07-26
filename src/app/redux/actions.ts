import { PluginX } from '../types';
import { Action, ActionTypes } from './types';

export const loadState = (state: PluginX[]): Action => ({
    type: ActionTypes.LOAD_STATE,
    payload: state
});

export const addPlugin = (plugin: PluginX): Action => ({
    type: ActionTypes.ADD_PLUGIN,
    payload: plugin
});

export const movePlugin = (id: number, x: number, y: number): Action => ({
    type: ActionTypes.MOVE_PLUGIN,
    payload: { id, x, y }
});

export const startConnection = (sourceId: number): Action => ({
    type: ActionTypes.START_CONNECTION,
    payload: sourceId
});

export const finishConnection = (targetId: number, id = -1): Action => ({
    type: ActionTypes.FINISH_CONNECTION,
    payload: { id, targetId }
});

export const cancelConnection = (id = -1): Action => ({
    type: ActionTypes.CANCEL_CONNECTION,
    payload: id
});