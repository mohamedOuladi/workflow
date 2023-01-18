import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
import { NodeX, State } from 'src/app/types';

type Dictionary<T> = { [key: string]: T };

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent {
  visibleNodesMap = new Map<number, boolean>();

  selected = {} as Dictionary<boolean>;
  linkSelected = false;
  state?: State;

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
      this.selected = {};
      this.state!.selection.forEach((id) => (this.selected[id] = true));
      console.log(state);
      this.state!.links.forEach((l) => {
        console.log(l);
        if (l.selected) {
          console.log(l);
          console.log('watching');
          this.linkSelected = true;
        }
      })
    });
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id!, !this.visibleNodesMap.get(node.id!));
  }

  save() {
    this.graph.updateNodesSettings(this.state!.nodes);
  }
}
