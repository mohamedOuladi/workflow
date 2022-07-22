import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plugin-a',
  templateUrl: './plugin-a.component.html',
  styleUrls: ['./plugin-a.component.scss']
})
export class PluginAComponent implements AfterViewInit {
  x: number = 0;
  y: number = 0;
  id: number = 0;

  @ViewChild('content', { read: ElementRef }) content!: ElementRef;

  ngAfterViewInit(): void {
    this.content.nativeElement.style.position = 'absolute';
    this.content.nativeElement.style.left = this.x + 'px';
    this.content.nativeElement.style.top = this.y + 'px';
    this.content.nativeElement.setAttribute('data-id', this.id.toString());
  }

  updatePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.content.nativeElement.style.left = this.x + 'px';
    this.content.nativeElement.style.top = this.y + 'px';
  }

}
