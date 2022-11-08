import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowNewComponent } from '../workflow-new/workflow-new.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {



  workflows = [{"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"},
  {"name": "segmentation"}, {"name": "pyramid-building"}, {"name": "stitching-wf"}, {"name": "labeling"}, {"name": "pyramid-building-test"}, {"name": "wf-test-1"}, {"name": "demo-wf"}];

  // sampleWF = {
  //   "name": "string",
  //   "driver": "string",
  //   "inputs": {},
  //   "outputs": {},
  //   "steps": {},
  //   "cwlJobInputs": {},
  //   "dateFinished": "2022-10-13T21:40:06.662Z",
  //   "owner": "string",
  //   "additionalProp1": {}
  // };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  displayNewWfModal() {
    const modalRef = this.modalService.open(WorkflowNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  displayList() {
    document.getElementById("wrapper")?.classList.add("list");
  }

  displayGrid() {
    document.getElementById("wrapper")?.classList.remove("list");
  }
}