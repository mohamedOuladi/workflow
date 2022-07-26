import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginBComponent } from './plugin-b.component';

describe('PluginBComponent', () => {
  let component: PluginBComponent;
  let fixture: ComponentFixture<PluginBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluginBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PluginBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
