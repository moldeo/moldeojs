import {
  Component, OnInit, OnChanges, ElementRef, Input, Output, EventEmitter,
  SimpleChange, SimpleChanges,
  ContentChild, ViewChild, ViewChildren
} from '@angular/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare, faCamera, faVideo, faGlobeAmericas, faInfo } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

import { moConsole } from '../mo-console';
//import { moConsoleState } from '../mo-console-state';
import { moDisplay } from '../mo-render-manager';
import { ConsoleService } from "../console.service";

import { JsonService } from '../json.service';
import { FileAdminService } from '../fileadmin.service';
import { moEffectSound } from '../../plugins/effects/sound';

@Component({
  selector: 'moldeojs-view',
  templateUrl: './moldeojs-view.component.html',
  styleUrls: ['./moldeojs-view.component.css']
})
export class MoldeojsViewComponent implements OnInit {

  message: string = "- no project -";
  overlayer: string = "texto";
  overlayerhtml: string = "a<BR/>b";
  hostElement: ElementRef;
  rendererElement : HTMLCanvasElement;

  test: number = 0;
  testmax: number = 30;//3*120;
  lastCalledTime : any = false;
  fps : number = 0;
  sounds_playing : boolean = true;
  marge : number = 0;/*50;*/

  @Input() mol: string;
  @Output() loaded = new EventEmitter<any>();
  @Output() help = new EventEmitter<string>();
  @Output() onscreenshot = new EventEmitter<string>();

  //jsonRute : string = 'http://admin.moldeointeractive.com.ar/wiwe/principal/home/jasones.php?_tema_=Mosaico&output=json';
  //jsonRute: string = "http://admin.moldeointeractive.com.ar/wiwe/principal/home/jasones.php?_temaid_=423&output=json";
  //jsonInit : any;
  @ViewChild('overlayer') overlayerel: ElementRef;
  @ViewChild('webview_contenidos') contenidos: ElementRef;
  @ViewChild('webview_titulo') titulo: ElementRef;
  @ViewChild('webview_descripcion') descripcion: ElementRef;
  @ViewChild('audioonoff_ico') audioonoff_ico : ElementRef;
  @ViewChild('moldeobuttons') moldeobuttons: ElementRef;
  mititulo: string = "Completar titulo";
  midescripcion : string = "Completar descripcion";
  //baseref : string = "https://www.moldeo.org/assets/";
  //baseref : string = "https://localhost:4200/assets/";
  baseref : string = "./assets/";
  //baseref : string = "https://localhost:4200/assets/";
  videocap : any = undefined;
  videocap_canvas : any = undefined;
  screenshotcap : any = undefined;
  screenshotcap_download : any = undefined;

  constructor(el: ElementRef, private MoldeoCS: ConsoleService,
    private jsonService: JsonService,
    private fileadminService: FileAdminService) {
    this.hostElement = el;

    /*jsonService.getJson(this.jsonRute).subscribe(val => {
      this.jsonInit = val;
      console.log("JSON:", this.jsonInit);
      window["Moldeo"]["db"] = {
        "json": this.jsonInit,
        "Libros": this.jsonInit["Imágenes"][0],
        "Documentos": this.jsonInit["Imágenes"][1],
        "Objetos": this.jsonInit["Imágenes"][2],
        "Index": {}
      }
      var CCLibros = window["Moldeo"]["db"]["Libros"]["Contenidos"];
      var CCObjetos = window["Moldeo"]["db"]["Objetos"]["Contenidos"];
      var CCIndex = window["Moldeo"]["db"]["Index"];

      for (var idx in CCLibros) {
        var Obj = CCLibros[idx];
        CCIndex["idc_" + Obj.id] = Obj;
        if (Obj["Detalles"].length) {
          for (var im = 0; im < Obj["Detalles"].length; im++) {
            var Detalle = Obj["Detalles"][im];
            if (Detalle["Imagen"]) {
              //fileadminService.downloadFile( Detalle["Imagen"],"molrepos/museo/mural/imagenes", "idc_"+Obj.id, "jpg");

            }
          }
        }
        console.log("objeto ", Obj);
      }


      for (var idx in CCObjetos) {
        var Obj = CCObjetos[idx];
        CCIndex["idc_" + Obj.id] = Obj;
        if (Obj["Detalles"].length) {
          for (var im = 0; im < Obj["Detalles"].length; im++) {
            var Detalle = Obj["Detalles"][im];
            if (Detalle["Imagen"]) {
              //fileadminService.downloadFile(Detalle["Imagen"], "molrepos/museo/mural/imagenes", "idc_" + Obj.id, "jpg");

            }
          }
        }
        console.log("objeto ", Obj);
      }

      console.log("CCIndex ", CCIndex);
      //fileadminService.downloadFile('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',"assets", "nombre", "jpg");
    });*/


  }

