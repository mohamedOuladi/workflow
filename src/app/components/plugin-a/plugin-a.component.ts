import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plugin-a',
  templateUrl: './plugin-a.component.html',
  styleUrls: ['./plugin-a.component.scss']
})
export class PluginAComponent implements AfterViewInit {
  x: number = 0;
  y: number = 0;

  @ViewChild('content', { read: ElementRef }) content!: ElementRef;

  ngAfterViewInit(): void {
    this.content.nativeElement.style.position = 'absolute';
    this.content.nativeElement.style.left = this.x + 'px';
    this.content.nativeElement.style.top = this.y + 'px';
  }

}
