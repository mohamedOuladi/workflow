import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';
import { setNodeSize } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.x = this.data!.x;
    this.y = this.data!.y;
    this.id = this.data!.id || 0;
    this.type = this.data!.type;
  }

  ngAfterViewInit(): void {
    const componentClass = PLUGINS.find(x => x.type === this.type)?.component;
    this.component = this.outlet.createComponent(componentClass!);
    const { width, height } = this.host.nativeElement.getBoundingClientRect();
    this.store.dispatch(setNodeSize(this.id, width, height));
  }

  ngOnChanges(changes: any): void {
    if (this.component) {
      this.x = changes.data.currentValue.x || this.x;
      this.y = changes.data.currentValue.y || this.y;
    }
  }

}
