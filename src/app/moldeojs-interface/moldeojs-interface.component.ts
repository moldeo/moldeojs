import { BrowserModule } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
  ApplicationRef,
  Type,
  Input,
  SimpleChange, SimpleChanges
} from '@angular/core';
import { HtmlContainer } from './htmlcontainer';
import { MoConfigService } from './services/mo-config.service';
import { MoDefaultComponent } from './mo-objects/mo-default/mo-default.component';
import { MoErase } from './mo-objects/mo-erase.component';
import { MoIcon } from './mo-objects/mo-icon.component';

@Component({
  selector: 'moldeojs-interface',
  templateUrl: './moldeojs-interface.component.html',
  styleUrls: ['./moldeojs-interface.component.css']
})
export class MoldeojsInterfaceComponent implements OnInit {
  /////////////////////////////////////////////
  public title = 'MoldeoJS Interface';
  public preeffects:any;
  public effects:any;


  @Input() mol: string;
  /////////////////////////////////////////////
  /*- moWheel definitions -*/
  @ViewChild('moWheel', {static: false } ) moWheel: ElementRef;
  public moWheelDisplay:boolean = false;
  /////////////////////////////////////////////
  /*- moConfig definitions, for save Components -*/
  @ViewChild('moConfig', {static: false } ) moConfig: ElementRef;
  containers: HtmlContainer[] = [];
  /////////////////////////////////////////////
  public moFileName:string = "No File (.MOL)";

  @ViewChild('moCanvas', {static: false } ) moCanvas: ElementRef;
  /////////////////////////////////////////////
  //- Listeners -//
  public configDblClick: () => void;
  public globalKeyDown: () => void;

  constructor(
    private renderer: Renderer2,
    private factory: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private config: MoConfigService
  ){}

  public ngOnInit(): void {
    this.configDblClick = this.renderer.listen("document", 'dblclick', (e) => {
      if(e.target.className !== "moObject" && e.target.className !== "moHeader" && e.target.className !== "moldeobutton"){
          this.showWheel(e);
      }
    });
    //this.loadNewMol("./assets/molrepos/01_Icon");
  }

  public ngDoCheck(): void {
    if(!this.moWheelDisplay){
      if(this.globalKeyDown){
          this.globalKeyDown(); //Remove the KeyDown Listener
      }
    }
  }

  public ngAfterViewInit(): void {}

  public autoLayout(): void {
    console.log("Init Automatic LayOut");
    let posY = [];
    let posX = [];
    for(let i=0;i<this.moConfig.nativeElement.children.length;i++){
      posY[i] = parseInt(this.moConfig.nativeElement.children[i].children[0].style.top.replace("px",""));
      posX[i] = parseInt(this.moConfig.nativeElement.children[i].children[0].style.left.replace("px",""));
      if(posY[i] % 60 !== 0){
        posY[i] = Math.round(posY[i] / 60) * 60;
      }
      if(posX[i] % 60 !== 0){
        posX[i] = Math.round(posX[i] / 60) * 60;
      }
      this.moConfig.nativeElement.children[i].children[0].style.top = posY[i]+"px";
      this.moConfig.nativeElement.children[i].children[0].style.left = posX[i]+"px";
    }
    console.log("Automatic LayOut Ended");
  }

  public showWheel(e:any): void {
    this.moWheelDisplay = true;
    this.moWheel.nativeElement.style.left = e.clientX-40+"px";
    this.moWheel.nativeElement.style.top = e.clientY-40+"px";
    ///////////////////////////
    this.globalKeyDown = this.renderer.listen("document", "keydown", (e) => {
      console.log(e.key);
    });
  }

  public showmoView(e:any) : void {
    console.log("showmoView");

    if (this.moCanvas && this.moCanvas.nativeElement.getAttribute("class")=="hideme" ) {
      this.moCanvas.nativeElement.setAttribute("class","showme");
      this.moConfig.nativeElement.setAttribute("class","showme");
    } else {
      this.moCanvas.nativeElement.setAttribute("class","hideme");
      this.moConfig.nativeElement.setAttribute("class","hideme");
    }
  }

