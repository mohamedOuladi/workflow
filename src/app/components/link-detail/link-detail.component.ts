import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
import { Link, NodeX, State } from 'src/app/types';

@Component({
  selector: 'app-link-detail',
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.scss']
})
export class LinkDetailComponent implements OnChanges {
  @Input() data?: Link;
  state!: State;
  sourceId!: number;
  targetId!: number;
  sourceNode!: NodeX;
  targetNode!: NodeX;
  sourceNodeToggled: boolean = false;
  targetNodeToggled: boolean = false;

  constructor(private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sourceId = changes['data'].currentValue.sourceId;
    this.targetId = changes['data'].currentValue.targetId;
    this.sourceNode = this.state.nodes.find((x) => x.id === this.sourceId)!;
    this.targetNode = this.state.nodes.find((x) => x.id === this.targetId)!;
  }

  setSettingsVal(key: string, val: any, node: NodeX) {
    node.settings.inputs[key] = val.target.value;
  }
}
