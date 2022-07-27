import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LinkComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('data') data!: { x1: number, y1: number, x2: number, y2: number, id: number };
  @ViewChild('host', { read: ElementRef }) host!: ElementRef<HTMLDivElement>;

  id: number = -1;
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.x1 = this.data.x1;
    this.y1 = this.data.y1;
    this.x2 = this.data.x2;
    this.y2 = this.data.y2;
    this.id = this.data.id;
  }

  ngAfterViewInit(): void {
    const svgElement = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(svgElement, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svgElement, 'style', 'position: fixed; top: 0; left: 0; z-index: 0; height: 1; width: 1;');
    this.renderer.appendChild(this.host.nativeElement, svgElement);

    const line = this.renderer.createElement('line', 'svg');
    this.renderer.setAttribute(line, 'x1', this.x1.toString());
    this.renderer.setAttribute(line, 'y1', this.y1.toString());
    this.renderer.setAttribute(line, 'x2', this.x2.toString());
    this.renderer.setAttribute(line, 'y2', this.y2.toString());
    this.renderer.setAttribute(line, 'stroke', 'red');
    this.renderer.addClass(line, 'main-path');
    this.renderer.appendChild(svgElement, line);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.x1 = changes['data'].currentValue.x1;
    this.y1 = changes['data'].currentValue.y1;
    this.x2 = changes['data'].currentValue.x2;
    this.y2 = changes['data'].currentValue.y2;

    const line = this.host?.nativeElement.querySelector('line') as SVGLineElement;
    if (line) {
      line.setAttribute('x1', this.x1.toString());
      line.setAttribute('y1', this.y1.toString());
      line.setAttribute('x2', this.x2.toString());
      line.setAttribute('y2', this.y2.toString());
    }
  }
}