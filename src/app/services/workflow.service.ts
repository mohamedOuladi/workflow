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
  // -H 'accept: application/json' \
  // -H 'Authorization: Bearer
  token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCIsImtpZCI6ImFKZzRBNEtUSHQ3N1FsM3lQLTR4Wm93WS1JR0hGTWc2VUI0X3NBa2QwQ1kifQ.eyJhenAiOjQ3OCwiZ3R5IjoiYXV0aG9yaXphdGlvbl9jb2RlIiwib3JnLmxhYnNoYXJlLnRlbmFudC5uYW1lIjoicG9sdXMtcWEiLCJvcmcubGFic2hhcmUudGVuYW50LmlkIjoyNjgsImp0aSI6IjhBVl9rYzRXaVd3ajFWUEJ3WFRYeiIsInN1YiI6IjEwNzY5IiwiaWF0IjoxNjYxODc4MDgzLCJleHAiOjE2NjE4ODE2ODMsInNjb3BlIjoiIiwiY2xpZW50X2lkIjoiYXV0aC11aSIsImlzcyI6Imh0dHBzOi8vYS1xYS5sYWJzaGFyZS5vcmcvX2F1dGgvdlRlc3QvYXV0aC9wb2x1cy1xYSIsImF1ZCI6Imh0dHBzOi8vYS1xYS5sYWJzaGFyZS5vcmcvX2F1dGgvdlRlc3QvYXV0aC9wb2x1cy1xYSJ9.f1oumUeIo0OMx9yiCOtAlpTKSqR0jgjKfa-gIyDcR6ifPZ9EKKsFAhBiXbxtTImgZbiA5GlZrFfvJu5C-UzLHKPLb5idJ-P7x_sTiXWY7fPKFCNgE8PO8LU5ur-iyrDpezMJOeEx3zF2MVTAZ7qjRpvBjQdorjvBZK94dwG8OUAxlxSMHXU2cQ-d4DElYS1G11q8Lal5HjG4j5IrPUnqBb2CgZb-mEr_sXGxnV0CJlPLeuRv8HEHu1imuF5tBw-RZb9Mum1F_K9tb3ytjuNznJnB7bynBa9oBJQou0YFrTJVBYG8m8kzjnXlbtAkR1a0vcfDzlqFWuPzU21p5ql7FA';

  constructor(private http: HttpClient) { }

  runWorkflow(workflow: any) {
    return this.http.post(this.baseUrl, workflow, {
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    });
  }

}
