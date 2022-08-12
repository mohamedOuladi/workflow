import { Component, Input, OnInit } from '@angular/core';
import { NodeX } from 'src/app/types';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss']
})
export class RightPanelComponent implements OnInit {
  panelOpenState = false;
  @Input() nodes: NodeX[] = []; 

  constructor() { }

  ngOnInit(): void {
  }

  openPanel(node: NodeX) {
    this.panelOpenState = true;
    node.selected = true;
  }

  closePanel(node: NodeX) {
    this.panelOpenState = false;
    node.selected = false;
  }

}
