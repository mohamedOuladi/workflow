import { AfterViewInit, Component, ComponentRef, Inject, Input, OnChanges, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CONST, Constants } from 'src/app/services/constants.service';
import { NodeX, PluginX } from 'src/app/types';
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
  width = this.constants.nodeWidth;
  plugin?: PluginX;

  constructor(@Inject(CONST) private constants: Constants) { }

  ngOnInit(): void {
    this.id = this.data!.id || 0;
    this.name = this.data!.name;
    this.plugin = this.data!.plugin;
    this.hasInlet = this.plugin.inputs?.length > 0;
    this.hasOutlet = this.plugin.outputs?.length > 0;

  }

  ngAfterViewInit(): void {
    this.component = this.outlet.createComponent(PluginAComponent!);
  }

  ngOnChanges(changes: any): void {
    this.x = changes.data.currentValue.x || this.x;
    this.y = changes.data.currentValue.y || this.y;
    this.name = changes.data.currentValue.name || this.name;
    this.selected = changes.data.currentValue.selected;
    this.expanded = changes.data.currentValue.expanded;
  }
}
