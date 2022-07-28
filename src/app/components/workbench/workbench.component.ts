import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { addNode, disconnectLink, createLink, moveNode, moveLinkHead, moveLinkTail, destroyLink, connectLink, loadState } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { State } from 'src/app/redux/types';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkbenchComponent {
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;

  isDragging = false;
  isDrawing = false;

  linkId = 0;

  draggedElement?: Element;
  draggedElementId = 0;
  draggedOffsetX = 0; // offset of currenlty dragged element
  draggedOffsetY = 0; // offset of currenlty dragged element

  containerX = 0; // x of html element relative to the document
  containerY = 0; // y of html element relative to the document

  state?: State;

  scale = 1;

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

  ngAfterViewInit() {
    const containerRect = this.containerEl.nativeElement.getBoundingClientRect();
    this.containerX = containerRect.left;
    this.containerY = containerRect.top;
  }

  mouseDown(e: MouseEvent) {
    const inlet = (e.target as HTMLElement)!.closest('.inlet');
    const outlet = (e.target as HTMLElement)!.closest('.outlet');
    const element = (e.target as HTMLElement)!.closest('[data-id]');
    const nodeId = parseInt(element?.getAttribute('data-id')!, 10);

    // dragging node
    if (!outlet && !inlet && element) {
      this.isDragging = true;
      this.draggedElementId = nodeId;
      this.draggedElement = element;

      const rect = element.getBoundingClientRect();
      this.draggedOffsetX = e.x - rect.left;
      this.draggedOffsetY = e.y - rect.top;
    }

    // creating link
    if (outlet && element) {
      this.isDrawing = true;
      const rect = outlet.getBoundingClientRect();
      const outletX = (rect.left + rect.width / 2 - this.containerX) / this.scale;
      const outletY = (rect.top + rect.height / 2 - this.containerY) / this.scale;
      this.store.dispatch(createLink(nodeId, outletX, outletY));
    }

    // moving link
    if (inlet && element) {
      const linkId = this.state?.links.find(link => link.targetId === nodeId)?.id;
      if (linkId) {
        this.linkId = linkId;
        this.store.dispatch(disconnectLink(linkId));
        this.isDrawing = true;
      }
    }
  }

  mouseMove(e: MouseEvent) {
    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = (e.clientX - this.draggedOffsetX - this.containerX) / this.scale;
      const newY = (e.clientY - this.draggedOffsetY - this.containerY) / this.scale;
      this.store.dispatch(moveNode(this.draggedElementId, newX, newY));

      const { width, height } = this.draggedElement!.getBoundingClientRect();

      // TODO: do not hardcode these coordinates
      // calculate outlet coordinates
      const outletX = newX + width / this.scale;
      const outletY = (newY + height / 2 / this.scale)

      // calculate inlet coordinates
      const inletX = newX;
      const inletY = newY + height / 2 / this.scale;

      this.state?.links.filter(link => link.sourceId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkHead(outletX, outletY, link.id));
      });

      this.state?.links.filter(link => link.targetId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkTail(link.id, inletX, inletY,));
      });
    }

    if (this.isDrawing) {
      const x = (e.clientX - this.containerX) / this.scale;
      const y = (e.clientY - this.containerY) / this.scale;
      this.store.dispatch(moveLinkTail(this.linkId, x, y));
    }
  }

  mouseUp(e: MouseEvent) {
    const containerRect = this.containerEl.nativeElement.getBoundingClientRect();
    const containerClientX = containerRect.left;
    const containerClientY = containerRect.top;

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
          const x = (outletX - containerClientX) / this.scale;
          const y = (outletY - containerClientY) / this.scale;
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
  
  zoomIn() {
    this.scale += 0.1;
  }
  zoomOut() {
    this.scale -= 0.1;
  }

}

// TODO: zoom in and out
// TODO: try convert to SVG

// TODO: classname from shared constant
// TODO: delete node
// TODO: try different content in nodes
// TODO: select one
// TODO: select multiple nodes
// TODO: move multiple nodes

// TODO: do not hover color of inlet if link was from inlet - pass state into dynamicNode component, and possibly node object
