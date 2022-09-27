import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workflow-new',
  templateUrl: './workflow-new.component.html',
  styleUrls: ['./workflow-new.component.scss']
})
export class WorkflowNewComponent implements OnInit {

  @Input() modalReference: any;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  createWorkflow() {
    this.router.navigate(['workbench']);
  }
}
