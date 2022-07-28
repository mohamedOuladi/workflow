import { NodeX } from '../types';
import { Action, ActionTypes } from './types';

export const loadState = (state: NodeX[]): Action => ({
    type: ActionTypes.LOAD_STATE,
    payload: state
});

export const addNode = (node: NodeX): Action => ({
    type: ActionTypes.ADD_NODE,
    payload: node
});

export const moveNode = (id: number, x: number, y: number): Action => ({
    type: ActionTypes.MOVE_NODE,
    payload: { id, x, y }
});

export const deleteNode = (id: number): Action => ({
    type: ActionTypes.DELETE_NODE,
    payload: id
});

export const createLink = (sourceId: number, x1: number, y1: number): Action => ({
    type: ActionTypes.CREATE_LINK,
    payload: { sourceId, x1, y1 }
});

export const connectLink = (id: number, targetId: number, x: number, y: number,): Action => ({
    type: ActionTypes.CONNECT_LINK,
    payload: { id, targetId, x, y }
});

export const destroyLink = (id: number): Action => ({
    type: ActionTypes.DESTROY_LINK,
    payload: id
});

export const moveLinkTail = (id: number, x: number, y: number): Action => ({
    type: ActionTypes.MOVE_LINK_TAIL,
    payload: { id, x, y }
});

export const moveLinkHead = (x: number, y: number, id: number): Action => ({
    type: ActionTypes.MOVE_LINK_HEAD,
    payload: { id, x, y }
});

export const disconnectLink = (id: number): Action => ({
    type: ActionTypes.DISCONNECT_LINK,
    payload: id
});

export const setNodeSize = (id: number, width: number, height: number): Action => ({
    type: ActionTypes.SET_NODE_SIZE,
    payload: { id, width, height }
});
