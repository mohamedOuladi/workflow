import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-dynamic-node',
  templateUrl: './dynamic-node.component.html',
  styleUrls: ['./dynamic-node.component.scss']
})
export class DynamicNodeComponent implements OnInit, AfterViewInit {
  @ViewChild('outlet', { read: ViewContainerRef, static: false }) outlet!: ViewContainerRef;
  @ViewChild('host', { read: ElementRef }) host!: ElementRef;

  @Input() data?: { x: number, y: number, id: number, type: string };
  x!: number;
  y!: number;
  id!: number;
  type!: string;
  component!: ComponentRef<PluginAComponent>;

  ngOnInit(): void {
    this.x = this.data!.x;
    this.y = this.data!.y;
    this.id = this.data!.id || 0;
    this.type = this.data!.type;
  }

  ngAfterViewInit(): void {
    const componentClass = PLUGINS.find(x => x.type === this.type)?.component;
    this.component = this.outlet.createComponent(componentClass!);
    this.host.nativeElement.style.position = 'absolute';
    this.host.nativeElement.style.left = this.x + 'px';
    this.host.nativeElement.style.top = this.y + 'px';
    this.host.nativeElement.setAttribute('data-id', this.id.toString());
  }

  ngOnChanges(changes: any): void {
    if (this.component) {
      this.x = changes.data.currentValue.x || this.x;
      this.y = changes.data.currentValue.y || this.y;
      this.host.nativeElement.style.left = this.x + 'px';
      this.host.nativeElement.style.top = this.y + 'px';
    }
  }

}
