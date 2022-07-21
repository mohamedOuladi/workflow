import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

  dropped(event: DragEvent) {
    const data = JSON.parse(event.dataTransfer!.getData('data'));
    const compoonent = this.container.createComponent(PluginAComponent);
    compoonent.instance.x =  event.clientX - data.x;
    compoonent.instance.y =  event.clientY - data.y * 2; // temp hack

    // TODO: instead of creating a new component, add it to the State and then render it
    // TODO: distinguish between new and existing components
  }

  allowDrop(event: any) {
    event.preventDefault();
  }
}
