import { Component } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
import { Link, NodeX, State } from 'src/app/types';

type Dictionary<T> = { [key: string]: T };

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent {
  visibleNodesMap = new Map<number, boolean>();
  inputOptionalMap = new Map<string, boolean>();

  selected = {} as Dictionary<boolean>;
  state?: State;
  link?: Link;
  linkSubject = new BehaviorSubject<any>(this.link);
  linkObs  = this.linkSubject.asObservable();

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
      this.selected = {};
      this.state!.selection.forEach((id) => (this.selected[id] = true));
      this.link = this.state!.links.filter((x) => (x.selected === true))[0];
      this.linkSubject.next(this.link);
      this.setOptionalInputs();
      console.log(state);
    });
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id!, !this.visibleNodesMap.get(node.id!));
  }

  setSettingsVal(key: string, val: any, node: NodeX) {
    node.settings.inputs[key] = val.target.value;
    this.graph.updateNodesSettings(this.state!.nodes);
    console.log('state');
    console.log(this.state);
  }

  setOptionalInputs() {
    for(let node of this.state!.nodes) {
      for(let input in node.plugin.cwlScript.inputs) {
        if (node.plugin.cwlScript.inputs[input].type.includes('?')) {
          this.inputOptionalMap.set(node.name + '-' + input, true);
        } else {
          this.inputOptionalMap.set(node.name + '-' + input, false);
        }
      }
    }
  }

  save() {
    this.graph.updateNodesSettings(this.state!.nodes);
  }
}
