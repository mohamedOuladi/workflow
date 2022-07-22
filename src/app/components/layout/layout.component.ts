import { Component, ElementRef, ViewChild } from '@angular/core';
import { updatePluginCoordinates } from 'src/app/redux/actions';
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
  draggedElementId: number = -1;
  draggedOffsetX: number = 0; // offset of currenlty dragged element
  draggedOffsetY: number = 0; // offset of currenlty dragged element

  plugins = [] as PluginX[];

  constructor(private store: Store) {
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

  allowDrop(event: any) {
    event.preventDefault();
  }

  mouseDown(e: MouseEvent) {
    const element = (e.target as HTMLElement)!.closest('.plugin'); // TODO: classname from shared constant

    // only certain elements can be dragged
    if (element) {
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
  }

  mouseMove(e: MouseEvent) {
    const containerClientX = this.containerEl.nativeElement.offsetLeft;
    const containerClientY = this.containerEl.nativeElement.offsetTop;

    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = e.clientX - containerClientX - this.draggedOffsetX;
      const newY = e.clientY - containerClientY - this.draggedOffsetY;
      this.store.dispatch(updatePluginCoordinates(this.draggedElementId, newX, newY));
    }
  }

  mouseUp() {
    this.isDragging = false;
    this.draggedElementId = -1;
  }

  render(plugins: PluginX[]) {
    this.plugins = plugins;
  }

  clear(){
    this.plugins = [];
  }
}
