import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-plugin-a',
  templateUrl: './plugin-a.component.html',
  styleUrls: ['./plugin-a.component.scss']
})
export class PluginAComponent implements OnInit {
  x: number = 0;
  y: number = 0;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    this.element.nativeElement.style.position = 'absolute';
    this.element.nativeElement.style.left = this.x + 'px';
    this.element.nativeElement.style.top = this.y + 'px';
  }

}
