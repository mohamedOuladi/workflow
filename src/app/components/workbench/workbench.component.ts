import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { addNode, disconnectLink, createLink, moveNode, moveLinkHead, moveLinkTail, destroyLink, connectLink } from 'src/app/redux/actions';
import { Store } from 'src/app/redux/store';
import { State } from 'src/app/redux/types';

const GRID_SIZE = 50;

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkbenchComponent {
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;
  @ViewChild('grid', { read: ElementRef }) grid!: ElementRef;

  isDragging = false; // node
  isDrawing = false; // link
  isMoving = false; // container

  linkId = 0;

  draggedElement?: Element;
  draggedElementId = 0;
  draggedOffsetX = 0; // offset of currenlty dragged element
  draggedOffsetY = 0; // offset of currenlty dragged element

  containerX = 0; // offset x of html element relative to the document
  containerY = 0; // offset y of html element relative to the document

  state?: State;

  scale = 1;
  ddx = 0; // x of container
  ddy = 0; // y of container

  constructor(private store: Store) {
    this.store.state$.pipe(filter(x => !!x)).subscribe(state => {
      this.state = state;
    })
  }

  dropped(event: DragEvent) {
    const dataJson = event.dataTransfer!.getData('data');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      const x = (event.offsetX - data.x - this.ddx) / this.scale;
      const y = (event.offsetY - data.y - this.ddy) / this.scale;
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
      return;
    }

    // creating link
    if (outlet && element) {
      this.isDrawing = true;
      const rect = outlet.getBoundingClientRect();
      const outletX = (rect.left + rect.width / 2 - this.containerX - this.ddx) / this.scale;
      const outletY = (rect.top + rect.height / 2 - this.containerY - this.ddy) / this.scale;
      this.store.dispatch(createLink(nodeId, outletX, outletY));
      return;
    }

    // moving link
    if (inlet && element) {
      const linkId = this.state?.links.find(link => link.targetId === nodeId)?.id;
      if (linkId) {
        this.linkId = linkId;
        this.store.dispatch(disconnectLink(linkId));
        this.isDrawing = true;
      }
      return;
    }

    // moving container
    this.isMoving = true;
    this.draggedOffsetX = e.x - this.containerX - this.ddx;
    this.draggedOffsetY = e.y - this.containerY - this.ddy;
  }

  mouseMove(e: MouseEvent) {

    // dragging node
    if (this.isDragging && this.draggedElementId >= 0) {
      const newX = (e.clientX - this.draggedOffsetX - this.containerX - this.ddx) / this.scale;
      const newY = (e.clientY - this.draggedOffsetY - this.containerY - this.ddy) / this.scale;
      this.store.dispatch(moveNode(this.draggedElementId, newX, newY));

      const node = this.state?.nodes.find(n => n.id === this.draggedElementId)!;

      const width = node.width || 0;
      const height = node.height || 0;

      const headX = newX + width;
      const headY = newY + height / 2;

      const tailX = newX;
      const tailY = newY + height / 2;

      this.state?.links.filter(link => link.sourceId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkHead(headX, headY, link.id));
      });

      this.state?.links.filter(link => link.targetId === this.draggedElementId).forEach(link => {
        this.store.dispatch(moveLinkTail(link.id, tailX, tailY,));
      });
      return;
    }

    // drawing link
    if (this.isDrawing) {
      const x = (e.clientX - this.containerX - this.ddx) / this.scale;
      const y = (e.clientY - this.containerY - this.ddy) / this.scale;
      this.store.dispatch(moveLinkTail(this.linkId, x, y));
      return;
    }

    // moving container
    if (this.isMoving) {
      this.ddx = e.clientX - this.containerX - this.draggedOffsetX;
      this.ddy = e.clientY - this.containerY - this.draggedOffsetY;
      this.grid.nativeElement.style['background-position'] = `${this.ddx}px ${this.ddy}px`;
      return;
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
          const x = (outletX - this.containerX - this.ddx) / this.scale;
          const y = (outletY - this.containerY - this.ddy) / this.scale;
          this.store.dispatch(connectLink(this.linkId, targetId, x, y));
        }
      } else {
        this.store.dispatch(destroyLink(this.linkId));
      }
    }

    this.isDragging = false;
    this.isDrawing = false;
    this.isMoving = false;
    this.draggedElementId = 0;
    this.linkId = 0;
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  zoom(delta: number) {
    this.scale += delta;
    const size = GRID_SIZE * this.scale + 'px';
    this.grid.nativeElement.style['background-size'] = `${size} ${size}` // 50px 50px;
  }

}


// TODO: classname from shared constant
// TODO: delete node
// TODO: try different content in nodes
// TODO: select one
// TODO: select multiple nodes
// TODO: move multiple nodes

// TODO: zoom using mouse wheel


// TODO: do not hover color of inlet if link was from inlet - pass state into dynamicNode component, and possibly node object
