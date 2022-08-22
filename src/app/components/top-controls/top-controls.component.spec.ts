import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopControlsComponent } from './top-controls.component';

describe('TopControlsComponent', () => {
  let component: TopControlsComponent;
  let fixture: ComponentFixture<TopControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
