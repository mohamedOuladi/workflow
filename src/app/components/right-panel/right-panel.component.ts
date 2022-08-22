import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
import { NodeX, State } from 'src/app/types';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent {
  visibleNodesMap = new Map<number, boolean>();

  state?: State;

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter(x => !!x)).subscribe(state => {
      this.state = state;
    });

    // for (var n in this.state!.nodes) {
    //   this.visibleNodesMap.set(this.state!.nodes[n].id, false);
    // }
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id!, !this.visibleNodesMap.get(node.id!));
    node.selected = !!this.visibleNodesMap.get(node.id!);
    const selection = this.state!.nodes.filter(node => node.selected).map(node => node.id) as number[];
    this.graph.updateSelection(selection);
  }


}
