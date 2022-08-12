import { NodeX } from '../types';
import { Action, ActionTypes, State } from './types';

export const addNode = (node: NodeX): Action => ({ type: ActionTypes.ADD_NODE, payload: node });
export const createLink = (source: NodeX, target: NodeX): Action => ({ type: ActionTypes.CREATE_LINK, payload: { source, target } });
export const deleteNodes = (ids: number[]): Action => ({ type: ActionTypes.DELETE_NODES, payload: ids });
export const destroyLink = (id: number): Action => ({ type: ActionTypes.DESTROY_LINK, payload: id });
export const expandNode = (id: number): Action => ({ type: ActionTypes.EXPAND_NODE, payload: id });
export const loadState = (state: State): Action => ({ type: ActionTypes.LOAD_STATE, payload: state });
export const moveNodesBy = (dx: number, dy: number, ids: number[]): Action => ({ type: ActionTypes.MOVE_NODES_BY, payload: { dx, dy, ids } });
export const updateSelection = (ids: number[]): Action => ({ type: ActionTypes.UPDATE_SELECTION, payload: ids });
export const updateLinkTarget = (id: number, node: NodeX): Action => ({ type: ActionTypes.UPDATE_LINK_TARGET, payload: { id, node } });