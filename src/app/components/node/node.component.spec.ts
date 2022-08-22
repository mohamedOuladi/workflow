import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicNodeComponent } from './node.component';

describe('DynamicNodeComponent', () => {
  let component: DynamicNodeComponent;
  let fixture: ComponentFixture<DynamicNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
