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
  state?: State;

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
      this.selected = {};
      this.state!.selection.forEach((id) => (this.selected[id] = true));
    });
    // this.addNodesInputs(this.state!.nodes);
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id!, !this.visibleNodesMap.get(node.id!));
  }

  save() {
    console.log(this.state);
    this.graph.updateNodesSettings(this.state!.nodes);
    console.log(this.state);
  }

  addNodesInputs(nodes: NodeX[]) {
    for (let node of nodes) {
      if(!node.settings) {
        node.settings = {};
        node.settings.inputs = {};
        let inputs = node.plugin.cwlScript.inputs;

        for (let input in inputs) {
          node.settings.inputs[input] = "";
        }
      }
    }
    this.save();
  }

  // getInputFromState(input: string, node: NodeX) {
  //   return node.settings[input];
  // }

  setSettingsVal(key: string, val: any, node: NodeX) {
    node.settings.inputs[key] = val.target.value;
  }
} 
