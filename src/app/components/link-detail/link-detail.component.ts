import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-detail',
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.scss']
})
export class LinkDetailComponent implements OnInit {
  @Input() data!: { x1: number; y1: number; x2: number; y2: number; id: number; selected: boolean };


  constructor() { }

  ngOnInit(): void {
  }

}
