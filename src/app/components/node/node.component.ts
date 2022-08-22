import { AfterViewInit, Component, ComponentRef, Input, OnChanges, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';
import { NodeX } from 'src/app/types';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class DynamicNodeComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('outlet', { read: ViewContainerRef, static: false }) outlet!: ViewContainerRef;

  @Input() data?: NodeX;
  component!: ComponentRef<PluginAComponent>;
  x!: number;
  y!: number;
  id!: number;
  type!: string;
  selected = false;
  expanded = false;
  name = '';
  icon = '';
  hasInlet = false;
  hasOutlet = false;
  width = 250;

  ngOnInit(): void {
    this.id = this.data!.id || 0;
    this.type = this.data!.type;
    this.name = this.data!.name;
    const plugin = PLUGINS.find((x) => x.type === this.type);
    if (plugin) {
      this.icon = plugin.icon;
      this.hasInlet = plugin.hasInlet;
      this.hasOutlet = plugin.hasOutlet;
      this.width = plugin.width;
    }
  }

  ngAfterViewInit(): void {
    const componentClass = PLUGINS.find((x) => x.type === this.type)?.component;
    this.component = this.outlet.createComponent(componentClass!);
  }

  ngOnChanges(changes: any): void {
    this.x = changes.data.currentValue.x || this.x;
    this.y = changes.data.currentValue.y || this.y;
    this.name = changes.data.currentValue.name || this.name;
    this.selected = changes.data.currentValue.selected;
    this.expanded = changes.data.currentValue.expanded;
  }
}
