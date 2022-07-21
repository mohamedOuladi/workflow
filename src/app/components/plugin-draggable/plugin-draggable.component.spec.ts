import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginDraggableComponent } from './plugin-draggable.component';

describe('PluginDraggableComponent', () => {
  let component: PluginDraggableComponent;
  let fixture: ComponentFixture<PluginDraggableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginDraggableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginDraggableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
