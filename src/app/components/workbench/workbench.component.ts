import { Component, ElementRef, HostListener, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { PLUGINS } from 'src/app/plugins';
import { addNode, disconnectLink, createLink, moveNode, moveLinkHead, moveLinkTail, destroyLink, connectLink, updateSelection, deleteNodes } from 'src/app/redux/actions';
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
  @ViewChild('selectarea', { read: ElementRef }) selectArea!: ElementRef;

  isDragging = false; // dragging node
  isDrawing = false; // dragging ink
  isMoving = false; // moving viewport
  isSelecting = false; // selecting area

  linkId = 0; // id of dragged link

  tempX = 0; // just for temporary use
  tempY = 0; // just for temporary use

  startX = 0; // also for temporary use
  startY = 0; // also for temporary use

  containerX = 0; // offset x of html element relative to the document
  containerY = 0; // offset y of html element relative to the document

  state?: State;

  scale = 1;
  dx = 0; // x of viewport
  dy = 0; // y of viewport

  constructor(private store: Store, private renderer: Renderer2) {
    this.store.state$.pipe(filter(x => !!x)).subscribe(state => {
      this.state = state;
    })
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY !== 0) {
      this.zoom(event.deltaY / 1000, event.clientX - this.containerX, event.clientY - this.containerY);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.store.dispatch(deleteNodes(this.state!.selection));
      this.store.dispatch(updateSelection([]));
    }

    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'a') {
        event.preventDefault();
        this.store.dispatch(updateSelection(this.state!.nodes.map(x => x.id!)));
      }
    }
  }

  dropped(event: DragEvent) {
    const dataJson = event.dataTransfer!.getData('data');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      const x = (event.clientX - data.x - this.containerX - this.dx) / this.scale;
      const y = (event.clientY - data.y - this.containerY - this.dy) / this.scale;
      const name = PLUGINS.find(x => x.type === data.type)!.name;
      const node = { x, y, type: data.type, name };
      this.store.dispatch(addNode(node));
      const lastNode = this.state!.nodes[this.state!.nodes.length - 1];
      this.store.dispatch(updateSelection([lastNode.id!]));
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
      this.tempX = e.clientX;
      this.tempY = e.clientY;
      this.isDragging = true;
      let selection = this.state?.selection.slice()!;
      if (e.metaKey || e.ctrlKey) {
        if (this.state?.selection.includes(nodeId)) {
          selection = this.state.selection.filter(x => x !== nodeId);
        } else {
          selection.push(nodeId);
        }
      } else {
        if (!selection.includes(nodeId)) {
          selection = [nodeId];
        }
      }
      this.store.dispatch(updateSelection(selection));
      return;
    }

    // new link from outlet
    if (outlet && element) {
      this.isDrawing = true;
      const rect = outlet.getBoundingClientRect();
      const outletX = (rect.left + rect.width / 2 - this.containerX - this.dx) / this.scale;
      const outletY = (rect.top + rect.height / 2 - this.containerY - this.dy) / this.scale;
      this.store.dispatch(createLink(nodeId, outletX, outletY));
      return;
    }

    // existing link from inlet
    if (inlet && element) {
      const linkId = this.state?.links.find(link => link.targetId === nodeId)?.id;
      if (linkId) {
        this.linkId = linkId;
        this.store.dispatch(disconnectLink(linkId));
        this.isDrawing = true;
      }
      return;
    }

    this.store.dispatch(updateSelection([]));

    // moving container
    if (e.shiftKey) {
      this.isMoving = true;
      this.startX = e.clientX - this.dx;
      this.startY = e.clientY - this.dy;
      return
    }

    // selecting area
    this.isSelecting = true;
    this.startX = e.clientX
    this.startY = e.clientY;
  }

  mouseMove(e: MouseEvent) {

    // dragging node
    if (this.isDragging) {
      const dx = e.clientX - this.tempX;
      const dy = e.clientY - this.tempY;
      this.tempX = e.clientX;
      this.tempY = e.clientY;

      this.state?.selection.forEach(id => {
        const node = this.state?.nodes.find(x => x.id === id)!;
        const newX = node.x + dx / this.scale;
        const newY = node.y + dy / this.scale;

        this.store.dispatch(moveNode(id, newX, newY));

        // get element size 
        const element = document.querySelector(`[data-id="${id}"]`);
        const rect = element!.getBoundingClientRect();
        const width = rect.width / this.scale;
        const height = rect.height / this.scale;

        const headX = newX + width
        const headY = newY + height / 2;

        const tailX = newX;
        const tailY = newY + height / 2;

        this.state?.links.filter(link => link.sourceId === id).forEach(link => {
          this.store.dispatch(moveLinkHead(headX, headY, link.id));
        });

        this.state?.links.filter(link => link.targetId === id).forEach(link => {
          this.store.dispatch(moveLinkTail(link.id, tailX, tailY,));
        });
      });
      return;
    }

    // drawing link
    if (this.isDrawing) {
      const x = (e.clientX - this.containerX - this.dx) / this.scale;
      const y = (e.clientY - this.containerY - this.dy) / this.scale;
      this.store.dispatch(moveLinkTail(this.linkId, x, y));
      return;
    }

    // moving container
    if (this.isMoving) {
      this.dx = e.clientX - this.startX;
      this.dy = e.clientY - this.startY;
      this.grid.nativeElement.style['background-position'] = `${this.dx}px ${this.dy}px`;
      return;
    }

    // selecting area
    if (this.isSelecting) {
      const x = (Math.min(this.startX, e.clientX) - this.containerX - this.dx) / this.scale;
      const y = (Math.min(this.startY, e.clientY) - this.containerY - this.dy) / this.scale;
      const width = Math.abs(this.startX - e.clientX) / this.scale;
      const height = Math.abs(this.startY - e.clientY) / this.scale;
      this.selectArea.nativeElement.style.left = `${x}px`;
      this.selectArea.nativeElement.style.top = `${y}px`;
      this.selectArea.nativeElement.style.width = `${width}px`;
      this.selectArea.nativeElement.style.height = `${height}px`;
      this.selectArea.nativeElement.style.display = 'block';
    }
  }

  mouseUp(e: MouseEvent) {
    if (this.isDrawing) {
      const inlet = (e.target as HTMLElement)!.closest('.inlet'); // TODO: classname from shared constant
      const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

      // connecting link to inlet
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
          const x = (outletX - this.containerX - this.dx) / this.scale;
          const y = (outletY - this.containerY - this.dy) / this.scale;
          this.store.dispatch(connectLink(this.linkId, targetId, x, y));
        }
      } else {
        this.store.dispatch(destroyLink(this.linkId));
      }
    }

    // selecting area
    if (this.isSelecting) {
      this.selectArea.nativeElement.style.display = 'none';
      const ax1 = (Math.min(this.startX, e.clientX) - this.containerX - this.dx) / this.scale;
      const ay1 = (Math.min(this.startY, e.clientY) - this.containerY - this.dy) / this.scale;
      const ax2 = (Math.max(this.startX, e.clientX) - this.containerX - this.dx) / this.scale;
      const ay2 = (Math.max(this.startY, e.clientY) - this.containerY - this.dy) / this.scale;

      const selection = this.state?.nodes.filter(node => {
        const element = document.querySelector(`[data-id="${node.id}"]`)!;
        const rect = element.getBoundingClientRect();

        const bx1 = node.x;
        const by1 = node.y;
        const bx2 = (node.x + rect.width / this.scale);
        const by2 = (node.y + rect.height / this.scale);

        // check if node is in select area
        return ax1 <= bx2 && bx1 <= ax2 && ay1 <= by2 && by1 <= ay2;
      }).map(node => node.id) as number[];
      this.store.dispatch(updateSelection(selection));
    }

    this.isDragging = false;
    this.isDrawing = false;
    this.isMoving = false;
    this.isSelecting = false;
    this.linkId = 0;
    this.startX = 0;
    this.startY = 0;
  }

  allowDrop(event: any) {
    event.preventDefault();
  }

  zoom(delta: number, mouseX = -1, mouseY = -1) {
    if (this.scale + delta < 0.1) {
      return;
    }

    // if zoom using buttons, shift relative to center
    if (mouseX < 0 && mouseY < 0) {
      const { width, height } = this.containerEl.nativeElement.getBoundingClientRect();
      mouseX = width / 2;
      mouseY = height / 2;
    }

    // zoom and shift relative to mouse position
    this.dx += (this.dx - mouseX) * delta / this.scale;
    this.dy += (this.dy - mouseY) * delta / this.scale;

    this.scale += delta;

    const size = GRID_SIZE * this.scale + 'px';
    this.grid.nativeElement.style['background-size'] = `${size} ${size}` // 50px 50px;
    this.grid.nativeElement.style['background-position'] = `${this.dx}px ${this.dy}px`;
  }

}

// TODO: simple history
// TODO: undo using ctrl+z (using immer)

// TODO: expand nodes

// todo: try refactor
// todo: abstract logic into service

// TODO: context menu
// TODO: classname from shared constant
// TODO: do not hover color of inlet if link was from inlet - pass state into dynamicNode component, and possibly node object
// TODO: copy/paste using ctrl+c/v

// todo: function for outelt position
// todo: multiple outlets
// todo: configure link

// TODO: configurable module
// TODO: reusable module

// TODO after prototype:
// - resizable nodes (using mouse)
