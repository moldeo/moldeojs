
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'control-project-content',
  templateUrl: './control-project-content.component.html',
  styleUrls: ['./control-project-content.component.css']
})
export class ControlProjectContent implements OnInit {
  @Input() project_name: string;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  onClick() {
    this.notify.emit('Click from nested component');
  }

  ngOnInit() {
  }

}
