import { Component, OnInit, ElementRef } from '@angular/core';


import { moConsole } from '../mo-console';
import { moConsoleState } from '../mo-console-state';
import { ConsoleService } from "../console.service";

import { JsonService } from '../json.service';
import { FileAdminService } from '../fileadmin.service';

@Component({
  selector: 'moldeojs-view',
  templateUrl: './moldeojs-view.component.html',
  styleUrls: ['./moldeojs-view.component.css']
})
export class MoldeojsViewComponent implements OnInit {

  message: string = "- no project -";
  hostElement: ElementRef;
  test: number = 0;
  testmax: number = 120;

  jsonRute : string = 'assets/jsonprueba.json';
  jsonInit : any;

  constructor(el: ElementRef, private MoldeoCS: ConsoleService,
    private jsonService: JsonService,
    private fileadminService: FileAdminService) {
    this.hostElement = el;

    jsonService.getJson(this.jsonRute).subscribe(val => {
      this.jsonInit = val;
      console.log("JSON:", this.jsonInit);

      fileadminService.downloadFile('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',"assets", "nombre", "jpg");
    });
  }

  ngOnInit() {
    this.MoldeoCS.updated$.subscribe((result) => {
      if (result == true) {
        //console.log("MoldeojsView > Console Service OK! Associate renderer to HTML Element", this.MoldeoCS.m_Console);
        var RMan = this.MoldeoCS.m_Console.m_pResourceManager.MORenderMan;
        this.hostElement.nativeElement.appendChild( RMan.m_Renderer.domElement );
        RMan.m_Renderer.clear();
        this.test = 0;
        this.animate();
      }
    });

    //this.MoldeoCS.Init({ "consoleconfig": "molrepos/basic/00_Image/00_Image.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "molrepos/basic/01_Icon/01_Icon.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "molrepos/basic/02_Plane/02_Plane.mol" } );
    this.MoldeoCS.Init({ "consoleconfig": "molrepos/basic/07_ParticlesSimple/07_ParticlesSimple.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "molrepos/museo/mural/mural_partis.mol" } );
  }

  public animate() {
    //console.log("animate");
    window.requestAnimationFrame(_=>this.animate() );
    //console.log("animate: ",this.test);
    if (this.test < this.testmax) {
      //console.log("Running TestScreen!");
      this.MoldeoCS.m_Console.TestScreen();
      this.test = Number(this.test) + Number(1);
      this.message = ""+this.test;
    } else
    if (this.MoldeoCS.m_Console.Initialized()) {
      //console.log("Running Console animation!");
      this.message = "Running "+this.MoldeoCS.m_Console.GetConfigName();
      if (this.MoldeoCS.m_Console.Interaction()) {
        this.MoldeoCS.m_Console.Draw(undefined);
        this.MoldeoCS.m_Console.Update();
      }
    }
  }

}