  onResize( event : any ) : void {
    //console.log("moldeojs-view:",event);

  }

  Resize( w : number, h : number ) : void {
    //console.log("moldeojsview: Resize",w,h);
    if (w>h) {
      if (window.outerHeight>window.innerHeight || window.outerWidth>window.innerWidth) {
        /*try full screen*/
        //this.fullscreen();
      }
      this.MoldeoCS.m_Console.Resize(w,h);
    } else {
      //console.log("moldeojsview: Forcing Landscape Resize to ",h,w);
      //document.body.style.width = window.outerHeight+"px";
      //document.body.style.height = window.outerWidth+"px";
      //check landscapeok !!!!
      //this.MoldeoCS.m_Console.Resize(h,w);
      this.MoldeoCS.m_Console.Resize(w,h);
    }
  }


  ngOnChanges(changes: SimpleChanges) {

      //console.log("MoldeojsViewComponent::ngOnChanges > changes:", changes);
      this.marge = 0;
      if (changes["mol"]) {
        const mol : SimpleChange = changes.mol;
        if (this.overlayerel)
          this.overlayerel.nativeElement.style.display = "none";
        //console.log('prev value: ', mol.previousValue);
        //console.log('got name: ', mol.currentValue);

        if (mol.firstChange) {
          this.MoldeoCS.Init({
              "consoleconfig": this.baseref+mol.currentValue ,
              "effects_loaded": (result) => {
                this.loaded.emit('effects_loaded');
              },
              "effects_started": (result) => {
                //console.log("effects_started firstChange:", result, this );
                this.loaded.emit('effects_started');
                if (this.MoldeoCS.m_Console.Script && this.MoldeoCS.m_Console.Script.AfterInit) this.MoldeoCS.m_Console.Script.AfterInit();
                this.Resize( window.innerWidth, window.innerHeight-this.marge);
              }
          } );
        }

        if (!mol.firstChange && mol.previousValue!=mol.currentValue) {
          //console.log("MoldeojsViewComponent::ngOnChanges > Change view please!");
          if (this.MoldeoCS.m_Console.Initialized()) {
            this.MoldeoCS.Finish();
            this.MoldeoCS.Init( {
                "consoleconfig": this.baseref+mol.currentValue,
                "effects_loaded": (result) => {
                  this.loaded.emit('effects_loaded');
                },
                "effects_started": (result) => {
                    console.log("effects_started:", result, this );
                    this.loaded.emit('effects_started');
                    if (this.MoldeoCS.m_Console.Script && this.MoldeoCS.m_Console.Script.AfterInit) this.MoldeoCS.m_Console.Script.AfterInit();
                    this.set_audioonoff_ico();
                    this.Resize( window.innerWidth, window.innerHeight-this.marge);
                }
            } );
          } else {
            this.MoldeoCS.Init({
                "consoleconfig": this.baseref+mol.currentValue,
                "effects_loaded": (result) => {
                  this.loaded.emit('effects_loaded');
                },
                "effects_started": (result) => {
                  //console.log("effects_started not init:", result, this );
                  this.loaded.emit('effects_started');
                  if (this.MoldeoCS.m_Console.Script && this.MoldeoCS.m_Console.Script.AfterInit) this.MoldeoCS.m_Console.Script.AfterInit();
                  this.set_audioonoff_ico();
                  this.Resize( window.innerWidth, window.innerHeight-this.marge);
                }
            } );
          }
        }
      }


      //console.log('prev value: ', name.previousValue);
      //console.log('got name: ', name.currentValue);
      //this._name = name.currentValue.toUpperCase();
  }

