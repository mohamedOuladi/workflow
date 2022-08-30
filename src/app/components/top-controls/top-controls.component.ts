import { Component } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss'],
})
export class TopControlsComponent {
  constructor(private graphService: GraphService) {}

  remove() {
    this.graphService.deleteNodes();
  }

  copy() {
    this.graphService.duplicateNodes();
  }
}
