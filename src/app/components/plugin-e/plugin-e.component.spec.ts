import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginEComponent } from './plugin-e.component';

describe('PluginEComponent', () => {
  let component: PluginEComponent;
  let fixture: ComponentFixture<PluginEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginEComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PluginEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
