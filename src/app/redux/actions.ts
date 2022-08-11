import { NodeX } from '../types';
import { Action, ActionTypes, State } from './types';

export const addNode = (node: NodeX): Action => ({ type: ActionTypes.ADD_NODE, payload: node });
export const connectLink = (id: number, targetId: number, x: number, y: number,): Action => ({ type: ActionTypes.CONNECT_LINK, payload: { id, targetId, x, y } });
export const createLink = (sourceId: number, x1: number, y1: number): Action => ({ type: ActionTypes.CREATE_LINK, payload: { sourceId, x1, y1 } });
export const deleteNodes = (ids: number[]): Action => ({ type: ActionTypes.DELETE_NODES, payload: ids });
export const destroyLink = (id: number): Action => ({ type: ActionTypes.DESTROY_LINK, payload: id });
export const disconnectLink = (id: number): Action => ({ type: ActionTypes.DISCONNECT_LINK, payload: id });
export const expandNode = (id: number): Action => ({ type: ActionTypes.EXPAND_NODE, payload: id });
export const loadState = (state: State): Action => ({ type: ActionTypes.LOAD_STATE, payload: state });
export const moveNodesBy = (dx: number, dy: number, ids: number[]): Action => ({ type: ActionTypes.MOVE_NODES_BY, payload: { dx, dy, ids } });
export const updateSelection = (ids: number[]): Action => ({ type: ActionTypes.UPDATE_SELECTION, payload: ids });