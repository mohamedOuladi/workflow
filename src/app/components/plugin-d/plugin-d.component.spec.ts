import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginDComponent } from './plugin-d.component';

describe('PluginDComponent', () => {
  let component: PluginDComponent;
  let fixture: ComponentFixture<PluginDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PluginDComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PluginDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
