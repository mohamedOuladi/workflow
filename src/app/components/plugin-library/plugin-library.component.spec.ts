import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PluginLibraryComponent } from './plugin-library.component';

describe('PluginLibraryComponent', () => {
  let component: PluginLibraryComponent;
  let fixture: ComponentFixture<PluginLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PluginLibraryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PluginLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
