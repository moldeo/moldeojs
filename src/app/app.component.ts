import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild } from '@angular/core';
import { BsModalRef , BsModalService } from 'ngx-bootstrap/modal';

import { ViewService } from "./view.service";

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
  //assets/molrepos/basic/07_ParticlesSimple/images
  sample: string = "molrepos/moldeoorg/fabri/EsferaEspiral/EspiralEsfera.mol";
  samples: string[] = [];
  viewservice : ViewService;

  public modalRef: BsModalRef; // {1}
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

  } // {2}

  ngOnInit() {
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
      //this.viewservice.addMoldeojsViewComponent(this.sample);
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

}
