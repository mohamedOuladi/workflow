import { Injectable } from "@angular/core";
import { ImmutableBehaviorSubject } from "immutable-rxjs/dist/src/immutable-behavior-subject";
import { NodeX, State } from "../types";

@Injectable({
    providedIn: "root"
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
        future: [] as State[]
    }

    public addNode(node: NodeX) {
        const newNode = { ...node, id: this.nodeId++ };
        this.inState.nodes.push(newNode);
        this.state$$.next(this.inState);
    }

    public deleteNodes(ids: number[]) {
        this.inState.nodes = this.inState.nodes.filter(p => !ids.includes(p.id!));
        this.inState.links = this.inState.links.filter(c => !ids.includes(c.sourceId) && !ids.includes(c.targetId!));
        this.state$$.next(this.inState);
    }

    public loadState(state: State) {
        this.nodeId = state.nodes.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
        this.linkId = state.links.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
        this.inState = state;
        this.emit();
    }

    public moveNodesBy(dx: number, dy: number, ids: number[]) {
        this.inState.nodes.forEach(p => {
            if (ids.includes(p.id!)) {
                p.x += dx;
                p.y += dy;
            }
        });

        this.inState.links.map(l => {
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
        this.inState.nodes.forEach(p => p.selected = ids.includes(p.id!));
        this.inState.selection = ids;
        this.emit();
    }

    public createLink(source: NodeX, target: NodeX) {
        this.inState.links.push({
            id: this.linkId++,
            sourceId: source.id!,
            targetId: target.id!,
            x1: source.x + source.width!,
            y1: source.y + 27,
            x2: target.x,
            y2: target.y + 27
        });
        this.emit();
    }

    public destroyLink(id: number) {
        this.inState.links = id === 0 ? this.inState.links.slice(0, -1) : this.inState.links.filter(c => c.id !== id);
        this.emit();
    }

    public updateLinkTarget(id: number, node: NodeX) {
        const link = this.inState.links.find(c => c.id === id);
        if (link) {
            link.targetId = node.id;
            link.x2 = node.x;
            link.y2 = node.y + 27;
        }
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
        const oldState = this.state$$.getValue();
        const newState = this.inState;

        // very simple implementation of state diff check
        // TODO: implement a more sophisticated state diff check
        if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
            this.state$$.next(this.inState);
            this.history.past.push(oldState);
            this.history.future = [];
        }
    }

}