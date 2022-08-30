import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const demoFlow = {
	"name": "echo-argo",
	"driver": "argo",
	"inputs": {
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
		"hello1": "hello kevin"
	},
	"steps": {
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
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  baseUrl = 'https://compute.scb-ncats.io/compute/plugins';
  constructor(private http: HttpClient) { }

  runWorkflow(workflow: any) {
    return this.http.post(this.baseUrl, workflow, {
      headers: {
        'accept': 'application/json',
      }
    });
  }

}
