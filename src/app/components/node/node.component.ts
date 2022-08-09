import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';
import { NodeX } from 'src/app/types';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class DynamicNodeComponent implements OnInit, AfterViewInit {
  @ViewChild('outlet', { read: ViewContainerRef, static: false }) outlet!: ViewContainerRef;
  @ViewChild('host', { read: ElementRef }) host!: ElementRef;

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

  ngOnInit(): void {
    this.x = this.data!.x;
    this.y = this.data!.y;
    this.id = this.data!.id || 0;
    this.type = this.data!.type;
    this.name = this.data!.name;
    this.selected = this.data!.selected || false;
    this.expanded = this.data!.expanded || false;
    this.icon = PLUGINS.find(x => x.type === this.type)!.icon;
    this.hasInlet = PLUGINS.find(x => x.type === this.type)!.hasInlet;
    this.hasOutlet = PLUGINS.find(x => x.type === this.type)!.hasOutlet;
  }

  ngAfterViewInit(): void {
    const componentClass = PLUGINS.find(x => x.type === this.type)?.component;
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

}
