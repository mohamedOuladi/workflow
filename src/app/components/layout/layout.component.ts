import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { loadState, createLink, moveNode, destroyLink, connectLink, moveLinkTail, moveLinkHead, addNode, disconnectLink } from 'src/app/redux/actions';
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

  linkId = 0;

  draggedElement?: Element;
  draggedElementId = 0;
  draggedOffsetX = 0; // offset of currenlty dragged element
  draggedOffsetY = 0; // offset of currenlty dragged element

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
      const node = { x, y, type: data.type };
      this.store.dispatch(addNode(node));
    }
  }

  mouseDown(e: MouseEvent) {
    // TODO: classname from shared constant
    const inlet = (e.target as HTMLElement)!.closest('.inlet');
    const outlet = (e.target as HTMLElement)!.closest('.outlet');
    const element = (e.target as HTMLElement)!.closest('[data-id]');
    const nodeId = parseInt(element?.getAttribute('data-id')!, 10);

    // dragging a node
    if (!outlet && !inlet && element) {
      this.isDragging = true;
      this.draggedElementId = nodeId;
      this.draggedElement = element;

      // get coordinates of the element relative to the document
      const rect = element.getBoundingClientRect();
      this.draggedOffsetX = e.x - rect.left;
      this.draggedOffsetY = e.y - rect.top;
    }

    if (inlet && element) {
      const linkId = this.state?.links.find(link => link.targetId === nodeId)?.id;
      if (linkId) {
        this.linkId = linkId;
        this.store.dispatch(disconnectLink(linkId));
        this.isDrawing = true;
      }
    }

    if (outlet && element) {
      this.isDrawing = true;
      const rect = outlet.getBoundingClientRect();
      const outletX = rect.left + rect.width / 2 - this.containerEl.nativeElement.offsetLeft;
      const outletY = rect.top + rect.height / 2 - this.containerEl.nativeElement.offsetTop;
      this.store.dispatch(createLink(nodeId, outletX, outletY));
    }
  }

  mouseMove(e: MouseEvent) {
    const containerClientX = this.containerEl.nativeElement.offsetLeft;
    const containerClientY = this.containerEl.nativeElement.offsetTop;

    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = e.clientX - containerClientX - this.draggedOffsetX;
      const newY = e.clientY - containerClientY - this.draggedOffsetY;
      this.store.dispatch(moveNode(this.draggedElementId, newX, newY));

      // get size of dragged element
      const rect = this.draggedElement!.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // calculate outlet coordinates
      const outletX = newX + width;
      const outletY = newY + height / 2;

      // calculate inlet coordinates
      const inletX = newX;
      const inletY = newY + height / 2;

      this.state?.links.filter(link => link.sourceId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkHead(outletX, outletY, link.id));
      });

      this.state?.links.filter(link => link.targetId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkTail(link.id, inletX, inletY,));
      });
    }

    if (this.isDrawing) {
      const x = e.clientX - containerClientX;
      const y = e.clientY - containerClientY;
      this.store.dispatch(moveLinkTail(this.linkId, x, y));
    }
  }

  mouseUp(e: MouseEvent) {
    if (this.isDrawing) {
      const inlet = (e.target as HTMLElement)!.closest('.inlet'); // TODO: classname from shared constant
      const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

      if (inlet && element) {
        const targetId = parseInt(element.getAttribute('data-id')!, 10);

        // check inlet of the target node is already connected
        const link = this.state?.links.find(link => link.targetId === targetId);
        if (link) {
          this.store.dispatch(destroyLink(this.linkId));
        } else {
          const outletRect = inlet.getBoundingClientRect();
          const outletX = outletRect.left + outletRect.width / 2;
          const outletY = outletRect.top + outletRect.height / 2;
          const x = outletX - this.containerEl.nativeElement.offsetLeft;
          const y = outletY - this.containerEl.nativeElement.offsetTop;
          this.store.dispatch(connectLink(this.linkId, targetId, x, y));
        }
      } else {
        this.store.dispatch(destroyLink(this.linkId));
      }
    }

    this.isDragging = false;
    this.isDrawing = false;
    this.draggedElementId = 0;
    this.linkId = 0;
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

// TODO: try different content in nodes

// TODO: select multiple nodes and move them

// TODO: do not hover color of inlet if link was from inlet - pass state into dynamicNode component, and possibly node object

// TODO: zoom in and out

