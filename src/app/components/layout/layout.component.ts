import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { loadState, startLink, movePlugin, cancelLink, finishLink, moveLink } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { State } from 'src/app/redux/types';

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

  state?: State;

  constructor(private store: Store) {
    this.store.state$.pipe(filter(x => !!x)).subscribe(state => {
      this.state = state;
    })
  }

  dropped(event: DragEvent) {
    const dataJson = event.dataTransfer!.getData('data');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      const x = event.offsetX - data.x;
      const y = event.offsetY - data.y;
      const plugin = { x, y, type: data.type };
      this.store.dispatch({ type: 'ADD_PLUGIN', payload: plugin });
    }
  }

  mouseDown(e: MouseEvent) {
    // TODO: classname from shared constant
    const inlet = (e.target as HTMLElement)!.closest('.inlet');
    const outlet = (e.target as HTMLElement)!.closest('.outlet'); 
    const element = (e.target as HTMLElement)!.closest('[data-id]'); 

    // dragging a plugin
    if (!outlet && element) {
      this.isDragging = true;
      this.draggedElementId = parseInt(element.getAttribute('data-id')!, 10)

      // get coordinates of the element relative to the document
      const rect = element.getBoundingClientRect();
      this.draggedOffsetX = e.x - rect.left;
      this.draggedOffsetY = e.y - rect.top;
    }

    // drawing a connection from an inlet
    if (inlet && element) {
      // this.isDrawing = true;
      // this.store.dispatch(startLink(inlet, outlet));
    }

    if (outlet && element) {
      // TODO: new connection vs existing connection
      this.isDrawing = true;
      const sourcePluginId = parseInt(element.getAttribute('data-id')!, 10);

      // get outlet coordinates of center of outlet relative to the document 
      const rect = outlet.getBoundingClientRect();
      const outletX = rect.left + rect.width / 2;
      const outletY = rect.top + rect.height / 2;
      this.store.dispatch(startLink(sourcePluginId, outletX, outletY));
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

    if (this.isDrawing) {
      this.store.dispatch(moveLink(e.clientX, e.clientY));
    }
  }

  mouseUp(e: MouseEvent) {
    if (this.isDrawing) {
      const inlet = (e.target as HTMLElement)!.closest('.inlet'); // TODO: classname from shared constant
      const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

      if (inlet && element) {
        const targetId = parseInt(element.getAttribute('data-id')!, 10);
        const outletRect = inlet.getBoundingClientRect();
        const outletX = outletRect.left + outletRect.width / 2;
        const outletY = outletRect.top + outletRect.height / 2;
        this.store.dispatch(finishLink(targetId, outletX, outletY));
      } else {
        // TODO: new connection vs existing connection
        this.store.dispatch(cancelLink());
      }
    }

    this.isDragging = false;
    this.isDrawing = false;
    this.draggedElementId = -1;
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

// TODO: add size to plugin

// TODO: change offset of connections

// TODO: if draw from inlet - unconnect existing connection

// TODO: do not hover color of inlet if connection was from inlet

