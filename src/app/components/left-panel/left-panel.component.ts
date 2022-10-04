import { Component } from '@angular/core';
import { WorkflowService } from 'src/app/services/workflow.service';
import { Workflow } from 'src/app/types';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent {
  pluginsVisible = false;
  workflowsVisible = false;
  allWorkflows = [] as Workflow[];

  constructor(private workflowService: WorkflowService) {
    this.workflowService.getWorkflows().subscribe((workflows) => {
      this.allWorkflows = workflows.map((workflow) => ({
        ...workflow,
        name: workflow.name,
        icon: 'icon-lsi-workflow',
        type: 'plugin-a',
        component: PluginAComponent
      }));
    })
  }

}