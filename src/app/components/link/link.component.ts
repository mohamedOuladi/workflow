import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';


const CURVITY = 0.5;

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
    this.renderer.setAttribute(svgElement, 'style', 'position: absolute; top: 0; left: 0; z-index: 0; height: 1; width: 1;');
    this.renderer.appendChild(this.host.nativeElement, svgElement);

    const formula = LinkComponent.createCurvature(this.x1, this.y1, this.x2, this.y2);
    const curve = this.renderer.createElement('path', 'svg');

    this.renderer.setAttribute(curve, 'd', formula);
    this.renderer.setAttribute(curve, 'stroke', 'red');
    this.renderer.setAttribute(curve, 'fill', 'none');
    this.renderer.setAttribute(curve, 'stroke-width', '1');
    this.renderer.addClass(curve, 'main-path');
    this.renderer.appendChild(svgElement, curve);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.x1 = changes['data'].currentValue.x1;
    this.y1 = changes['data'].currentValue.y1;
    this.x2 = changes['data'].currentValue.x2;
    this.y2 = changes['data'].currentValue.y2;

    const curve = this.host?.nativeElement.querySelector('path') as SVGLineElement;
    if (curve) {
      const formula = LinkComponent.createCurvature(this.x1, this.y1, this.x2, this.y2);
      curve.setAttribute('d', formula);
    }
  }

  static createCurvature(x1: number, y1: number, x2: number, y2: number) {
    const hx1 = x1 + Math.abs(x2 - x1) * CURVITY;
    const hx2 = x2 - Math.abs(x2 - x1) * CURVITY;
    return ' M ' + x1 + ' ' + y1 + ' C ' + hx1 + ' ' + y1 + ' ' + hx2 + ' ' + y2 + ' ' + x2 + '  ' + y2;
  }
}
