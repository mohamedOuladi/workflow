import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

const CURVITY = 0.5;
const ZIGZAG_MIN_END_LENGTH = 25;

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LinkComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data!: { x1: number, y1: number, x2: number, y2: number, id: number };
  @ViewChild('host', { read: ElementRef }) host!: ElementRef<HTMLDivElement>;

  id: number = -1;
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.x1 = this.data.x1;
    this.y1 = this.data.y1;
    this.x2 = this.data.x2;
    this.y2 = this.data.y2;
    this.id = this.data.id;
  }

  ngAfterViewInit(): void {
    this.updatePath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.x1 = changes['data'].currentValue.x1;
    this.y1 = changes['data'].currentValue.y1;
    this.x2 = changes['data'].currentValue.x2;
    this.y2 = changes['data'].currentValue.y2;
    this.updatePath();
  }

  updatePath() {
    const path = this.host?.nativeElement.querySelector('path') as SVGLineElement;
    if (path) {
      // const formula = LinkComponent.createCurvature(this.x1, this.y1, this.x2, this.y2);
      const formula = LinkComponent.createZigzag(this.x1, this.y1, this.x2, this.y2);
      path.setAttribute('d', formula);
    }
  }

  static createZigzag(x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx >= ZIGZAG_MIN_END_LENGTH * 2) {
      const h = dx / 2;
      const path = `M ${x1},${y1} h ${h} v ${dy} h ${h}`;
      return path;
    } else {
      const l = ZIGZAG_MIN_END_LENGTH;
      const v = dy / 2;
      const h = ZIGZAG_MIN_END_LENGTH * 2 - dx;
      return `M ${x1},${y1} h ${l} v ${v} h -${h} v ${v} h ${l}`;
    }
  }

  static createCurvature(x1: number, y1: number, x2: number, y2: number) {
    const hx1 = x1 + Math.abs(x2 - x1) * CURVITY;
    const hx2 = x2 - Math.abs(x2 - x1) * CURVITY;
    return ' M ' + x1 + ' ' + y1 + ' C ' + hx1 + ' ' + y1 + ' ' + hx2 + ' ' + y2 + ' ' + x2 + '  ' + y2;
  }
}
