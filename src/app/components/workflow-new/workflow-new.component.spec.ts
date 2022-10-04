import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowNewComponent } from './workflow-new.component';

describe('WorkflowNewComponent', () => {
  let component: WorkflowNewComponent;
  let fixture: ComponentFixture<WorkflowNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
