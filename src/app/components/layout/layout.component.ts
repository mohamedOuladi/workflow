import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { loadState, updateSelection } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { State } from 'src/app/redux/types';
import { NodeX } from 'src/app/types';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  state?: State;

  constructor(public store: Store) {
    this.store.state$.pipe(filter(x => !!x)).subscribe(state => {
      this.state = state;
    });

    this.load();
  }

  save() {
    const state = this.store.state;
    sessionStorage.setItem('state', JSON.stringify(state));
  }

  load() {
    const stateStr = sessionStorage.getItem('state');
    if (stateStr) {
      const state = JSON.parse(stateStr);
      this.store.dispatch(loadState(state));
    }
  }

  reset() {
    this.store.dispatch(loadState({"nodes":[],"links":[],"selection":[]}));
  }

  undo() {
    this.store.undo();
  }

  redo() {
    this.store.redo();
  }

  onNodesChange(nodes: NodeX[]) {
    const selection = nodes.filter(node => node.selected === true).map(node => node.id) as number[];
    this.store.dispatch(updateSelection(selection));
  }
}

