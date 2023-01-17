import { Component } from '@angular/core';
import { PluginsService } from 'src/app/services/plugins.service';
import { PluginX, State } from 'src/app/types';
import { PluginAComponent } from '../plugin-a/plugin-a.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PluginNewComponent } from '../plugin-new/plugin-new.component';
import { filter, of } from 'rxjs';



@Component({
  selector: 'app-plugin-library',
  templateUrl: './plugin-library.component.html',
  styleUrls: ['./plugin-library.component.scss'],
})
export class PluginLibraryComponent {
  allNodes = [] as PluginX[];
  state?: State;
  allplugins = [{
    "id": "1",
    "name": "segmentation-test",
    "version": "1",
    "title": "segmentation",
    "description": "true",
    "containerId": "true",
    "inputs": [{
      "name": "message",
      "type": "string",
      "label": "string",
      "required": false
    }],
    "outputs": [{
      "name": "outputPath",
      "type": "string",
      "label": "label"
    }],
    "ui": [],
    "author": "simo",
    "institution": "NIH",
    "website": "true",
    "citation": "true",
    "baseCommand": [],
    "pluginHardwareRequirements": [],
    "cwlScript": {
      "inputs": {
        "message": {
          "type": "string",
          "default": "Hello World",
          "inputBinding": {
            "position": 1
          }
        }
      },
      "outputs": { "output": "path" }
    }
  }, {
    "id": "2",
    "name": "mist-test",
    "version": "1",
    "title": "mist",
    "description": "true",
    "containerId": "true",
    "inputs": [],
    "outputs": [],
    "ui": [],
    "author": "simo",
    "institution": "NIH",
    "website": "true",
    "citation": "true",
    "baseCommand": [],
    "pluginHardwareRequirements": [],
    "cwlScript": []
  },
  {
    "id": "3",
    "name": "echo",
    "version": "1",
    "title": "echo",
    "description": "true",
    "containerId": "true",
    "inputs": [{
      "name": "message",
      "type": "string",
      "label": "string",
      "required": false
    }, {
      "name": "message2",
      "type": "string",
      "label": "string",
      "required": false
    }],
    "outputs": [{
      "name": "my-output",
      "type": "string",
      "label": "label"
    }],
    "ui": [],
    "author": "simo",
    "institution": "NIH",
    "website": "true",
    "citation": "true",
    "baseCommand": [],
    "pluginHardwareRequirements": [],
    "cwlScript": {
      "cwlVersion": "v1.2",
      "class": "CommandLineTool",
      "baseCommand": "echo",
      "inputs": {
        "message": {
          "type": "string",
          "default": "Hello World",
          "inputBinding": {
            "position": 1
          }
        },
        "message2": {
          "type": "File?",
          "inputBinding": {
            "position": 2
          }
        },
        "my_output": {
          "type": "string",
          "default": "outputfile"
        }
      },
      "outputs": {
        "my_output": {
          "type": "File",
          "outputBinding": {
            "glob": "$(inputs.my-output)"
          }
        }
      },
      "stdout": "$(inputs.my-output)"
    }
  }];


  constructor(private pluginsService: PluginsService, private modalService: NgbModal) {
    this.pluginsService.getPlugins().subscribe((plugins) => {
    // this.getFakePlugins().subscribe((plugins) => {
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

  displayNewPluginModal() {
    const modalRef = this.modalService.open(PluginNewComponent, {size: 'lg'});
    modalRef.componentInstance.modalReference = modalRef;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  getFakePlugins() {
    return of(this.allplugins);
  }
}
