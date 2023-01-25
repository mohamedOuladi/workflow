import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowService } from 'src/app/services/workflow.service';
import { Workflow } from 'src/app/types';
import { WorkflowNewComponent } from '../workflow-new/workflow-new.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  allWorkflows = [] as Workflow[];

  constructor(private workflowService: WorkflowService, private modalService: NgbModal) {
    this.workflowService.getWorkflows().subscribe((workflows: any[]) => {
      console.log(workflows);
      this.allWorkflows = workflows;
    })
  }

  displayNewWfModal() {
    const modalRef = this.modalService.open(WorkflowNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}