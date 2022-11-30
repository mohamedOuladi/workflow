import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { State } from 'src/app/types';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  state?: State;
  collapsed = false;

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
    });

    this.load();
  }

  save() {
    sessionStorage.setItem('state', JSON.stringify(this.state));
  }

  load() {
    const stateStr = sessionStorage.getItem('state');
    if (stateStr) {
      const state = JSON.parse(stateStr);
      this.graph.loadState(state);
    }
  }

  reset() {
    this.graph.loadState({ nodes: [], links: [], paramLinks: [], selection: [] });
  }

  undo() {
    this.graph.undo();
  }

  redo() {
    this.graph.redo();
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
