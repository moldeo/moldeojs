import { Component, OnInit, ElementRef } from '@angular/core';


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
  hostElement: ElementRef;

  constructor(el: ElementRef, private MoldeoCS: ConsoleService) {
    this.hostElement = el;
  }

  ngOnInit() {
    this.MoldeoCS.updated$.subscribe((result) => {
      if (result == true) {
        console.log("MoldeojsView > Console Service OK! Associate renderer to HTML Element", this.MoldeoCS.m_Console);
        var RMan = this.MoldeoCS.m_Console.m_pResourceManager.MORenderMan;
        this.hostElement.nativeElement.appendChild( RMan.m_Renderer.domElement );
        RMan.m_Renderer.clear();
        this.animate();
      }
    });
  }

  public animate() {
    window.requestAnimationFrame(_=>this.animate() );
    if (this.MoldeoCS.m_Console.Initialized()) {
      if (this.MoldeoCS.m_Console.Interaction()) {
        this.MoldeoCS.m_Console.Draw();
        this.MoldeoCS.m_Console.Update();
      }
    } else {
      this.MoldeoCS.m_Console.TestScreen();
    }
  }

}
