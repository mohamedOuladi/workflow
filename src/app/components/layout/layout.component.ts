import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { loadState, updatePluginCoordinates } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { PluginX } from 'src/app/types';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;

  isDragging = false;
  isDrawing = false;
  draggedElementId: number = -1;
  draggedOffsetX: number = 0; // offset of currenlty dragged element
  draggedOffsetY: number = 0; // offset of currenlty dragged element

  svgElement: any;
  newLine: any;

  plugins = [] as PluginX[];

  constructor(private store: Store, @Inject(DOCUMENT) private document: Document) {
    this.store.state$.subscribe(state => {
      this.render(state.plugins);
    })
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
    const element = (e.target as HTMLElement)!.closest('.plugin'); // TODO: classname from shared constant

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

    if (outlet) {
      this.isDrawing = true;
      this.draggedElementId = -1;

      let svgElement = this.document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgElement.setAttribute("style", "position: absolute;");
      svgElement.setAttribute("height", "1");
      svgElement.setAttribute("width", "1");
      this.containerEl.nativeElement.appendChild(svgElement);
      this.svgElement = svgElement;

      const newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

      //newLine.setAttribute('id', 'line2');
      newLine.setAttribute("stroke", "red");
      newLine.setAttribute("x1", e.clientX + "px");
      newLine.setAttribute("y1", e.clientY + "px");
      newLine.setAttribute("x2", e.clientX + "px");
      newLine.setAttribute("y2", e.clientY + "px");
      newLine.classList.add('main-path')
      this.newLine = newLine;

      svgElement.appendChild(newLine);
    }
  }

  mouseMove(e: MouseEvent) {
    const containerClientX = this.containerEl.nativeElement.offsetLeft;
    const containerClientY = this.containerEl.nativeElement.offsetTop;

    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = e.clientX - containerClientX - this.draggedOffsetX;
      const newY = e.clientY - containerClientY - this.draggedOffsetY;
      this.store.dispatch(updatePluginCoordinates(this.draggedElementId, newX, newY));
    }

    if (this.isDrawing) {
      console.log(e.clientX, e.clientY);
      this.newLine.setAttribute("x2", e.clientX);
      this.newLine.setAttribute("y2", e.clientY);
    }
  }

  mouseUp() {
    this.isDragging = false;
    this.isDrawing = false;
    this.draggedElementId = -1;

  }

  render(plugins: PluginX[]) {
    this.plugins = plugins;
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
