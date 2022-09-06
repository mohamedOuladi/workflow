import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginX } from 'src/app/types';
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
    component.id = 1;
    component.name = 'test';
    component.data = {
      id: 1,
      name: 'test',
      x: 0,
      y: 0,
      plugin: {} as PluginX,
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
