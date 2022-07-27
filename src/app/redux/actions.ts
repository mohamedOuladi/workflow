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

export const startLink = (sourceId: number, x1: number, y1: number): Action => ({
    type: ActionTypes.START_LINK,
    payload: { sourceId, x1, y1 }
});

export const finishLink = (targetId: number, x: number, y: number, id = -1,): Action => ({
    type: ActionTypes.FINISH_LINK,
    payload: { id, targetId, x, y }
});

export const cancelLink = (id = -1): Action => ({
    type: ActionTypes.CANCEL_LINK,
    payload: id
});

export const moveLink = (x: number, y: number, id = -1): Action => ({
    type: ActionTypes.MOVE_LINK,
    payload: { id, x, y }
});