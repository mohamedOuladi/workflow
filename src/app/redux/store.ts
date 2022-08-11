import { Injectable } from "@angular/core";
import { ImmutableBehaviorSubject } from "immutable-rxjs";
import { stateReducer } from "./reducers/state-reducers";
import { Action, State } from "./types";

@Injectable({ providedIn: 'root' })
export class Store {
    private state$$ = new ImmutableBehaviorSubject<State>({ nodes: [], links: [], selection: [] });
    public state$ = this.state$$.asObservable();

    history = {
        past: [] as State[],
        future: [] as State[]
    }

    public get state() {
        return this.state$$.getValue();
    }

    public dispatch(action: Action) {
        const oldState = this.state$$.getValue();
        const newState = stateReducer(this.state$$.value, action);

        // very simple implementation of state diff check
        // TODO: implement a more sophisticated state diff check
        if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
            this.state$$.next(newState);
            this.history.past.push(oldState);
            this.history.future = [];
        }
    }

    public undo() {
        const oldState = this.history.past.pop();
        if (oldState) {
            this.state$$.next(oldState);
            this.history.future.push(this.state$$.getValue());
        }
    }

    public redo() {
        const newState = this.history.future.pop();
        if (newState) {
            this.state$$.next(newState);
            this.history.past.push(this.state$$.getValue());
        }
    }
    
}