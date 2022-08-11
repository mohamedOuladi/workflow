import { Injectable } from "@angular/core";
import { ImmutableBehaviorSubject } from "immutable-rxjs";
import { stateReducer } from "./reducers/state-reducers";
import { Action, State } from "./types";

@Injectable({ providedIn: 'root' })
export class Store {
    private state$$ = new ImmutableBehaviorSubject<State>({ nodes: [], links: [], selection: [] });
    public state$ = this.state$$.asObservable();

    public get state() {
        return this.state$$.getValue();
    }

    public dispatch(action: Action) {
        const newState = stateReducer(this.state$$.value, action);
        this.state$$.next(newState);
    }
}