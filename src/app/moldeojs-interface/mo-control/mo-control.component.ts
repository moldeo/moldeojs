import { Component, OnInit, Input, Output, ViewChild, Renderer2, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MoControlService } from '../services/mo-control.service';
import { ConnectionsService } from '../services/connections.service';
import { ParamsService } from '../services/params.service';

@Component({
  selector: 'mo-control',
  templateUrl: './mo-control.component.html',
	styleUrls: ['./mo-control.component.css']
})

export class MoControl implements OnInit {
/*  @Input() public posX:number = 0;
  @Input() public posY:number = 0;
  @Input() public name:string = "";
  @Input() public key:string = "";
  @ViewChild('moPrecon') moPrecon;*/

  public globalMouseUp: () => void;
  public globalClick: () => void;
  public globalKey: () => void;

  constructor(
    /*public con: ConnectionsService,
    public par: ParamsService,*/
		public control: MoControlService,
    public renderer: Renderer2,
    public viewCon: ViewContainerRef,
    public sanitizer: DomSanitizer
  ) {
    //con.renderer = renderer;
  }

  public ngOnInit(): void {

  }

  public ngDoCheck(): void {

  }

  public ngAfterViewInit(): void {
    //taken from ngOnInit
/*
    let this_ = this;
    if (!this.moIcon)  { console.error("no this.moIcon"); return; }
    if (!this.moIcon.nativeElement) return;
    this.moIcon.nativeElement.attributes.type = this.motype; //Send Type
*/
    /*Global Listener*/
    /*this.globalMouseUp = this.renderer.listen("document", 'mouseup', () => {
      this_.drag = true;
    });
    this.globalClick = this.renderer.listen("document", 'click', (e) => {
      if(e.target.className !== "moParams" && e.target.className !== "moParamsContent"){
        this_.toggle = false;
      }

      if(this.globalKey){
        this.globalKey();
      }
    });*/
    //end taken from ngOnInit

  }

  public ngOnDestroy(): void {
    console.log("Destroy moObject");
    //DESTROY LISTENER WHEN DESTROY Component
    /*if(this.globalMouseUp){
      this.globalMouseUp();
    }
    if(this.globalClick){
      this.globalClick();
    }
    if(this.globalKey){
      this.globalKey();
    }*/
  }
  /*- LYFECYCLE END -*/

  ///////////////////////////////////////////////////////////////////
  /*- moObject Funs -*/
  ///////////////////////////////////////////////////////////////////
	public play(): void {
		console.log("play");
		this.control.play();
  }

  public stop(): void {
		console.log("stop");
		this.control.stop();
  }



}
