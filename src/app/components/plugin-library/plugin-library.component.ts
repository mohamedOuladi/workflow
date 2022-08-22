import { Component } from '@angular/core';
import { PLUGINS } from 'src/app/plugins';

@Component({
  selector: 'app-plugin-library',
  templateUrl: './plugin-library.component.html',
  styleUrls: ['./plugin-library.component.scss'],
})
export class PluginLibraryComponent {
  plugins = PLUGINS;

  allNodes = [
    {
      name: 'Catalog',
      icon: 'icon-lsi-catalog',
      expanded: false,
    },
    {
      name: 'Macros',
      icon: 'icon-lsi-code',
      expanded: false,
    },
    {
      name: 'Plugins',
      icon: 'icon-lsi-plugins',
      expanded: true,
      children: [
        {
          name: 'Example',
          icon: 'icon-lsi-folder',
          expandedIcon: 'icon-lsi-openfolder',
          expanded: true,
          children: [...PLUGINS],
        },
        {
          name: 'Node 3.3',
          icon: 'icon-lsi-folder',
          expandedIcon: 'icon-lsi-openfolder',
          expanded: false,
        },
      ],
    },
    {
      name: 'Workflow',
      icon: 'icon-lsi-workflow',
      expanded: false,
    },
  ];

  expand(a?: any) {}
  collapse(a?: any) {}
  open(a?: any) {}
  getName(a?: any) {}

  start(e: DragEvent) {
    const x = e.offsetX;
    const y = e.offsetY;

    const data = {
      x: x,
      y: y,
      type: (e.target as HTMLElement)!.getAttribute('data-type')!, // TODO: do not use hardcoded classname
    };
    e.dataTransfer!.setData('data', JSON.stringify(data)); // TODO: do not use hardcoded classname
  }
}
