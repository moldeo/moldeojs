import { Component, ContentChild, ViewChild, ViewChildren, ElementRef, OnInit } from '@angular/core';
import * as ConsoleInterface from './MoldeoObjects';
import { ControlProjectContent } from './control-project-content/control-project-content.component';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Uploader }      from 'angular2-http-file-upload';
import { MyUploadItem }  from '../mo-file-manager';
//import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';

@Component({
  selector: 'moldeocontrol',
  templateUrl: './moldeo-control.component.html',
  styleUrls: ['./moldeo-control.component.css']
})
export class MoldeoControlComponent implements OnInit {

  m_MoldeoControlMode: string = "local";
  message: string = 'MoldeoControl';
  hostElement: ElementRef;
  projectfilecontent: string;
  //http: Http;

  //constructor(el: ElementRef) {
  constructor( public el: ElementRef, public uploaderService: Uploader ) {
    //this.http = new Http();
    this.hostElement = el;
  }

  submit() {
        console.log("submitting file!");
        let uploadFile = (<HTMLInputElement>window.document.getElementById('openproject')).files[0];

        let myUploadItem = new MyUploadItem(uploadFile);
        myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file

        this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
             // success callback
          console.log("uploaderService.onSuccessUpload");
        };
        this.uploaderService.onErrorUpload = (item, response, status, headers) => {
             // error callback
             console.log("uploaderService.onErrorUpload");
        };
        this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
             // complete callback, called regardless of success or failure
             console.log("uploaderService.onCompleteUpload");
        };
        this.uploaderService.upload(myUploadItem);
    }

  onNotifyProjectContent(event) {
    this.message = "MoldeoControl (Notified!)";
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
    var file = event.target.files[0];
    console.log("OpenProject changed! file:", file);
    this.submit();
/*
    var reader = new FileReader();
    reader.onload = file => {
      var contents: any = file.target;
      this.projectfilecontent = contents.result;
    };
*/
    //reader.readAsText(efile[0]);
    //console.log(reader.readAsText(fileName))
    /**
    let formData:FormData = new FormData();
    formData.append('degree_attachment', file, file.name);
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    this.http.post('http://url', formData,options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
            data => console.log('success'),
            error => console.log(error)
        )
  */
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
    //var el = this.hostElement.nativeElement;
    //console.log(el);
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
