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
import { MoControlService } from './services/mo-control.service';
import { MoDefaultComponent } from './mo-objects/mo-default/mo-default.component';
import { MoErase } from './mo-objects/mo-erase.component';
import { MoIcon } from './mo-objects/mo-icon.component';

import { moConsole } from '../mo-console';
import { moTouchEdit } from '../mo-touch-edit';
import { moPresetWheel } from '../mo-preset-wheel';
import { moObjectsSphere, moParamsSphere, moTimeSphere } from '../mo-spheres';
import { moHistory } from '../mo-history';
import { moProjectStates } from '../mo-project-states';
import { moSetObjectScope } from '../mo-math-manager';
import { moChannel } from '../mo-channel';
import { moMobDefinition } from '../mo-moldeo-object';
import { PluginsDefinitionsMap, PluginsDefinitions, PluginsDefinitionsMapType,
  PluginsDefinitionsMapTypeArray, PluginsDefinitionsMapTypes,
   moPluginDefinition, moPluginExtension } from '../mo-plugin';
import { moMoldeoObjectType, moMoldeoObjectTypeToText } from '../mo-moldeo-object-type.enum';

//import { moConsoleState } from '../mo-console-state';
import { moFile } from '../mo-file-manager';
import { moDisplay } from '../mo-render-manager';
import { ConsoleService } from "../console.service";
import { MoldeojsViewComponent } from '../moldeojs-view/moldeojs-view.component';
import { MoControl } from './mo-control/mo-control.component';


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
  @ViewChild('moWheel') moWheel: ElementRef;
  public moWheelDisplay:boolean = false;
  public moToolDisplay:boolean = false;
  /////////////////////////////////////////////
  /*- moConfig definitions, for save Components -*/
  @ViewChild('moConfig') moConfig: ElementRef;
  public moEditDisplay:boolean = false;
  public touchEdit: moTouchEdit = null;
  public presetWheel: moPresetWheel = null;
  public objectsSphere: moObjectsSphere = null;
  public paramsSphere: moParamsSphere = null;
  public timeSphere: moTimeSphere = null;
  public projectStates: moProjectStates = null;
  public channel: moChannel = null;
  /** #918 H1 — deshacer / rehacer */
  public history: moHistory = new moHistory();
  public undoLabel: string = "";
  public doUndo(): void {
    if (this.channel) this.channel.send({ verb: "undo" });
    const w = this.history.undo();
    if (w) { this.undoLabel = "↶ " + w; if (this.touchEdit) this.touchEdit.log("undo", { what: w }); if (this.presetWheel) this.presetWheel.render(); if (this.paramsSphere) this.paramsSphere.render(); setTimeout(() => this.undoLabel = "", 2000); }
  }
  public doRedo(): void {
    if (this.channel) this.channel.send({ verb: "redo" });
    const w = this.history.redo();
    if (w) { this.undoLabel = "↷ " + w; if (this.touchEdit) this.touchEdit.log("redo", { what: w }); if (this.presetWheel) this.presetWheel.render(); if (this.paramsSphere) this.paramsSphere.render(); setTimeout(() => this.undoLabel = "", 2000); }
  }
  /** #918 L2 — ?save=<ruta del Lab> ⇒ botón Guardar: manda el XML de la consola y de cada .cfg */
  public saveUrl: string = (() => { try { const v = new URLSearchParams(window.location.search).get("save");
    return (v && v.charAt(0) == "/" && v.indexOf("//") < 0) ? v : ""; } catch (e) { return ""; } })();
  public saveState: string = "";

  public saveProject(): void {
    if (!this.saveUrl || !this.m_Console) return;
    const files: any = {};
    const mol = new URLSearchParams(window.location.search).get("mol") || "";
    const molName = mol.split("/").pop();
    const cc: any = this.m_Console.m_Config;
    if (cc && cc.ToXML && molName) files[molName] = cc.ToXML();
    for (const fx of this.m_Console.m_EffectManager.m_AllEffects) {
      try {
        const cfg: any = fx.GetConfig();
        const name = "" + fx.GetMobDefinition().GetConfigName();
        if (cfg && cfg.ToXML && name) files[name + ".cfg"] = cfg.ToXML();
      } catch (e) {}
    }
    this.saveState = "Guardando…";
    fetch(this.saveUrl, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { files } }) })
      .then((r) => r.json())
      .then((j) => {
        const ok = j && j.result && j.result.ok;
        const v = ok && j.result.version != null ? " v" + j.result.version : "";
        this.saveState = ok ? "Guardado ✓" + v : ("No se guardó: " + ((j && j.result && j.result.error) || (j && j.error && j.error.message) || "error"));
        if (this.touchEdit) this.touchEdit.log("save", { ok: !!ok, n: Object.keys(files).length });
        setTimeout(() => { this.saveState = ""; }, 4000);
      })
      .catch((e) => { this.saveState = "No se guardó (sin conexión)"; });
  }
  /** #918 H2 — versiones: mismo contrato en el Lab (/e/<slug>/mol-versions) y en el Director (/proj-versions) */
  public versionsOpen: boolean = false;
  public versions: any[] = [];
  public versionsMsg: string = "";
  private versionUrl(kind: string): string { return this.saveUrl.replace(/-save$/, "-" + kind); }
  private rpc(url: string, params: any): Promise<any> {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params }) })
      .then((r) => r.json()).then((j) => (j && j.result) || { ok: false, error: (j && j.error && j.error.message) || "error" });
  }
  /** el Lab manda UTC "AAAA-MM-DD hh:mm:ss"; el Director, ISO con huso */
  public versionDate(d: string): string {
    try { const t = new Date(d.indexOf("T") < 0 ? d.replace(" ", "T") + "Z" : d);
      return isNaN(t.getTime()) ? d : t.toLocaleString(); } catch (e) { return d; }
  }
  public toggleVersions(): void {
    this.versionsOpen = !this.versionsOpen;
    if (!this.versionsOpen) return;
    this.versionsMsg = "Cargando…"; this.versions = [];
    this.rpc(this.versionUrl("versions"), {}).then((r) => {
      this.versions = r.ok ? (r.versions || []) : [];
      this.versionsMsg = r.ok ? (this.versions.length ? "" : "Todavía no hay versiones: cada Guardar deja una.") : ("No se pudo: " + r.error);
    }).catch(() => this.versionsMsg = "Sin conexión");
  }
  public restoreVersion(v: any): void {
    if (!window.confirm("¿Volver a la versión v" + v.number + "? Lo actual queda guardado en el historial sólo si lo guardaste antes.")) return;
    this.versionsMsg = "Restaurando v" + v.number + "…";
    this.rpc(this.versionUrl("restore"), { version: v.number }).then((r) => {
      if (r.ok) { if (this.touchEdit) this.touchEdit.log("restore", { from: v.number }); window.location.reload(); }
      else this.versionsMsg = "No se restauró: " + r.error;
    }).catch(() => this.versionsMsg = "Sin conexión");
  }
  /** #918 P10 — «la persona»: la carta LDP de una persona (servida por el Lab en /e/<slug>/mol-io) mueve
   *  sol y luna. El Lab calcula los params (un solo lugar del mapeo); acá sólo se aplican y viajan al Player. */
  public personaUrl: string = (() => { try { const m = new URLSearchParams(window.location.search).get("mol") || "";
    const r = /^(\/e\/[^\/?#]+)\/mol\//.exec(m); return r ? r[1] + "/mol-io" : ""; } catch (e) { return ""; } })();
  public personas: any[] = [];
  public personaId: string = "";
  public personaMsg: string = "";
  private loadPersonas(): void {
    if (!this.personaUrl || (this.channel && this.channel.isPlayer())) return;
    this.rpc(this.personaUrl, {}).then((r) => { this.personas = (r.ok && r.personas) || []; }).catch(() => {});
  }
  public choosePersona(id: string): void {
    this.personaId = id;
    if (!id) return;
    this.personaMsg = "…";
    this.rpc(this.personaUrl, { persona: Number(id) }).then((r) => {
      if (!r.ok) { this.personaMsg = "No se pudo: " + r.error; return; }
      this.applyPersonaParams(r.params || {}, r.estado);
      if (this.channel) this.channel.send({ verb: "persona", params: r.params || {}, estado: r.estado || "" });
      if (this.touchEdit) this.touchEdit.log("persona", { id: r.persona && r.persona.id });
      this.personaMsg = ""; if (this.presetWheel) this.presetWheel.render();
    }).catch(() => this.personaMsg = "Sin conexión");
  }
  /** {"sol.pos_cuad_x": n, "luna.texture": i, …}: los números van al VAL del preset activo (como el touch);
   *  `texture` es un índice (las texturas no interpolan, igual que en los estados de proyecto). */
  public applyPersonaParams(params: any, estado?: string): void {
    if (!this.m_Console) return;
    /* L7 — «el cielo acompaña al sol» (opcional, lo decide el binding): primero el estado de día, con corte duro
       para que su transición no arrastre las posiciones; después los valores de la carta encima. */
    if (estado && this.projectStates) {
      const i = this.projectStates.states().findIndex((st: any) => ("" + st.m_Name) == estado);
      if (i >= 0) this.projectStates.call(i, 0);
    }
    const TE = this.touchEdit, seen: any[] = [];
    if (TE) TE.applying = true;          /* un solo mensaje «persona» al Player, no un valueset por param */
    try {
      for (const k of Object.keys(params)) {
        const i = k.indexOf("."); if (i < 0) continue;
        const label = k.slice(0, i), pname = k.slice(i + 1), v = Number(params[k]);
        const fx = this.m_Console.m_EffectManager.m_AllEffects.find((e: any) => ("" + e.GetLabelName()) == label);
        if (!fx || isNaN(v)) continue;
        if (this.history && seen.indexOf(fx) < 0) { this.history.record(fx, "persona"); seen.push(fx); }
        if (pname == "texture") {
          const P = fx.GetConfig().m_ParamsByName[pname];
          if (P && v >= 0 && v < P.GetValuesCount()) P.SetIndexValue(v);
        } else if (TE) TE.setNumber(fx, pname, v);
      }
    } finally { if (TE) TE.applying = false; }
  }
  /////////////////////////////////////////////
  /*- moControl definitions, for control -*/
  //@ViewChild('moControl') moControl: ElementRef;
  public moControlDisplay:boolean = false;
  containers: HtmlContainer[] = [];
  /////////////////////////////////////////////
  public moFileName: any = "No File (.MOL)";

  @ViewChild('moCanvas') moCanvas: ElementRef;

  @ViewChild(MoControl) moControlComp : MoControl;
  /////////////////////////////////////////////
  //- Listeners -//
  public configDblClick: () => void;
  public globalKeyDown: () => void;

  constructor(
    private renderer: Renderer2,
    private factory: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private config: MoConfigService,
    private control: MoControlService
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

  /** #918 D2/F15 — aplica un mensaje del canal por los mismos caminos que la interfaz (Player y reproducir toma) */
  applyRemote(m: any) {
    const W = this.presetWheel, PS = this.projectStates, TE = this.touchEdit;
    if (!m || !m.verb || !W) return;
    const byLabel = (l: string) => this.m_Console.m_EffectManager.m_AllEffects.find((e: any) => ("" + e.GetLabelName()) == l);
    if (m.verb == "mode") { W.mode = m.mode; return; }
    if (m.verb == "undo") { this.doUndo(); return; }
    if (m.verb == "redo") { this.doRedo(); return; }
    if (m.verb == "play") { if (!PS.playing) PS.play(m.group); return; }
    if (m.verb == "pause") { PS.pause(); return; }
    if ((m.verb == "preconfigset" || m.verb == "preconfigsave") && W.selectByLabel(m.label)) {
      if (m.mode) W.mode = m.mode;
      if (m.verb == "preconfigset") W.call(m.i, !!m.hard); else W.capture(m.i);
      return;
    }
    if (m.verb == "propose" && W.selectByLabel(m.label)) { W.propose(m.seed); return; }
    if (m.verb == "proposekeep" && W.selectByLabel(m.label)) { W.keepProposal(m.i); return; }
    if (m.verb == "proposedrop" && W.selectByLabel(m.label)) { W.dropProposals(); return; }
    if (m.verb == "objectenable" || m.verb == "objectdisable") {
      const fx = byLabel(m.label); if (fx) { if (m.verb == "objectenable") fx.Activate(); else fx.Deactivate(); }
      return;
    }
    if (m.verb == "persona") { this.applyPersonaParams(m.params || {}, m.estado); return; }
    if (m.verb == "valueset") {
      const fx = byLabel(m.label);
      if (fx) { if (this.history && m.rec !== false) this.history.record(fx, "mover"); TE.applying = true; TE.setNumber(fx, m.param, m.value); TE.applying = false; }
    }
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

  public showmoEditView(e:any=false) : void {
    console.log("showmoEditView");
    this.moEditDisplay = !this.moEditDisplay;
    if (this.touchEdit) this.touchEdit.enabled = this.moEditDisplay;
    /*if (this.moCanvas && this.moCanvas.nativeElement.getAttribute("class")=="hideme" ) {
      this.moCanvas.nativeElement.setAttribute("class","showme");
      this.moConfig.nativeElement.setAttribute("class","showme");
    } else {
      this.moCanvas.nativeElement.setAttribute("class","hideme");
      this.moConfig.nativeElement.setAttribute("class","hideme");
    }*/
  }

  public showmoControlView(e:any=false) : void {
    console.log("showmoControlView");
    this.moControlDisplay = !this.moControlDisplay;
    //this.moControlComp.toggleShow();
    /*if (this.moControl && this.moControl.nativeElement.getAttribute("class")=="hideme" ) {
      this.moControl.nativeElement.setAttribute("class","showme");
    } else {
      this.moControl.nativeElement.setAttribute("class","hideme");
    }*/
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
          if (evt=="effects_loaded") {

          }
          if (evt=="effects_started") {
            //TODO: start reading in real time some values please
            console.log('View Sample Loaded!', evt, this.moldeojsview.GetConsole().GetConfigName())
            this.loadedSample();
          }
        } );
      }
  }

  public loadedSample() : void {
    console.log("moldeojs-interface loadedSample!")
    this.m_Console = this.moldeojsview.GetConsole();
    /* #918 P8: las capas se pueden leer desde expresiones: sol.pos_cuad_y */
    moSetObjectScope(this.m_Console.m_EffectManager.m_AllEffects);
    /* #918 E1: tocar/arrastrar capas sobre la pantalla en modo edición */
    if (!this.touchEdit) {
      this.touchEdit = new moTouchEdit(this.m_Console, () => [this.moCanvas && this.moCanvas.nativeElement]);
      this.touchEdit.enabled = this.moEditDisplay;
      (window as any).moTouchEdit = this.touchEdit;
    }
    /* #918 E1.5: rueda de presets (borrador) */
    if (!this.presetWheel) {
      this.projectStates = new moProjectStates(this.m_Console);
      (window as any).moProjectStates = this.projectStates;
      this.presetWheel = new moPresetWheel(this.m_Console, this.projectStates);
      this.presetWheel.onCall = (fx, i) => this.touchEdit && this.touchEdit.log("preset", { fx: "" + fx.GetLabelName(), i, name: "" + fx.GetConfig().m_PreConfigs[i].m_Name });
      this.touchEdit.onSelect = (fx) => { if (fx) this.presetWheel.setLayer(fx); };
      this.presetWheel.onCapture = (fx, i) => this.touchEdit && this.touchEdit.log("capture", { fx: "" + fx.GetLabelName(), i, name: "" + fx.GetConfig().m_PreConfigs[i].m_Name });
      (window as any).moPresetWheel = this.presetWheel;
      this.presetWheel.history = this.history;
      /* #918 D2: canal Control → Player */
      const ch = new moChannel();
      this.channel = ch;
      this.presetWheel.channel = ch; this.projectStates.channel = ch; this.touchEdit.channel = ch;
      /* #918 F15: las otras tres esferas + REC (el canal pasa por la toma) */
      const W = this.presetWheel, PS = this.projectStates, TE = this.touchEdit;
      this.objectsSphere = new moObjectsSphere(this.m_Console);
      this.paramsSphere = new moParamsSphere();
      this.timeSphere = new moTimeSphere(PS);
      this.objectsSphere.channel = ch;
      this.paramsSphere.touchEdit = TE; this.paramsSphere.history = this.history;
      this.timeSphere.wheel = W;
      (window as any).moSpheres = { objects: this.objectsSphere, params: this.paramsSphere, time: this.timeSphere };
      const focus = (fx: any) => {
        if (!fx || fx.isProject) return;
        W.setLayer(fx); this.objectsSphere.setFocus(fx); this.paramsSphere.setFocus(fx);
      };
      this.objectsSphere.onFocus = focus;
      this.touchEdit.onSelect = (fx) => focus(fx);
      W.onLayer = (fx) => { if (fx && !fx.isProject) { this.objectsSphere.setFocus(fx); this.paramsSphere.setFocus(fx); } };
      const f0 = W.layer() && !W.layer().isProject ? W.layer() : (this.m_Console.m_EffectManager.Effects() || [])[0];
      if (f0) { this.objectsSphere.setFocus(f0); this.paramsSphere.setFocus(f0); }
      const prevChange = PS.onChange;
      PS.onChange = () => { if (prevChange) prevChange(); this.timeSphere.render(); };
      const rawSend = ch.send.bind(ch);
      let mute = false;
      ch.send = (m: any) => { if (mute) return; this.timeSphere.tap(m); rawSend(m); };
      /* reproducir la toma: se aplica acá en silencio y se manda UNA vez al Player tal cual se grabó */
      this.timeSphere.apply = (m: any) => {
        mute = true;
        try { this.applyRemote(m); } finally { mute = false; }
        rawSend(m);
        W.render(); this.paramsSphere.render(); this.objectsSphere.render();
      };
      if (ch.isPlayer()) {
        document.body.classList.add("mo-player");
        ch.onMessage = (m: any) => this.applyRemote(m);
      }
      this.presetWheel.onMode = (m) => this.touchEdit && this.touchEdit.log("mode", { mode: m });
      this.loadPersonas();
      this.touchEdit.history = this.history;
      (window as any).moHistory = this.history;
      window.addEventListener("keydown", (e: KeyboardEvent) => {
        if (!(e.ctrlKey || e.metaKey) || (e.key != "z" && e.key != "Z" && e.key != "y")) return;
        const t: any = e.target; if (t && (t.tagName == "INPUT" || t.tagName == "TEXTAREA")) return;
        e.preventDefault();
        if (e.key == "y" || e.shiftKey) this.doRedo(); else this.doUndo();
      });
    }
    let cName : any = this.m_Console.GetConfigName();
    let cFile : moFile = new moFile(cName);
    this.moFileName = cFile.GetFileName();
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
