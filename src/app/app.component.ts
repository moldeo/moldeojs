import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef , BsModalService } from 'ngx-bootstrap/modal';

import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';

import { ViewService } from "./view.service";
import * as THREE from "three";
import * as ProgressBar from "progressbar.js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isCollapsed: boolean = true;
  //sample: string = "molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol";
  //sample: string = "molrepos/basic/00_Image/00_Image.mol";
  //sample: string = "molrepos/basic/02_Plane/02_Plane.mol";
  //sample: string = "molrepos/basic/07_ParticlesSimple/07_ParticlesSimple.mol";
  //sample: string = "molrepos/basic/07_ParticlesSimple/07_ParticlesSimple.Sphere.mol";
  sample: string = "molrepos/haro/sonidovisto/sonidovisto.mol";
  //assets/molrepos/basic/07_ParticlesSimple/images
  sample: string = "molrepos/moldeoorg/fabri/EsferaEspiral/EspiralEsfera.mol";
  //sample: string = "molrepos/moldeoorg/dante/pajarosdefuego/pajaros_de_fuegoX.mol";
  samples: string[] = [];
  viewservice : ViewService;
  divstart : any = undefined;
  elstart : any = undefined
  progressbar : any = undefined;
  marge : number = 0;

  public modalRef: BsModalRef; // {1}

  @ViewChild('navmenu', {static: false } ) navmenu: ElementRef;
  @ViewChild(MoldeojsViewComponent, { static: false }) moldeojsview: MoldeojsViewComponent;
/*
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;*/

  constructor(private modalService: BsModalService,
    @Inject(ViewService) service,
  @Inject(ViewContainerRef) viewContainerRef) {
    this.samples.push("molrepos/basic/00_Image/00_Image.mol");
    this.samples.push("molrepos/basic/01_Icon/01_Icon.mol");
    this.samples.push("molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol");
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );"
    this.viewservice = service;
    this.viewservice.setRootViewContainerRef(viewContainerRef);
    window["MoldeoApp"] = this;

    this.divstart = document.createElement("div");
    this.divstart.setAttribute("id","startaudio");
    //this.divstart.setAttribute("class","ready_to_start");
    this.divstart.setAttribute("class","ready_to_load");
    this.divstart.setAttribute("style","display: block; position: fixed; z-index: 10001; left: 0px; top: 0px; width: 100%; height: 100%; background-color: rgba(0,0,0,0.98);");
    document.body.appendChild(this.divstart);

    this.elstart = document.createElement("button");
    this.elstart.setAttribute("id","btn_start");
    this.elstart.setAttribute("style","display: block; position: relative; left: 50%; top: 50%; margin-left: -50px; margin-top: -50px; border: solid 0px #BBB;width: 100px; height: 100px; color: #BBB; background-color: #000;border-radius: 50px; font-size: 14px;letter-spacing: 2px;font-weight: bold;");
    this.elstart.innerHTML = '<img src="assets/molrepos/haro/sonidovisto/favicon_haro.png" height="48" width="48" hspace="8" vpspac="8"/><span>start</span>';
    this.divstart.appendChild( this.elstart );

    this.progressbar = new ProgressBar.Circle('#btn_start', {
      color: 'white',
      strokeWidth: 2,
      duration: 2000, // milliseconds
      easing: 'easeInOut'
    });
    this.progressbar.animate(1.0);

  } // {2}

  onResize( event : any ) : void {
    console.log(event,event.target.innerWidth,event.target.innerHeight,event.target.innerHeight-this.marge);
    this.moldeojsview.Resize( event.target.innerWidth, event.target.innerHeight-this.marge);
  }

  ngOnInit() {
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
      //this.viewservice.addMoldeojsViewComponent(this.sample);
  }

  ngAfterViewInit () {
      console.log(this.moldeojsview);
      window["moldeodebug"] = window.location.href.indexOf("debug")>0;
      if (window["moldeodebug"]) {
        this.navmenu.nativeElement.style.display = "block";
      }
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  loadsample(event:any, index: number) : void {

    console.log("loadsample",this.moldeojsview);
    console.log(event);
    console.log("Loading:",this.samples[index]);

    var vars = document.getElementsByClassName("moldeo_var");
    var vls = [];
    for (var v = 0; v < vars.length; v++) {
      vls.push(vars[v]);
    }
    for (var v = 0; v < vls.length; v++) {
      document.body.removeChild(vls[v]);
    }

    var eclass;
    for(var i=1; i<=4; i++) {
      eclass = event.toElement.getAttribute("class");
      if (eclass) eclass = eclass.replace("active","").trim();
      else eclass = "";
      document.getElementById("sample_"+i).setAttribute("class",eclass);
    }
    eclass = event.toElement.getAttribute("class");
    event.toElement.setAttribute("class",eclass+" active");

    this.moldeojsview.audiooff();

    this.sample = this.samples[index];
    this.isCollapsed = true;
  }

  toggleplay() : void {
    console.log("toggle play",this.moldeojsview);
  }

  collapsed(event: any): void {
    console.log(event);
  }

  expanded(event: any): void {
    console.log(event);
  }

}
