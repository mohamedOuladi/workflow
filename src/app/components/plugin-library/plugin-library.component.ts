import { Component } from '@angular/core';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

const MOCK_PLUGINS = [
  {
    name: 'Lorem ipsum',
    icon: 'icon-lsi-plugins',
    component: PluginAComponent
  },
  {
    name: 'Dolor sit amet',
    icon: 'icon-lsi-plugins',
    component: PluginAComponent
  }
];

@Component({
  selector: 'app-plugin-library',
  templateUrl: './plugin-library.component.html',
  styleUrls: ['./plugin-library.component.scss']
})
export class PluginLibraryComponent {
  plugins = MOCK_PLUGINS;

  start(e: DragEvent) {
    // get mouse coordinates relative to the clicked element
    const x = e.offsetX;
    const y = e.offsetY;

    const data = {
      x: x,
      y: y
    };
    e.dataTransfer!.setData('data', JSON.stringify(data));
  }
}
