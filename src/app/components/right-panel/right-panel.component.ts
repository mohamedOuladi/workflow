import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NodeX } from 'src/app/types';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  @Input() nodes: NodeX[] = [];
  @Output() nodesChange = new EventEmitter<NodeX[]>();
  visibleNodesMap = new Map();

  constructor() { }

  ngOnInit(): void {
    this.setMap();
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id, !this.visibleNodesMap.get(node.id));
    if(this.visibleNodesMap.get(node.id)) {
      node.selected = true;
    } else {
      node.selected = false;
    }
    this.nodesChange.emit(this.nodes);
  }

  setMap() {
    for(var n in this.nodes){
      this.visibleNodesMap.set(this.nodes[n].id, false);
    }
  }
}
