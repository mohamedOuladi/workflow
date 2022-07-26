import { ComponentRef, Directive, Input, ViewContainerRef } from '@angular/core';
import { PluginAComponent } from '../components/plugin-a/plugin-a.component';

@Directive({
  selector: '[appDynamicPlugin]'
})
export class DynamicPluginDirective {
  x!: number;
  y!: number;

  @Input() data?: { x: number, y: number, id: number };
  private component!: ComponentRef<PluginAComponent>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    this.component = this.viewContainerRef.createComponent(PluginAComponent); // temp hardcoded component
    this.component.instance.x = this.data!.x;
    this.component.instance.y = this.data!.y;
    this.component.instance.id = this.data!.id || 0;
  }

  ngOnChanges(changes: any): void {
    if (this.component) {
      this.x = changes.data.currentValue.x|| this.x;
      this.y = changes.data.currentValue.y || this.y;
      this.component.instance.updatePosition(this.x, this.y);
    }
  }

}

// TODO: instead of moving the plugin, move the host. Convert this from a directive to a component.