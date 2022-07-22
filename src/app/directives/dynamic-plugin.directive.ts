import { ComponentRef, Directive, Input, ViewContainerRef } from '@angular/core';
import { PluginAComponent } from '../components/plugin-a/plugin-a.component';
import { PluginX } from '../types';

@Directive({
  selector: '[appDynamicPlugin]'
})
export class DynamicPluginDirective {
  @Input() id!: number;
  @Input() x!: number;
  @Input() y!: number;
  private component!: ComponentRef<PluginAComponent>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.component = this.viewContainerRef.createComponent(PluginAComponent); // temp hardcoded component
    this.component.instance.x = this.x;
    this.component.instance.y = this.y;
    this.component.instance.id = this.id || 0;
  }

  ngOnChanges(changes: any): void {
    if (this.component) {
      this.x = changes.x?.currentValue || this.x;
      this.y = changes.y?.currentValue || this.y;
      this.component.instance.updatePosition(this.x, this.y);
    }
  }

}