  public newMOObject(c: string, x:number, y:number, n:string, p:any, k:string): void { //Type, PosX, PosY, Name, Params
    //Hide moWheel
    this.moWheelDisplay=false;

    //Push moComponent to moConfig
    const container = new HtmlContainer(this.moConfig.nativeElement, this.appRef, this.factory, this.injector);
    let componentRef;
    switch(c) {
       case 'erase':
           componentRef = container.attach(MoErase);
           break;
       case 'icon':
           componentRef = container.attach(MoIcon);
           break;
       default:
           componentRef = container.attach(MoDefaultComponent);
    }

    if(x == undefined && y == undefined){
      componentRef.instance.posX = this.moWheel.nativeElement.style.left.replace("px","");
      componentRef.instance.posY = this.moWheel.nativeElement.style.top.replace("px","");
    }else{
      componentRef.instance.posX = x;
      componentRef.instance.posY = y;
    }

    if(n == undefined){
      componentRef.instance.name = c;
    }else{
      componentRef.instance.name = n;
    }

    if(p != undefined){
      let newParams:any = [];
      for (let i = 3; i < p.length; i++) {
        let att_name = p[i]._attributes.name;
        let att_values = [];
        for (let d = 0; d < p[i].VAL[0].D.length; d++) {
          att_values[d] = p[i].VAL[0].D[d]._text;
        }
        newParams[i-3] = [att_name, att_values];
      }
      componentRef.instance.params = newParams;
    }

    if(k == undefined){
      componentRef.instance.key = "";
    }else{
      componentRef.instance.key = k;
    }

    this.containers.push(container);

    //Log to Console
    console.log("moObject type "+componentRef.instance.type+" created sucessfully!");
  }

  public loadNewMol(path:string): void{
    let this_ = this;
    let projectName = path.substr(path.lastIndexOf('/') + 1);
/*
    let moFile = new XMLHttpRequest();
    moFile.open("GET", path+"/"+projectName+".mol", true);
    moFile.onreadystatechange = function (){
      if(moFile.readyState === 4){
        if(moFile.status === 200 || moFile.status == 0){
          let xml = this_.config.loadXML(moFile.responseText);

          let preeffects = xml.MOCONFIG[0].CONFIGPARAMS[0].PARAM[4];
          for (let i = 0; i < preeffects.VAL.length; i++) {
            this_.loadCFG(path, preeffects.VAL[i].D[1]._text[0], preeffects.VAL[i].D[0]._text[0], 0, i, preeffects.VAL[i].D[5]._text[0]);
          }

          let effects = xml.MOCONFIG[0].CONFIGPARAMS[0].PARAM[5];
          for (let i = 0; i < effects.VAL.length; i++) {
            this_.loadCFG(path, effects.VAL[i].D[1]._text[0], effects.VAL[i].D[0]._text[0], 1, i, effects.VAL[i].D[5]._text[0]);
          }

        }
      }
    }
    moFile.send(null);
    */
    this.moFileName = projectName;
  }

  public saveNewMol(): void{}

  public loadCFG(path:string, cfg_name:string, cfg_type:string, obj:number, index:number, key:string): void{
    let this_ = this;
    /*
    let cfgFile = new XMLHttpRequest();
    cfgFile.open("GET", path+"/"+cfg_name+".cfg", true);
    cfgFile.onreadystatechange = function (){
      if(cfgFile.readyState === 4){
        if(cfgFile.status === 200 || cfgFile.status == 0){
          let xml = this_.config.loadXML(cfgFile.responseText);
          this_.newMOObject(cfg_type, 300+200*obj, 80+80*index, cfg_name, xml.MOCONFIG[0].CONFIGPARAMS[0].PARAM, key);
        }
      }
    }
    cfgFile.send(null);
    */
  }

  ngOnChanges(changes: SimpleChanges) {

      console.log("MoldeojsInterfaceComponent::ngOnChanges > changes:", changes);
      if (changes["mol"]) {
        //const mol : string = changes["mol"];
        this.loadNewMol( changes["mol"].currentValue );
      }
  }

}
