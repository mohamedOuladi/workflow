import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  baseUrl = 'https://compute.scb-ncats.io/compute/workflows';
  constructor(private http: HttpClient) { }

  runWorkflow(workflow: any) {
    return this.http.post(this.baseUrl, workflow);
  }
}
