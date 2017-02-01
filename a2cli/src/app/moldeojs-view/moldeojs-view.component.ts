import { Component, OnInit } from '@angular/core';
import { moConsole } from '../mo-console';
import { moConsoleState } from '../mo-console-state';
import { ConsoleService } from "../console.service";

@Component({
  selector: 'moldeojs-view',
  templateUrl: './moldeojs-view.component.html',
  styleUrls: ['./moldeojs-view.component.css']
})
export class MoldeojsViewComponent implements OnInit {

  message: string = "- no project -";

  constructor( private MoldeoCS : ConsoleService ) {
  }

  ngOnInit() {
    console.log("MoldeojsViewComponent::ngOnInit >  this.MoldeoCS.m_Console:", this.MoldeoCS.m_Console);
  }

}
