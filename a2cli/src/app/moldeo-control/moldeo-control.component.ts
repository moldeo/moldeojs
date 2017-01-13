import { Component, ContentChild, ViewChild, ViewChildren, ElementRef, OnInit } from '@angular/core';
import * as ConsoleInterface from './MoldeoObjects';

@Component({
  selector: 'moldeocontrol',
  templateUrl: './moldeo-control.component.html',
  styleUrls: ['./moldeo-control.component.css']
})
export class MoldeoControlComponent implements OnInit {

  m_MoldeoControlMode: string = "local";
  message: string = 'MoldeoControl';
  hostElement: ElementRef;

  constructor(el: ElementRef) {
    this.hostElement = el;
  }

  @ViewChild('openproject') openproject: ElementRef;
  OpenProject() {
    var elx = this.openproject.nativeElement;
    console.log("OpenProject:", elx);
    elx.click();
  }

  getFileLater() {
    console.log(this.openproject.nativeElement.files[0]);
  }

  openprojectChanged(event) {
    console.log();
  }

  @ViewChild('importfile') importfile: ElementRef;
  ImportFile() {
    var elx = this.importfile.nativeElement;
    console.log("ImportFile:", elx);
    elx.click();
  }

  importfileChanged(event) {
    console.log(this.importfile.nativeElement.files[0]);
  }


  @ViewChild('saveasfile') saveasfile: ElementRef;
  SaveProject() {
    var elx = this.saveasfile.nativeElement;
    console.log("SaveProject:", elx);
    elx.click();
  }
  saveasfileChanged(event) {
    console.log(this.saveasfile.nativeElement.files[0]);
  }

  @ViewChild('saveasproject') saveasproject: ElementRef;
  SaveAsProject() {
    var elx = this.saveasproject.nativeElement;
    console.log("SaveAsProject:", elx);
    elx.click();
  }
  saveasprojectChanged(event) {
    console.log(event.target.files[0]);
  }

  @ViewChild('saveasscreenshot') saveasscreenshot: ElementRef;
  SaveAsScreenshot() {
    var elx = this.saveasscreenshot.nativeElement;
    console.log("saveasscreenshot:", elx);
    elx.click();
  }
  saveasscreenshotChanged(event) {
    console.log(event.target.files[0]);
  }

  @ViewChild('saveasvideo') saveasvideo: ElementRef;
  SaveAsVideo() {
    var elx = this.saveasvideo.nativeElement;
    console.log("saveasvideo:", elx);
    elx.click();
  }

  saveasvideoChanged(event) {
    console.log(event.target.files[0]);
  }

  ngOnInit() {
    var el = this.hostElement.nativeElement;
    console.log(el);
  }

  ngAfterContentInit() {
    //var el = this.openprojectEl.nativeElement;
    console.log("openproject>el",this.openproject);
  }

  @ViewChild("presentation") presentation: ElementRef;
  Presentation() : void {
    console.log("Presentation>el",this.presentation);
  }

  @ViewChild("screenshot") screenshot: ElementRef;
  Screenshot() : void {
    console.log("Screenshot>el",this.screenshot);

  }

  @ViewChild("previewshot") previewshot: ElementRef;
  PreviewShot() : void {
    console.log("PreviewShot>el",this.previewshot);

  }




}
