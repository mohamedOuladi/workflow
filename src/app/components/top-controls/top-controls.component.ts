import { Component } from '@angular/core';
import { GraphService } from 'src/app/services/graph.service';
import { WorkflowService } from 'src/app/services/workflow.service';

const WF = {
  "name": "sleep-echo-argo",
  "driver": "argo",
  "inputs": {
    "sleepParam": "string",
    "hello1": "string"
  },
  "outputs": {
    "echoStdOut": {
      "type": "File",
      "outputSource": "echo/echoStdOut"
    },
    "echoStdErr": {
      "type": "File",
      "outputSource": "echo/echoStdErr"
    }
  },
  "cwlJobInputs": {
    "sleepParam1": "100",
    "sleepParam2": "10000",
    "hello1": "hello kevin"
  },
  "steps": {
    "sleep": {
      "run": "plugin:sleep:0.0.1",
      "in": {
        "sleepParam": "sleepParam1"
      },
      "out": []
    },
    "echo": {
      "run": "plugin:echo:0.0.1",
      "in": {
        "message": "hello1"
      },
      "out": [
        "echoStdOut",
        "echoStdErr"
      ]
    }
  }
};

@Component({
  selector: 'app-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss'],
})
export class TopControlsComponent {
  constructor(private graphService: GraphService, private workflowService: WorkflowService) { }

  remove() {
    this.graphService.deleteNodes();
  }

  copy() {
    this.graphService.duplicateNodes();
  }

  play() {
    this.workflowService.runWorkflow(WF).subscribe((res) => {
      console.log(res);
    });
  }
}
