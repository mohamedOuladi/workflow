import { Component, OnInit } from '@angular/core';
import { NodeX } from 'src/app/types';

@Component({
  selector: 'app-plugin-a',
  templateUrl: './plugin-a.component.html',
  styleUrls: ['./plugin-a.component.scss'],
})
export class PluginAComponent implements OnInit{

  node?: NodeX;

  ngOnInit(): void {
    console.log('---pluginA---');
    console.log(this.node);
  }

  setNode(node: NodeX) {
    this.node = node;
  }
}
