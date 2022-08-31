import { Component } from '@angular/core';
import { PluginsService } from 'src/app/services/plugins.service';
import { PluginX } from 'src/app/types';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-plugin-library',
  templateUrl: './plugin-library.component.html',
  styleUrls: ['./plugin-library.component.scss'],
})
export class PluginLibraryComponent {
  allNodes = [] as PluginX[];

  constructor(private pluginsService: PluginsService) {
    this.pluginsService.getPlugins().subscribe((plugins) => {
      this.allNodes = plugins.map((plugin) => ({
        ...plugin,
        name: plugin.name,
        icon: 'icon-lsi-plugins',
        type: 'plugin-a',
        component: PluginAComponent
      }));
    })
  }

  dragStart(e: DragEvent) {
    const x = e.offsetX;
    const y = e.offsetY;

    const data = {
      x: x,
      y: y,
      plugin: this.allNodes.find((plugin) => plugin.name === (e.target as HTMLElement)!.getAttribute('data-name')!),
    };

    e.dataTransfer!.setData('data', JSON.stringify(data)); // TODO: do not use hardcoded classname
  }
}
