import { Component, ElementRef, HostListener, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { filter } from 'rxjs';
import { Constants, CONST } from 'src/app/services/constants.service';
import { GraphService } from 'src/app/services/graph.service';
import { Link, NodeX, PluginX, State } from 'src/app/types';

const GRID_SIZE = 50;

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkbenchComponent {
  @ViewChild('containerEl', { read: ElementRef }) containerEl!: ElementRef;
  @ViewChild('grid', { read: ElementRef }) grid!: ElementRef;
  @ViewChild('selectarea', { read: ElementRef }) selectArea!: ElementRef;

  isDragging = false; // dragging node
  isDrawingLink = false; // dragging ink 
  isMoving = false; // moving viewport
  isSelecting = false; // selecting area

  linkId = 0; // id of dragged link
  draggedLink?: Link;

  tempX = 0; // just for temporary use
  tempY = 0; // just for temporary use

  startX = 0; // also for temporary use
  startY = 0; // also for temporary use

  state!: State;

  scale = 1;
  dx = 0; // x of viewport
  dy = 0; // y of viewport

  constructor(@Inject(CONST) private constants: Constants, private graph: GraphService) {
    this.graph.state$.pipe(filter((x) => !!x)).subscribe((state) => {
      this.state = state;
    });
  }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    const { containerX, containerY } = this.getContainerPosition();
    event.preventDefault();
    if (event.deltaY !== 0) {
      this.zoom(event.deltaY / 1000, event.clientX - containerX, event.clientY - containerY);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
      event.preventDefault();
      this.graph.duplicateNodes();
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.graph.deleteNodes();
      this.graph.updateSelection([]);
    }

    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'a') {
        event.preventDefault();
        this.graph.updateSelection(this.state!.nodes.map((x) => x.id!));
      }

      if (event.key === 'z') {
        event.preventDefault();

        if (event.shiftKey) {
          this.graph.redo();
        } else {
          this.graph.undo();
        }
      }
    }
  }

  dropped(event: DragEvent) {
    const dataJson = event.dataTransfer!.getData('data');
    if (dataJson) {
      const data = JSON.parse(dataJson);
      const { containerX, containerY } = this.getContainerPosition();
      const x = (event.clientX - data.x - containerX - this.dx) / this.scale;
      const y = (event.clientY - data.y - containerY - this.dy) / this.scale;
      const plugin = data.plugin as PluginX;

      const node: NodeX = {
        x,
        y,
        name: plugin.name,
        selected: false,
        expanded: false,
        plugin: plugin
      };
      this.graph.addNode(node);
    }
  }

  mouseDown(e: MouseEvent) {
    const inlet = (e.target as HTMLElement)!.closest('.inlet');
    const outlet = (e.target as HTMLElement)!.closest('.outlet');
    const element = (e.target as HTMLElement)!.closest('[data-id]');
    const expander = (e.target as HTMLElement)!.closest('.expander');
    const link = (e.target as HTMLElement)!.closest('.link');
    const linkId = parseInt(link?.getAttribute('link-id')!, 10);
    const nodeId = parseInt(element?.getAttribute('data-id')!, 10);

    // click on link
    if (link) {
      console.log('link selected');
      const linkObj = this.state.links.find((x) => x.id === linkId)!;
      linkObj.selected = true;
      let selectedLinks = this.state.links.filter((x) => x.id !== linkId);
      selectedLinks.forEach((l) => {
        if (l.selected) {
          l.selected = false;
        }
      });
      return;
    }

    // click on expand button
    if (expander) {
      this.graph.expand(nodeId);
      return;
    }

    // dragging node
    if (!link && !outlet && !inlet && element) {
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.tempX = e.clientX;
      this.tempY = e.clientY;
      this.isDragging = true;
      let selection = this.state?.selection.slice()!;
      if (e.shiftKey) {
        if (this.state?.selection.includes(nodeId)) {
          selection = this.state.selection.filter((x) => x !== nodeId);
        } else {
          selection.push(nodeId);
        }
      } else {
        if (!selection.includes(nodeId)) {
          selection = [nodeId];
        }
      }
      this.graph.updateSelection(selection);
      return;
    }

    // new link from outlet
    if (outlet && element) {
      this.isDrawingLink = true;
      const node = this.state.nodes.find((x) => x.id === nodeId)!;
      const { containerX, containerY } = this.getContainerPosition();
      this.draggedLink = {
        id: -1,
        selected: false,
        sourceId: nodeId,
        x1: node.x + this.constants.nodeWidth,
        y1: node.y + this.constants.linkTopOffset,
        x2: (e.clientX - containerX - this.dx) / this.scale,
        y2: (e.clientY - containerY - this.dy) / this.scale,
      };
      this.linkId = this.draggedLink.id;
      this.state.links.push(this.draggedLink);
      return;
    }

    // existing link from inlet
    if (inlet && element) {
      const linkId = this.state?.links.find((link) => link.targetId === nodeId)?.id;
      if (linkId) {
        this.linkId = linkId;
        this.isDrawingLink = true;
      }
      return;
    }

    this.graph.updateSelection([]);

    // moving container
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      this.isMoving = true;
      this.startX = e.clientX - this.dx;
      this.startY = e.clientY - this.dy;
      return;
    }

    // selecting area
    this.isSelecting = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  mouseMove(e: MouseEvent) {
    const { containerX, containerY } = this.getContainerPosition();

    // dragging node
    if (this.isDragging) {
      const dx = e.clientX - this.tempX;
      const dy = e.clientY - this.tempY;
      this.tempX = e.clientX;
      this.tempY = e.clientY;

      this.state.selection.forEach((id) => {
        const node = this.state.nodes.find((x) => x.id === id)!;
        node.x += dx / this.scale;
        node.y += dy / this.scale;
        this.state.links.forEach((link) => {
          if (link.sourceId === id) {
            link.x1 += dx / this.scale;
            link.y1 += dy / this.scale;
          }
          if (link.targetId === id) {
            link.x2 += dx / this.scale;
            link.y2 += dy / this.scale;
          }
        });
      });
      return;
    }

    // drawing link
    if (this.isDrawingLink) {
      const dx = (e.clientX - containerX - this.dx) / this.scale;
      const dy = (e.clientY - containerY - this.dy) / this.scale;
      const link = this.state?.links.find((x) => x.id === this.linkId) || this.state?.links[this.state.links.length - 1];
      link.x2 = dx;
      link.y2 = dy;
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
      const x = (Math.min(this.startX, e.clientX) - containerX - this.dx) / this.scale;
      const y = (Math.min(this.startY, e.clientY) - containerY - this.dy) / this.scale;
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
    // link
    if (this.isDrawingLink) {
      const inlet = (e.target as HTMLElement)!.closest('.inlet'); // TODO: classname from shared constant
      const element = (e.target as HTMLElement)!.closest('[data-id]'); // TODO: classname from shared constant

      if (inlet && element) {
        const targetId = parseInt(element.getAttribute('data-id')!, 10);
        const target = this.state.nodes.find((x) => x.id === targetId)!;
        const source = this.state.nodes.find((x) => x.id === this.draggedLink!.sourceId)!;
        const existingLink = this.state?.links.find((link) => link.targetId === targetId && link.sourceId === source.id);
        if (!existingLink) {
          if (this.linkId === -1) {
            this.graph.createLink(source, target);
          } else {
            this.graph.updateLinkTarget(this.linkId, target);
          }
        }
      } else {
        if (this.linkId !== -1) {
          this.graph.destroyLink(this.linkId);
        }
      }
      this.state.links = this.state.links.filter((x) => x.id !== -1);
    }

    // node
    if (this.isDragging) {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      if (dx && dy) {
        this.graph.moveNodesBy(dx / this.scale, dy / this.scale, this.state!.selection);
      }
    }

    // selecting area
    if (this.isSelecting) {
      this.selectArea.nativeElement.style.display = 'none';
      const { containerX, containerY } = this.getContainerPosition();
      const ax1 = (Math.min(this.startX, e.clientX) - containerX - this.dx) / this.scale;
      const ay1 = (Math.min(this.startY, e.clientY) - containerY - this.dy) / this.scale;
      const ax2 = (Math.max(this.startX, e.clientX) - containerX - this.dx) / this.scale;
      const ay2 = (Math.max(this.startY, e.clientY) - containerY - this.dy) / this.scale;

      const selection = this.state?.nodes
        .filter((node) => {
          const element = document.querySelector(`[data-id="${node.id}"]`)!;
          const rect = element.getBoundingClientRect();

          const bx1 = node.x;
          const by1 = node.y;
          const bx2 = node.x + rect.width / this.scale;
          const by2 = node.y + rect.height / this.scale;

          // check if node is in select area
          return ax1 <= bx2 && bx1 <= ax2 && ay1 <= by2 && by1 <= ay2;
        })
        .map((node) => node.id) as number[];
      this.graph.updateSelection(selection);
    }

    this.isDragging = false;
    this.isDrawingLink = false;
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
    this.dx += ((this.dx - mouseX) * delta) / this.scale;
    this.dy += ((this.dy - mouseY) * delta) / this.scale;

    this.scale += delta;

    const size = GRID_SIZE * this.scale + 'px';
    this.grid.nativeElement.style['background-size'] = `${size} ${size}`; // 50px 50px;
    this.grid.nativeElement.style['background-position'] = `${this.dx}px ${this.dy}px`;
  }

  private getContainerPosition() {
    const containerRect = this.containerEl.nativeElement.getBoundingClientRect();
    const containerX = containerRect.left;
    const containerY = containerRect.top;
    return { containerX, containerY };
  }
}
