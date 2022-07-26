import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { loadState, startConnection, movePlugin, cancelConnection, finishConnection } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { State } from 'src/app/redux/types';
import { PluginX } from 'src/app/types';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;

  isDragging = false;
  isDrawing = false;

  draggedElementId: number = -1;
  draggedOffsetX: number = 0; // offset of currenlty dragged element
  draggedOffsetY: number = 0; // offset of currenlty dragged element

  drawedConnectionId: number = -1;

  plugins = [] as PluginX[];
  connections = [] as { x1: number, y1: number, x2: number, y2: number }[];
  state?: State;
  svgElement?: SVGSVGElement;

  constructor(private store: Store, @Inject(DOCUMENT) private document: Document) {
    this.store.state$.subscribe(state => {
      this.render(state);
      this.state = state;
    })
  }

  ngAfterViewInit() {
    let svgElement = this.document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("style", "position: fixed; top: 0; left: 0;");
    svgElement.setAttribute("height", "1");
    svgElement.setAttribute("width", "1");
    this.containerEl.nativeElement.appendChild(svgElement);
    this.svgElement = svgElement;
    this.render(this.state!);
  }

  dropped(event: DragEvent) {
    const dataJson = event.dataTransfer!.getData('data');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      const x = event.offsetX - data.x;
      const y = event.offsetY - data.y;
      const name = 'Lorem ipsum';
      const plugin = { name, x, y, };
      this.store.dispatch({ type: 'ADD_PLUGIN', payload: plugin });
    }
  }

  mouseDown(e: MouseEvent) {
    const outlet = (e.target as HTMLElement)!.closest('.outlet'); // TODO: classname from shared constant
    const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

    // only certain elements can be dragged
    if (!outlet && element) {

      this.isDragging = true;
      this.draggedElementId = parseInt(element.getAttribute('data-id')!, 10)

      // get coordinates of the element relative to the document
      const rect = element.getBoundingClientRect();
      const elementX = rect.left;
      const elementY = rect.top;

      // get mouse coordinates relative to the document
      const mouseX = e.x;
      const mouseY = e.y;

      // calculate the offset between the mouse and the element
      this.draggedOffsetX = mouseX - elementX;
      this.draggedOffsetY = mouseY - elementY;
    }

    if (outlet && element) {
      // TODO: new connection vs existing connection
      this.isDrawing = true;
      const sourcePluginId = parseInt(element.getAttribute('data-id')!, 10)
      this.store.dispatch(startConnection(sourcePluginId));
    }
  }

  mouseMove(e: MouseEvent) {
    const containerClientX = this.containerEl.nativeElement.offsetLeft;
    const containerClientY = this.containerEl.nativeElement.offsetTop;

    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = e.clientX - containerClientX - this.draggedOffsetX;
      const newY = e.clientY - containerClientY - this.draggedOffsetY;
      this.store.dispatch(movePlugin(this.draggedElementId, newX, newY));
    }

    // if (this.isDrawing) {
    //   console.log(e.clientX, e.clientY);
    //   this.newLine.setAttribute("x2", e.clientX);
    //   this.newLine.setAttribute("y2", e.clientY);
    // }
  }

  mouseUp(e: MouseEvent) {
    console.log('mouseUp', e);


    if (this.isDrawing) {
      const outlet = (e.target as HTMLElement)!.closest('.outlet'); // TODO: classname from shared constant
      const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

      if (outlet && element) {
        const targetId = parseInt(element.getAttribute('data-id')!, 10);
        this.store.dispatch(finishConnection(targetId));
      } else {
        // TODO: cancel new connection vs existing connection
        this.store.dispatch(cancelConnection());
      }
    }

    this.isDragging = false;
    this.isDrawing = false;
    this.draggedElementId = -1;
  }

  render(state: State) {
    this.plugins = state.plugins;
    state.connections.map(c => {
      console.log('connectionEl', c);

      if (c.sourceId !== undefined && c.targetId !== undefined) {
        const connectionEl = this.document?.querySelector(`[data-connection-id="${c.id!.toString()}"]`);

        let newLine: SVGLineElement;
        if (!connectionEl) {
          const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          newLine.setAttribute("stroke", "red");
          newLine.setAttribute("x1", 0 + "px");
          newLine.setAttribute("y1", 0 + "px");
          newLine.setAttribute("x2", 1000 + "px");
          newLine.setAttribute("y2", 1000 + "px");
          newLine.setAttribute("data-connection-id", c.id!.toString());
          newLine.classList.add('main-path')

          this.svgElement!.appendChild(newLine);
        } else {
          newLine = connectionEl as SVGLineElement;
        }

        const sourceEl = this.document.querySelector(`[data-id="${c.sourceId}"]`);
        console.log('sourceEl', sourceEl);
        if (sourceEl) {
          const outlet = sourceEl!.querySelector('.outlet');
          const rect = outlet!.getBoundingClientRect();
          const x1 = rect.left + rect.width / 2;
          const y1 = rect.top + rect.height / 2;

          const targetEl = this.document.querySelector(`[data-id="${c.targetId}"]`);
          const outlet2 = targetEl!.querySelector('.outlet');
          const rect2 = outlet2!.getBoundingClientRect();
          const x2 = rect2.left + rect2.width / 2;
          const y2 = rect2.top + rect2.height / 2;

          console.log('x1', x1, 'y1', y1, 'x2', x2, 'y2', y2);
          // update the line
          newLine!.setAttribute("x1", x1 + "px");
          newLine!.setAttribute("y1", y1 + "px");
          newLine!.setAttribute("x2", x2 + "px");
          newLine!.setAttribute("y2", y2 + "px");

        }

      }

    })
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  save() {
    const state = this.store.state;
    sessionStorage.setItem('state', JSON.stringify(state));
  }

  load() {
    const stateStr = sessionStorage.getItem('state');
    if (stateStr) {
      const state = JSON.parse(stateStr);
      this.store.dispatch(loadState(state));
    }
  }

}
