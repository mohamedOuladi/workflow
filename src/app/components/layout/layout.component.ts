import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { State } from 'src/app/types';
import { GraphService } from 'src/app/services/graph.service';
import { PluginsService } from 'src/app/services/plugins.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  state?: State;
  collapsed = false;

  constructor(private graph: GraphService, private plugins: PluginsService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
    });

    this.load();

    this.plugins.getPlugins().subscribe((plugins) => {
      console.log(plugins);
    });
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
    this.graph.loadState({ nodes: [], links: [], selection: [] });
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
