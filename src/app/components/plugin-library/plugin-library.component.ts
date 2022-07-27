import { Component } from '@angular/core'
import { PLUGINS } from 'src/app/plugins';

@Component({
  selector: 'app-plugin-library',
  templateUrl: './plugin-library.component.html',
  styleUrls: ['./plugin-library.component.scss']
})
export class PluginLibraryComponent {
  plugins = PLUGINS;

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
