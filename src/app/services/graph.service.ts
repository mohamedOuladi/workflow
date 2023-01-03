import { Inject, Injectable } from '@angular/core';
import { ImmutableBehaviorSubject } from 'immutable-rxjs';
import { Link, NodeX, State } from '../types';
import { CONST, Constants } from './constants.service';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private nodeId = 1; // latest node id
  private linkId = 1; // latest link id
  private inState = { nodes: [], links: [], selection: [] } as State;
  private state$$ = new ImmutableBehaviorSubject<State>(this.inState);
  public state$ = this.state$$.asObservable();
  public get state() {
    return this.state$$.getValue();
  }

  private history = {
    past: [] as State[],
    future: [] as State[],
  };

  constructor(@Inject(CONST) private constants: Constants) {}

  public addNode(node: NodeX) {
    const newNode = { ...node, id: this.nodeId++ };
    this.inState.nodes.push(newNode);
    this.emit();
  }

  public deleteNodes() {
    const ids = this.inState.selection;
    this.inState.nodes = this.inState.nodes.filter((p) => !ids.includes(p.id!));
    this.inState.links = this.inState.links.filter((c) => !ids.includes(c.sourceId) && !ids.includes(c.targetId!));
    this.emit();
  }

  public loadState(state: State) {
    this.nodeId = state.nodes.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
    this.linkId = state.links.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
    this.inState = state;
    this.emit();
  }

  public moveNodesBy(dx: number, dy: number, ids: number[]) {
    this.inState.nodes.forEach((p) => {
      if (ids.includes(p.id!)) {
        p.x += dx;
        p.y += dy;
      }
    });

    this.inState.links.map((l) => {
      if (ids.includes(l.sourceId)) {
        l.x1 += dx;
        l.y1 += dy;
      }
      if (ids.includes(l.targetId!)) {
        l.x2 += dx;
        l.y2 += dy;
      }
    });

    this.emit();
  }

  public updateSelection(ids: number[]) {
    this.inState.nodes.forEach((p) => (p.selected = ids.includes(p.id!)));
    this.inState.selection = ids;
    this.emit();
  }

  public createLink(source: NodeX, target: NodeX) {
    this.inState.links.push({
      id: this.linkId++,
      selected: false,
      sourceId: source.id!,
      targetId: target.id!,
      x1: source.x + this.constants.nodeWidth,
      y1: source.y + this.constants.linkTopOffset,
      x2: target.x,
      y2: target.y + this.constants.linkTopOffset,
    });
    this.emit();
  }

  public destroyLink(id: number) {
    this.inState.links = id === 0 ? this.inState.links.slice(0, -1) : this.inState.links.filter((c) => c.id !== id);
    this.emit();
  }

  public updateLinkTarget(id: number, node: NodeX) {
    const link = this.inState.links.find((c) => c.id === id);
    if (link) {
      link.targetId = node.id;
      link.selected = false;
      link.x2 = node.x;
      link.y2 = node.y + this.constants.linkTopOffset;
    }
    this.emit();
  }

  updateLinkSelection(id: number) {
    this.inState.links.forEach((x) => x.id === id ? x.selected = true : x.selected = false);
    this.emit();
  }

  public expand(id: number) {
    const node = this.inState.nodes.find((c) => c.id === id);
    if (node) {
      node.expanded = !node.expanded;
      this.emit();
    }
  }

  public duplicateNodes() {
    const ids = this.inState.selection;
    const nodes = this.inState.nodes.filter((p) => ids.includes(p.id!));
    const newNodes = nodes.map((p) => ({ ...p, id: this.nodeId++ }));
    this.inState.selection = newNodes.map((p) => p.id!);
    newNodes.forEach((p) => {
      p.x += this.constants.duplicateOffset;
      p.y += this.constants.duplicateOffset;
    });
    this.inState.nodes.forEach((p) => (p.selected = this.inState.selection.includes(p.id!)));
    this.inState.nodes = [...this.inState.nodes, ...newNodes];
    this.emit();
  }

  public updateNodesSettings(nodes: NodeX[]) {
    nodes.forEach((p) => {
      const node = this.inState.nodes.find((c) => c.id === p.id);
      if (node) {
        node.settings = p.settings;
      }
    });
    this.emit();
  }

  public undo() {
    const oldState = this.history.past.pop();
    if (oldState) {
      this.inState = oldState;
      this.state$$.next(this.inState);
      this.history.future.push(this.state$$.getValue());
    }
  }

  public redo() {
    const newState = this.history.future.pop();
    if (newState) {
      this.inState = newState;
      this.state$$.next(this.inState);
      this.history.past.push(this.state$$.getValue());
    }
  }

  private emit() {
    // very simple implementation of state diff check
    // TODO: implement a more sophisticated state diff check
    const oldState = this.state$$.getValue();
    if (JSON.stringify(oldState) !== JSON.stringify(this.inState)) {
      this.state$$.next(this.inState);
      this.history.past.push(oldState);
      this.history.future = [];
    }
  }
}
