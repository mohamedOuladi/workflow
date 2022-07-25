import { PluginX } from '../types';
import { Action, ActionTypes } from './types';

export const addPlugin = (plugin: PluginX): Action => ({
    type: ActionTypes.ADD_PLUGIN,
    payload: plugin
});

export const updatePluginCoordinates = (id: number, x: number, y: number): Action => ({
    type: ActionTypes.UPDATE_PLUGIN_COORDINATES,
    payload: { id, x, y }
});

export const loadState = (state: PluginX[]): Action => ({
    type: ActionTypes.LOAD_STATE,
    payload: state
});