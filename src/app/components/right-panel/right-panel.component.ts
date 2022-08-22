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
    for (var n in this.nodes) {
      this.visibleNodesMap.set(this.nodes[n].id, false);
    }
  }

  togglePanel(node: NodeX) {
    this.visibleNodesMap.set(node.id, !this.visibleNodesMap.get(node.id));
    node.selected = !!this.visibleNodesMap.get(node.id);
    this.nodesChange.emit(this.nodes);
  }

}