  ngOnInit() {

    //console.log("MoldeojsViewComponent::ngOnInit", this);
    this.MoldeoCS.updated$.subscribe((result) => {
      //called when ConsoleService has created the Renderer Element
      if (result == true) {
        //console.log("MoldeojsView > Console Service OK! Associate renderer to HTML Element", this.MoldeoCS.m_Console);
        var RM = this.MoldeoCS.m_Console.GetResourceManager();
        if (RM) {
          var RenderMan = RM.GetRenderMan();
          if (RenderMan) {
            if (this.rendererElement) this.rendererElement.remove();
            this.rendererElement = RenderMan.m_Renderer.domElement;
            this.hostElement.nativeElement.appendChild( this.rendererElement );
            RenderMan.m_Renderer.clear();
            this.test = 0;
            this.animate();
          }
        }
      }
    });



    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/00_Image/00_Image.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/02_Plane/02_Plane.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/08_Camera/08_Camera.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/07_ParticlesSimple/07_ParticlesSimple.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/"+this.mol } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/moldeoorg/dante/pajarosdefuego/pajaros_de_fuegoX.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/moldeoorg/fabri/EsferaEspiral/EspiralEsfera.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/samples/SimpleProject/simple_projectX.mol" } );
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/samples/CicloDelAgua/CicloDelAguaX.mol" } );

    window["MoldeoJSView"] = this;
  }

  ngAfterViewInit () {

    //console.log(this.audioonoff_ico);
    if (window.location.href.indexOf("debug")>0) {
      this.moldeobuttons.nativeElement.style.display = "block";
    }
  }

  GetConsole() : moConsole {
    return this.MoldeoCS.m_Console;
  }

  public animate() {
    //console.log("animate");
    window.requestAnimationFrame(_=>this.animate() );

    if(!this.lastCalledTime) {
       this.lastCalledTime = ( performance || Date ).now();
       this.fps = 0;
    } else {
      var delta : any = (( performance || Date ).now() - this.lastCalledTime)/1000;
      this.lastCalledTime = ( performance || Date ).now();
      this.fps = Math.floor(1/delta);
    }
    //console.log("animate: ",this.test);
    if (this.test < this.testmax) {
      //console.log("Running TestScreen!");
      this.MoldeoCS.m_Console.TestScreen( new moDisplay(0,0), {'step': this.test, 'end_step': this.testmax });
      this.test = Number(this.test) + Number(1);
      this.message = ""+this.test+" FPS: "+this.fps;
    } else
    if (this.MoldeoCS.m_Console.Initialized()) {
      //console.log("Running Console animation!");
      //this.message = "Running "+this.MoldeoCS.m_Console.GetConfigName()+" FPS: "+this.fps;
      this.message = " FPS: "+this.fps + " sens.: "+this.MoldeoCS.m_Console.m_pIODeviceManager.m_lasttype;
      //if (this.MoldeoCS.m_Console.m_pResourceManager.GetVideoMan().GetCamera(0))
      // this.message+= " Devs: " + this.MoldeoCS.m_Console.m_pResourceManager.GetVideoMan().GetCamera(0).devices_str;

      if (this.MoldeoCS.m_Console.Interaction()) {
        this.MoldeoCS.m_Console.Draw(undefined);
        this.MoldeoCS.m_Console.Update();
      }
    }
  }

  loadsample(event:any, index: number) : void {
    //console.log("loadsample from moldeojs view",this);
    //console.log(window["MoldeoApp"])
    if (window["MoldeoApp"]) {
      //window["MoldeoApp"].prototype.loadsample( event, index );
      window["MoldeoApp"].loadsample( event, index );
    }

  }

  hide() {
    //console.log("MoldeoJSView hide()");

    this.hostElement.nativeElement.style.display = "none";
    if (this.MoldeoCS.m_Console.Script && this.MoldeoCS.m_Console.Script.Hide) this.MoldeoCS.m_Console.Script.Hide();
    //pickPosition()
  }

  show() {
    //console.log("MoldeoJSView show()");

    this.hostElement.nativeElement.style.display = "block";
    if (this.MoldeoCS.m_Console.Script && this.MoldeoCS.m_Console.Script.Show) this.MoldeoCS.m_Console.Script.Show();
  }

  toggleplay() : void {
    //console.log("toggleplay", this);
  }

  stop() : void {
    //console.log("stop");
    this.MoldeoCS.m_Console.ConsoleStop();
  }

  play() : void {
  //  console.log("play");
    this.MoldeoCS.m_Console.ConsolePlay();
  }

  pause() : void {
    //console.log("pause");
    this.MoldeoCS.m_Console.ConsolePause();
  }

  fullscreen() : void {
    //function openFullscreen() {

    //var elem = this.rendererElement;
    try {
    var elem = document.documentElement;
    if (elem==undefined) return;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else { //hrome, Safari and Opera
        var webkitele : any = elem;
        if (webkitele.webkitRequestFullscreen) {
          webkitele.webkitRequestFullscreen();
        } else {
          //check... maybe putting moldeojsview in fixed mode in fullscreen.
        }
      }
    } catch(err) {
      console.error(err);
    }
      /*
      else if (elem.mozRequestFullScreen) { //Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { //hrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }*/
    //}
  }

  set_audioonoff_ico() : void {
      this.sounds_playing = false;
      for( var i = 0; i < this.MoldeoCS.m_Console.m_MoldeoObjects.length; i++ ) {
        var object : moEffectSound = (this.MoldeoCS.m_Console.m_MoldeoObjects[i] as moEffectSound);
        if (object.GetMobDefinition().GetName()=="sound" || object.GetMobDefinition().GetName()=="faust") {
          if (object.playing) this.sounds_playing = true;
        }
      }

      if (this.sounds_playing) {
        this.audioonoff_ico.nativeElement.setAttribute("class","glyphicon glyphicon-volume-off");
        this.audioonoff_ico.nativeElement.setAttribute("title","Set Audio Off");
      } else {
        this.audioonoff_ico.nativeElement.setAttribute("class","glyphicon glyphicon-volume-up");
        this.audioonoff_ico.nativeElement.setAttribute("title","Set Audio On");
      }
  }

  screenshot(delay : any = 0) : void {
    //console.log("moldeojs-view screenshot, delay:",delay);
    this.MoldeoCS.m_Console.Screenshot(delay);
    this.onscreenshot.emit('screenshot');
  }

  startscreencapture() : void {
    //console.log("moldeojs-view startscreencapture");
    this.videocap = document.getElementById('videocap2');
    this.videocap_canvas = document.getElementById('videoscreenshot_canvas');
    this.screenshotcap = document.getElementById('screenshotcap');
    this.screenshotcap_download = document.getElementById('screenshotcap_download');

    if (!this.videocap) {
      return;
    }
    if (this.videocap.srcObject) {
      //console.log(this.videocap.srcObject.readyState);
      this.MoldeoCS.m_Console.StopScreenCapture();
      this.videocap.srcObject = null;
    }
    var result : any = this.MoldeoCS.m_Console.StartScreenCapture( { audio: false, video: true }, (stream) => {
      //console.log("screencapture stream ok:", stream, stream.readyState);
      this.videocap.srcObject = stream;
      setTimeout(() => {
        var ctx = this.videocap_canvas.getContext('2d');
        var cuttop = 100;
        this.videocap_canvas.height = this.videocap_canvas.height-cuttop;
        ctx && ctx.drawImage( this.videocap, 0, -cuttop, this.videocap_canvas.width, this.videocap_canvas.height+cuttop);
        this.screenshotcap.src = this.videocap_canvas.toDataURL();
        this.MoldeoCS.m_Console.StopScreenCapture();

        this.screenshotcap_download.href = this.screenshotcap.src;
        //this.screenshotcap_download.click();
        this.onscreenshot.emit('screencapture');
      }, 8000)
    });
    //console.log("StartScreenCapture result:", result);
    /*if (result) {

      this.videocap.srcObject = await result;
    }*/
  }

  stopscreencapture() {
    //console.log("moldeojs-view stopscreencapture");
    this.videocap = document.getElementById('videocap2');
    if (!this.videocap) {
      return;
    }
    if (this.videocap.srcObject) {
      //console.log(this.videocap.srcObject.readyState);
      this.MoldeoCS.m_Console.StopScreenCapture();
      this.videocap.srcObject = null;
    }
  }

  audioon() : void {
    //console.log("audioon");
    for( var i = 0; i < this.MoldeoCS.m_Console.m_MoldeoObjects.length; i++ ) {
      var object : moEffectSound = (this.MoldeoCS.m_Console.m_MoldeoObjects[i] as moEffectSound);
      if (object.GetMobDefinition().GetName()=="sound" || object.GetMobDefinition().GetName()=="faust") {
        object.audioon();
      }
    }
    this.set_audioonoff_ico();
  }

  audiooff() : void {
    //console.log("audiooff");
    for( var i = 0; i < this.MoldeoCS.m_Console.m_MoldeoObjects.length; i++ ) {
      var object : moEffectSound = (this.MoldeoCS.m_Console.m_MoldeoObjects[i] as moEffectSound);
      if (object.GetMobDefinition().GetName()=="sound" || object.GetMobDefinition().GetName()=="faust") {
        object.audiooff();
      }
    }
    this.set_audioonoff_ico();
  }

  audioonoff() : void {
    //console.log("audioonoff");
    for( var i = 0; i < this.MoldeoCS.m_Console.m_MoldeoObjects.length; i++ ) {
      var object : moEffectSound = (this.MoldeoCS.m_Console.m_MoldeoObjects[i] as moEffectSound);
      if (object.GetMobDefinition().GetName()=="sound" || object.GetMobDefinition().GetName()=="faust") {
        object.audioonoff();
      }
    }
    this.set_audioonoff_ico();
  }

  SetTitulo(titulo: any) {
    this.mititulo = titulo;
  }

  SetDescripcion(descripcion: any) {
    //this.midescripcion = descripcion;
    this.descripcion.nativeElement.innerHTML = descripcion;
  }

  ShowOver() {
    this.contenidos.nativeElement.setAttribute("class", "contenido_over");
  }

  HideOver() {
    this.contenidos.nativeElement.setAttribute("class", "contenido_over_hide");
  }

  showhelp() {
    console.log("showhelp");
    this.help.emit('Show Modal Help Please!');
  }

}
