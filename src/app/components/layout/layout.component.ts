import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PluginAComponent } from '../plugin-a/plugin-a.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;

  isDragging = false;
  draggedElement?: HTMLElement;
  offsetX: number = 0;
  offsetY: number = 0;


  dropped(event: DragEvent) {
    const dataJ = event.dataTransfer!.getData('data');
    if (dataJ) {
      const data = JSON.parse(dataJ);
      const compoonent = this.container.createComponent(PluginAComponent);
      compoonent.instance.x = event.clientX - data.x;
      compoonent.instance.y = event.clientY - data.y * 2; // temp hack
    }

    // TODO: instead of creating a new component, add it to the State and then render it
    // TODO: distinguish between new and existing components
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  mouseDown(e: MouseEvent) {
    const element = (e.target as HTMLElement)!.closest('.plugin'); // TODO: classname from shared constant

    // only certain elements can be dragged
    if (element) {
      this.isDragging = true;
      this.draggedElement = element as HTMLElement;

      // get coordinates of the element relative to the document
      const rect = element.getBoundingClientRect();
      const elementX = rect.left;
      const elementY = rect.top;

      // get mouse coordinates relative to the document
      const mouseX = e.x;
      const mouseY = e.y;
      
      // calculate the offset between the mouse and the element
      this.offsetX = mouseX - elementX;
      this.offsetY = mouseY - elementY;
    }
  }

  mouseMove(e: MouseEvent) {
    const containerClientX = this.containerEl.nativeElement.offsetLeft;
    const containerClientY = this.containerEl.nativeElement.offsetTop;

    if (this.isDragging && this.draggedElement) {
      this.draggedElement.style.left = (e.clientX - containerClientX - this.offsetX) + 'px'
      this.draggedElement.style.top = (e.clientY - containerClientY - this.offsetY ) + 'px'

      // TODO: update the state of the component instead of setting style directly
    }
  }

  mouseUp() {
    this.isDragging = false;
    this.draggedElement = undefined;
  }
}
