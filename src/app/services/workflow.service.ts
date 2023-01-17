import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State, Workflow } from '../types';
import { orderGraphNodes } from '../utils/graph';

const demoFlow = {
  name: 'echo-argo',
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
    hello1: 'hello kevin',
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

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  baseUrl = 'https://compute.scb-ncats.io/compute';
  wfCompilerUrl = 'http://127.0.0.1:3000/workflows';
  constructor(private http: HttpClient) {}

  runWorkflow(workflow: any): Observable<any>{
    const httpParams = new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: {}
    };
    httpOptions.params = httpParams;
    return this.http.post<any>(this.baseUrl + '/workflows',
      workflow,
      httpOptions
    );
  }

  getWorkflows() {
    return this.http.get<Workflow[]>(this.baseUrl + '/workflows');
  }

  buildWorkflow(graph: State) {
    // get list of plugins.cwlScript from compute 
    // write cwl_dirs.txt and ym_dirs.txt: either with generate-schema or manually

    // build workflow json 
    // sort steps by order of priority 
    let sortedNodes = orderGraphNodes(graph);
    let wf = { steps: [{}] };
    // let wf : { steps: [{}] } = {steps : [{}]};
    // let userTestStatus: { id: number, name: string }[];
    let keyVal: any = {};

    for (let node of sortedNodes) {
      let stepName = node.name;
      keyVal = {};
      if (node.settings) {
        // console.log('****inputs****');
        // console.log(node.settings.inputs);
        for (let key in node.settings.inputs) {
          if (node.settings.inputs[key] !== "") {
            console.log("prop not empty");
            console.log(key);
            console.log(node.settings.inputs[key]);
            // keyVal[key] = node.settings.inputs[key];
            if(key === "config") {
              keyVal[key] = JSON.parse(node.settings.inputs[key]);
            } else {
              keyVal[key] = node.settings.inputs[key];
            }
            // wf.steps.push({ [stepName]: { in: node.settings.inputs } });
          }
        }
        // console.log('keyVal');
        // console.log(keyVal);
        wf.steps.push({ [stepName]: { in: keyVal } });
        // wf.steps.push({ [stepName]: { in: node.settings.inputs } });
      }
    }

    let newWF = wf.steps.filter(value => JSON.stringify(value) !== '{}');
    // console.log('newWF');
    // console.log(newWF);
    let finalWF = {steps: newWF};
    console.log('finalWF');
    console.log(JSON.stringify(finalWF));
    return finalWF;
  }


  runWorkflowX(graph: State): Observable<any> {
    console.log('workflow service----runX');
    const httpParams = new HttpParams();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: {}
    };
    httpOptions.params = httpParams;

    let workflow = this.buildWorkflow(graph);
    console.log('********workflow*******');
    console.log(workflow);
    return this.http.post<any>(this.wfCompilerUrl,
      workflow
    );
  }

  parseObj(str: string) {
    var obj = JSON.parse(str);
    if (obj && typeof obj === "object") {
      return obj
    }
    else {
      return str
    }
  }
  
}
