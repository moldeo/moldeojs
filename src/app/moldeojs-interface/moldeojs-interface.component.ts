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
import { HttpClientModule } from '@angular/common/http';
import { HtmlContainer } from './htmlcontainer';
import { MoConfigService } from './services/mo-config.service';
import { MoDefaultComponent } from './mo-objects/mo-default/mo-default.component';
import { MoErase } from './mo-objects/mo-erase.component';
import { MoIcon } from './mo-objects/mo-icon.component';

import { moConsole } from '../mo-console';
import { moMobDefinition } from '../mo-moldeo-object';
import { PluginsDefinitionsMap, PluginsDefinitions, PluginsDefinitionsMapType,
  PluginsDefinitionsMapTypeArray, PluginsDefinitionsMapTypes,
   moPluginDefinition, moPluginExtension } from '../mo-plugin';
import { moMoldeoObjectType, moMoldeoObjectTypeToText } from '../mo-moldeo-object-type.enum';

//import { moConsoleState } from '../mo-console-state';
import { moDisplay } from '../mo-render-manager';
import { ConsoleService } from "../console.service";
import { MoldeojsViewComponent } from '../moldeojs-view/moldeojs-view.component';


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
  public m_Console : moConsole;
  public PreEffects : any;
  public Effects : any;
  public PostEffects : any;
  public IODevices : any;
  public Resources : any;
  public PluginsDefinitionsMap : any;
  public PluginsDefinitions : any;
  public PluginsDefinitionsMapType : any;
  public PluginsDefinitionsMapTypes : any;
  public PluginsDefinitionsMapTypeArray : any;
  public moMoldeoObjectTypeToText : any;

  @Input() mol: string;
  @Input() moldeojsview: MoldeojsViewComponent;
  /////////////////////////////////////////////
  /*- moWheel definitions -*/
  @ViewChild('moWheel', {static: false } ) moWheel: ElementRef;
  public moWheelDisplay:boolean = false;
  public moToolDisplay:boolean = false;
  /////////////////////////////////////////////
  /*- moConfig definitions, for save Components -*/
  @ViewChild('moConfig', {static: false } ) moConfig: ElementRef;
  containers: HtmlContainer[] = [];
  /////////////////////////////////////////////
  public moFileName: any = "No File (.MOL)";

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
      console.log( e.target, e.target.className, e.target.getAttribute("id") );
      //if(e.target.className !== "moObject" && e.target.className !== "moHeader" && e.target.className !== "moldeobutton"){
      if (e.target.getAttribute("id") === "moConnect") {
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

  public showmoView(e:any=false) : void {
    console.log("showmoView");

    if (this.moCanvas && this.moCanvas.nativeElement.getAttribute("class")=="hideme" ) {
      this.moCanvas.nativeElement.setAttribute("class","showme");
      this.moConfig.nativeElement.setAttribute("class","showme");
    } else {
      this.moCanvas.nativeElement.setAttribute("class","hideme");
      this.moConfig.nativeElement.setAttribute("class","hideme");
    }
  }

  public newMOObject(c: string, x:number, y:number, n:string, p:any, k:string): void {
    //Type, PosX, PosY, Name, Params
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
           componentRef.instance.objectname = c;
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
    console.log(typeof p);
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

  public _newMOObject( mob : any, x:number, y:number ) {

    this.moWheelDisplay=false;
    console.log("_newMOObject: ", mob );
    if (mob==undefined) return;

    //Push moComponent to moConfig
    const container = new HtmlContainer(this.moConfig.nativeElement, this.appRef, this.factory, this.injector);
    let componentRef;
    switch(""+mob.GetName()) {
       /*case 'erase':
           componentRef = container.attach(MoErase);
           break;*/
       /*case 'icon':
           componentRef = container.attach(MoIcon);
           break;*/
       default:
           componentRef = container.attach(MoDefaultComponent);
           componentRef.instance.setMob(mob);
           componentRef.instance.Console = this.m_Console;
    }

    if(x == undefined && y == undefined){
      componentRef.instance.posX = this.moWheel.nativeElement.style.left.replace("px","");
      componentRef.instance.posY = this.moWheel.nativeElement.style.top.replace("px","");
    }else{
      componentRef.instance.posX = x;
      componentRef.instance.posY = y;
    }

    componentRef.instance.motype = mob.GetName();
    componentRef.instance.type = mob.GetName();
    componentRef.instance.name = mob.GetConfigName()+".cfg";
    componentRef.instance.title = mob.GetLabelName();

    var p : any = mob.m_Config.m_Params;
    if (p && true) {
      let newParams:any = [];
      for (let i = 3; i < p.length; i++) {
        let att_name = p[i].m_ParamDefinition.m_Name;
        let att_values = [];
        if (p[i].m_Values.length) {
          for (let d = 0; d < p[i].m_Values[0].m_List.length; d++) {
            att_values[d] = p[i].m_Values[0].m_List[d].ToText();
          }
        }
        newParams[i-3] = [att_name, att_values];
      }
      componentRef.instance.params = newParams;
      console.log(componentRef.instance.params);
    }

/*    console.log(typeof p);
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
*/

/*
    if(k == undefined){
      componentRef.instance.key = "";
    }else{
      componentRef.instance.key = k;
    }
*/
    this.containers.push(container);

    //Log to Console
    console.log("moObject type "+componentRef.instance.type+" created sucessfully!");

  }

  public createMOObject( mob_plugin_def : any, x:number, y:number ) {
    var mob: any = undefined;
    console.log("createMOObject:",mob_plugin_def);
    try {
      //ask for label name and configname: icon_noname_00
      var MobDef : moMobDefinition = new moMobDefinition();
      MobDef.SetName( mob_plugin_def.m_Name );
      MobDef.SetConfigName( "noname" );
      MobDef.SetLabelName( "noname" );
      MobDef.SetKeyName( "K" );
      MobDef.SetType(mob_plugin_def.m_MoldeoObjectType)
      //  must be last index of the regroup
      //param_obj_index =
      //MobDef.SetConsoleParamIndex();
      //MobDef.SetConsoleValueIndex(param_obj_val_index);
      MobDef.SetActivate( true );
      //console.log("LoadObject:", MobDef);

      mob = this.m_Console.LoadObject( MobDef );
      if (mob) {
        mob.Init( _ => {
          this.m_Console.UpdateMoldeoIds();
          console.log("Created:", mob);
          this._newMOObject( mob, x, y );
        });
      }
    } catch(err) {
      console.error(err,mob);
    }
  }

  public loadNewMol(path:string): void{
    let this_ = this;
    //let projectName = path.substr(path.lastIndexOf('/') + 1);
    let projectName = path;

    let moFile = new XMLHttpRequest();
    //moFile.open("GET", path+"/"+projectName+".mol", true);
    moFile.open("GET", path, true);
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
      } else {
        console.error("moFile error:", moFile);
      }
    }
    moFile.send(null);

    this.moFileName = projectName;
  }

  public saveNewMol(): void{}

  public loadCFG(path:string, cfg_name:string, cfg_type:string, obj:number, index:number, key:string): void{
    let this_ = this;

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

  }

  ngOnChanges(changes: SimpleChanges) {

      console.log("MoldeojsInterfaceComponent::ngOnChanges > changes:", changes);
      if (changes["mol"]) {
        //const mol : string = changes["mol"];
        //this.loadNewMol( changes["mol"].currentValue );
      }
      if (changes["moldeojsview"]) {
        console.log("moldeojsview:", changes["moldeojsview"].currentValue);
        this.moldeojsview.loaded.subscribe( (evt) => {
          console.log('View Sample Loaded!', evt, this.moldeojsview.GetConsole().GetConfigName())
          this.loadedSample();
        } );
      }
  }

  public loadedSample() : void {
    this.m_Console = this.moldeojsview.GetConsole();
    this.moFileName = this.m_Console.GetConfigName();
    this.loadMobNodes();

    //activate mob by type to show on interface other views to same objects
    //Decomposition
    this.PreEffects = this.m_Console.m_EffectManager.PreEffects();

    //Composition (all possible effects, also a scene is an effect wich can regroup new DEC/COM/POST )
    this.Effects = this.m_Console.m_EffectManager.Effects();

    //Post Composition : (after effects)
    this.PostEffects = this.m_Console.m_EffectManager.PostEffects();

    //IO Device :
    this.IODevices = this.m_Console.m_pIODeviceManager.IODevices();

    //Resources
    this.Resources = this.m_Console.m_pResourceManager.Resources();

    //refresh MOB plugins available
    this.PluginsDefinitionsMap = PluginsDefinitionsMap;
    this.PluginsDefinitions = PluginsDefinitions;
    this.PluginsDefinitionsMapType = PluginsDefinitionsMapType;
    this.PluginsDefinitionsMapTypes = PluginsDefinitionsMapTypes;
    this.PluginsDefinitionsMapTypeArray = PluginsDefinitionsMapTypeArray;
    this.moMoldeoObjectTypeToText = moMoldeoObjectTypeToText;

  }

  public spiralPosition( position : number ) : any {
    // position: %
    // devuelve spiralPosition > 2d point
  }

  public tablePosition( position : number, total : number, cells_w : number = 3, cells_h : number = 3 ) : any {
    // tablePosition
    let max = Math.floor(cells_w*cells_h);
    let offset = Math.floor( position );
    let y = Math.floor( offset / cells_w );
    let x = offset - y * cells_w;
    console.log(position,x,y);
    return { x: x, y: y }
  }

  public loadMobNodes() : void {
    let nobs = this.m_Console.m_MoldeoObjects.length;
    this.m_Console.m_MoldeoObjects.forEach( ( mob_node, index, arr ) => {
      console.log( index, mob_node );
      if (mob_node) {
        var pos = this.tablePosition( index , nobs );
        this._newMOObject( mob_node, 300 + pos.x*130, 120 + pos.y*120  );
        /*
        this_.newMOObject(cfg_type,
          300+200*obj,
          80+80*index,
          cfg_name,
          xml.MOCONFIG[0].CONFIGPARAMS[0].PARAM,
          key);
        */

      }
    });
  }

}
