import { AfterViewInit, Component, ComponentRef, Input, OnChanges, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';
import { GraphService } from 'src/app/services/graph.service';
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

  constructor(private graph: GraphService) {}

  ngOnInit(): void {
    this.x = this.data!.x;
    this.y = this.data!.y;
    this.id = this.data!.id || 0;
    this.type = this.data!.type;
    this.name = this.data!.name;
    this.selected = this.data!.selected || false;
    this.expanded = this.data!.expanded || false;
    this.icon = PLUGINS.find((x) => x.type === this.type)!.icon;
    this.hasInlet = PLUGINS.find((x) => x.type === this.type)!.hasInlet;
    this.hasOutlet = PLUGINS.find((x) => x.type === this.type)!.hasOutlet;
    this.width = PLUGINS.find((x) => x.type === this.type)!.width;
  }

  ngAfterViewInit(): void {
    const componentClass = PLUGINS.find((x) => x.type === this.type)?.component;
    this.component = this.outlet.createComponent(componentClass!);
  }

  ngOnChanges(changes: any): void {
    if (this.component) {
      this.x = changes.data.currentValue.x || this.x;
      this.y = changes.data.currentValue.y || this.y;
      this.name = changes.data.currentValue.name || this.name;
      this.selected = changes.data.currentValue.selected;
      this.expanded = changes.data.currentValue.expanded;
    }
  }

  expand(): void {
    this.graph.expand(this.id);
  }
}
