import { Component } from '@angular/core';
import { filter } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
import { WorkflowService } from 'src/app/services/workflow.service';
import { State } from 'src/app/types';

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

const demoFlow = {
  name: 'argo-echo-test-29',
  driver: 'argo',
  inputs: {
    hello1: 'string',
  },
  outputs: {
    echoStdOut: {
      type: 'File',
      outputSource: 'echo/echoStdOut',
    },
    echoStdErr: {
      type: 'File',
      outputSource: 'echo/echoStdErr',
    },
  },
  cwlJobInputs: {
    hello1: 'hello Simo',
  },
  steps: {
    echo: {
      run: 'plugin:echo:0.0.1',
      in: {
        message: 'hello1',
      },
      out: ['echoStdOut', 'echoStdErr'],
    },
  },
};


@Component({
  selector: 'app-top-controls',
  templateUrl: './top-controls.component.html',
  styleUrls: ['./top-controls.component.scss'],
})
export class TopControlsComponent {
  state?: State;

  constructor(private graphService: GraphService, private workflowService: WorkflowService) {
    this.graphService.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
    });
  }

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

  runWorkflow() {
    demoFlow.cwlJobInputs.hello1 = this.state?.nodes[0].settings;
    this.workflowService.runWorkflow(demoFlow).subscribe(
      workflow => console.log(workflow)
    );
  }

  buildWorkflow() {
    if(this.state) {
      console.log('buildWorkflow');
      console.log(this.state);
      let res = this.workflowService.buildWorkflow(this.state);
      console.log("res");
      console.log(res);
    }
  }

  runWorkflowX() {
    console.log('runWorkflowX');
    console.log(this.state!);
    this.workflowService.runWorkflowX(this.state!).subscribe(
      workflow => console.log(workflow)
    );
  }
}
