import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginCComponent } from './plugin-c.component';

describe('PluginCComponent', () => {
  let component: PluginCComponent;
  let fixture: ComponentFixture<PluginCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginCComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PluginCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
