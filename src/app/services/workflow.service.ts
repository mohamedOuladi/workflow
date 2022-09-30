import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workflow } from '../types';

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
}
