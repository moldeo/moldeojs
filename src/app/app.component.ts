import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ViewService } from "./view.service";

import { CollaborativeService } from './collaborative.service';

import {MoldeojsViewComponent} from "./moldeojs-view/moldeojs-view.component";

import { Title }  from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isCollapsed: boolean = true;
  sample: string = "";
  samples: string[] = [];
  viewservice : ViewService;
  collaborativeService : CollaborativeService;
  msg : string;
  clients: number;
  @ViewChild('moldeojsview') moldeojsview: MoldeojsViewComponent;

  public modalRef: BsModalRef; // {1}
/*
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;*/

  constructor(private modalService: BsModalService,
    private titleService: Title,
    @Inject(ViewService) service,
  @Inject(ViewContainerRef) viewContainerRef,
@Inject(CollaborativeService) coservice ) {
    this.samples.push("molrepos/moldeoorg/Speak/Speak.mol");
    //this.samples.push("molrepos/basic/00_Image/00_Image.mol");
    //this.samples.push("molrepos/basic/01_Icon/01_Icon.mol");
    //this.samples.push("molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol");
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );"
    this.viewservice = service;
    this.viewservice.setRootViewContainerRef(viewContainerRef);
    this.collaborativeService = coservice;
    this.clients = 0;
  } // {2}

  ngOnInit() {
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
      //this.viewservice.addMoldeojsViewComponent(this.sample);
      this.collaborativeService
        .getMessage()
        .subscribe(msg => {
          this.msg = "Hola";
        });

        this.collaborativeService
          .getClients()
          .subscribe(clients=> {
            this.clients = clients;
          });

      this.sample = this.samples[0];
      var a = this.sample.lastIndexOf("/");
      var b = this.sample.lastIndexOf(".");
      var projectname = this.sample.substr(a+1, b-a-1);
      this.setTitle( projectname + " - MoldeoJS" );
  }

  sendMsg(msg){
    console.log("sendMsg:",msg);
     this.collaborativeService.sendMessage(msg);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template); // {3}
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  loadsample(event:any, index: number) : void {
    console.log("loadsample");
    console.log(event);
    console.log("Loading:",this.samples[index]);
    this.sample = this.samples[index];
  }

  collapsed(event: any): void {
    console.log(event);
  }

  expanded(event: any): void {
    console.log(event);
  }

  setTitle( title : string ) : void {
    this.titleService.setTitle(title);
  }

  onResize( event: any ) : void {
    //console.log("moldeojs app resize:",event, event.target.innerWidth);
    //console.log("must resize:",this.moldeojsview);
    var renderer : any = this.moldeojsview.GetConsole().m_pResourceManager.GetRenderMan().m_Renderer;
    if(renderer) {
      //console.log("resizing renderer",renderer,event.target.innerWidth,event.target.innerHeight);
      renderer.setSize(event.target.innerWidth,event.target.innerHeight);
    }
  }

}
