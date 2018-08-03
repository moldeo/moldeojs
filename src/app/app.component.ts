import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';

import { ViewService } from "./view.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class AppComponent implements OnInit {
  title = 'app';
  isCollapsed: boolean = true;
  sample: string = "molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol";
  samples: string[] = [];
  viewservice : ViewService;

/*
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;*/

  constructor(
    @Inject(ViewService) service,
    @Inject(ViewContainerRef) viewContainerRef) {
    this.samples.push("molrepos/basic/00_Image/00_Image.mol");
    this.samples.push("molrepos/basic/01_Icon/01_Icon.mol");
    this.samples.push("molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol");
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );"
    this.viewservice = service;
    this.viewservice.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {}

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
