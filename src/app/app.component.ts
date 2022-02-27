import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef , BsModalService } from 'ngx-bootstrap/modal';

import { MoldeojsViewComponent } from './moldeojs-view/moldeojs-view.component';
import { MoldeojsInterfaceComponent } from './moldeojs-interface/moldeojs-interface.component';

import { ViewService } from "./view.service";
import { CollaborativeService, SocketOne } from './collaborative.service';
import { Title }  from '@angular/platform-browser';
//import { ElectronService } from './providers/electron.service';

import { moTexture, moTextureAnimated, moTextureType } from "./mo-texture";
import * as THREE from 'three';

import * as ProgressBar from "progressbar.js";

import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';

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
  //sample: string = "molrepos/basic/07_ParticlesSimple/07_ParticlesSimple.Sphere.mol";
  //assets/molrepos/basic/07_ParticlesSimple/images

  //sample: string = "molrepos/moldeoorg/fabri/EsferaEspiral/EspiralEsfera.mol";
  //sample: string = "molrepos/myshmup/explo_01b/explo_01.mol";
  sample: string = "molrepos/myshmup/explo_02b/explo_02.mol";

  //sample: string = "molrepos/moldeoorg/siif/entrelineas/EntreLineas.mol";
  //sample: string = "molrepos/moldeoorg/dante/pajarosdefuego/pajaros_de_fuegoX.mol";
  samples: string[] = [];
  viewservice : ViewService;
  collaborativeService : CollaborativeService;

  msg : string = "";
  clients: number = 0;
  last_data: any = false;
  sent_message: string = "";
  recv_message: string = "";
  m_ListClients : any = {};
  m_ConnectedId : any = false;
  m_ConnectedColor : any = false;
  m_Console : any = false;
  placeholder : any = "Escribir aquí ...";

  divstart : any = undefined;
  elstart : any = undefined
  progressbar : any = undefined;
  marge : number = 0;

  canvas_x : any = 0;
  canvas_y : any = 0;
  canvas_x_max : any = 1024;
  canvas_y_max : any = 1024;
  canvas_y_top : any = 40;
  column : any = 0;
  column_width : any = 20;
  chat_font_size : any = 13;
  chat_line_height : any = 16;
  max_message : any = 64;

  m_ChatTexture : moTexture;
  OscBuffer : any;


  public modalRef: BsModalRef; // {1}

  @ViewChild('chatmsgbox') chatmsgbox: ElementRef;
  @ViewChild('oscmsgbox') oscmsgbox: ElementRef;
  @ViewChild('message2send') message2send: ElementRef;
  @ViewChild('message2recv') message2recv: ElementRef;
  @ViewChild('clientcolor') clientcolor: ElementRef;
  @ViewChild('screenshotcap') screenshotcap : ElementRef;
  @ViewChild('videoscreenshot_canvas') videoscreenshot_canvas : ElementRef;
  @ViewChild('template_warning') template_warning : TemplateRef<any>;
  @ViewChild('template_help') template_help : TemplateRef<any>;
  @ViewChild('template_share') template_share : TemplateRef<any>;


  public chat_canvas: HTMLCanvasElement;
  public ctx_chat_canvas: CanvasRenderingContext2D;


  @ViewChild('navmenu') navmenu: ElementRef;
  @ViewChild(MoldeojsViewComponent) moldeojsview: MoldeojsViewComponent;
  @ViewChild(MoldeojsInterfaceComponent) moldeojsinterface: MoldeojsInterfaceComponent;
/*
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;*/

  constructor(private modalService: BsModalService,
    private titleService: Title,
    /*public electronService: ElectronService,*/
    @Inject(ViewService) service,
    @Inject(ViewContainerRef) viewContainerRef,
    /*@Inject(SocketOne) socket_one,*/
    @Inject(CollaborativeService) coservice ) {

    //this.samples.push("molrepos/basic/00_Image/00_Image.mol");
    //this.samples.push("molrepos/basic/01_Icon/01_Icon.mol");
    //this.samples.push("molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol");
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );"

    //this.samples.push("molrepos/moldeoorg/fabri/Musas/MusasRojo.mol");
    //this.samples.push("molrepos/moldeoorg/fabri/Musas/MusasVerde.mol");
    //this.samples.push("molrepos/moldeoorg/fabri/Musas/MusasAzul.mol");
    //this.samples.push("molrepos/moldeoorg/fabri/Musas/MusasAmarillo.mol");

    this.viewservice = service;
    this.viewservice.setRootViewContainerRef(viewContainerRef);
    window["MoldeoApp"] = this;

    //############### COLLABORATE SERVICE / CHAT ###############
    this.collaborativeService = coservice;
    this.clients = 0;
    this.canvas_x = 0;
    this.canvas_y = this.canvas_y_top;
    this.m_ChatTexture = undefined;

    //############### TOUCH START AUDIO ###############

    this.divstart = document.createElement("div");
    this.divstart.setAttribute("id","startaudio");
    //this.divstart.setAttribute("class","ready_to_start");
    this.divstart.setAttribute("class","ready_to_load");
    this.divstart.setAttribute("style","display: none; position: fixed; z-index: 10001; left: 0px; top: 0px; width: 100%; height: 100%; background-color: rgba(0,0,0,0.98);");
    document.body.appendChild(this.divstart);


    this.elstart = document.createElement("button");
    this.elstart.setAttribute("id","btn_start");
    this.elstart.setAttribute("style","display: block; position: relative; left: 50%; top: 50%; margin-left: -50px; margin-top: -50px; border: solid 0px #BBB;width: 100px; height: 100px; color: #BBB; background-color: #000;border-radius: 50px; font-size: 14px;letter-spacing: 2px;font-weight: bold;");
    this.elstart.innerHTML = '<img src="assets/data/icons/favicon.png" height="48" width="48" hspace="8" vpspac="8"/><span>start</span>';
    this.divstart.appendChild( this.elstart );

    var self = this;
    this.elstart.addEventListener( 'click', function(event) {
      //console.log(event);
      var landscapeok = window.innerWidth>=window.innerHeight;
      try {
      eval("/*alert('request motion click');*/ if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission == 'function') DeviceMotionEvent.requestPermission().then(response => { /*alert(response);*/"+
              "if (response != 'granted') "+
                "alert('requestPermission '+response+', no utilizaremos los sensores de movimiento.');"+
           "}).catch(function(err) { /*alert(err);*/ });");
      } catch(err) { alert(err); }
      self.divstart.style.display = 'none';
      /*if (landscapeok) self.divstart.style.display = 'none';
      else { alert("Rotar el teléfono a posición apaisada"); }*/
    });

    //############### PROGRESS BAR ###############
    this.progressbar = new ProgressBar.Circle('#btn_start', {
      color: 'white',
      strokeWidth: 2,
      duration: 2000, // milliseconds
      easing: 'easeInOut'
    });
    this.progressbar.animate(1.0);

  } // {2}

  createChatTexture() {

    //console.log(this.m_Console);

    var resid : number = -1;

    //console.log(this.m_Console);

    if (this.m_ChatTexture==undefined && resid==-1) {

      resid = this.m_Console.GetResourceManager().GetTextureMan().GetTextureMOId("full_chat_canvas", false);

      if (resid==-1) { resid = this.m_Console.GetResourceManager().GetTextureMan().AddTexture( moTextureType.MO_TYPE_TEXTURE, "full_chat_canvas" ); }
      if (resid>-1) {
        this.m_ChatTexture = this.m_Console.GetResourceManager().GetTextureMan().GetTexture(resid);
        this.m_ChatTexture._texture = new THREE.Texture(this.chat_canvas);
        this.m_ChatTexture._texture.minFilter = THREE.LinearFilter;
        this.m_ChatTexture._texture.needsUpdate = true;//Important for update
      }

    }

  }


  onResize( event : any ) {
      //console.log( event, event.target.innerWidth, event.target.innerHeight, event.target.innerHeight-this.marge );
      this.moldeojsview.Resize( event.target.innerWidth, event.target.innerHeight-this.marge);
  }

  ngOnInit() {
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
      //this.viewservice.addMoldeojsViewComponent(this.sample);
      //console.log("ngOnInit esfera mapsManagerService :",this.mapsManagerService);
      //console.log("ngOnInit acMapComponent: ", this.acMapComponent );
      if (this.collaborativeService && this.collaborativeService.getSocket()) {
        this.collaborativeService.getMessage().subscribe( data => { this.recMsg(data); } );
        this.collaborativeService.getClients().subscribe(clients=> {this.clients = clients;});
        this.collaborativeService.getListClients().subscribe(data=>{ this.ListClients(data); });
        this.collaborativeService.Connected().subscribe(data=>{ this.Connected(data); });
        this.collaborativeService.Disconnected().subscribe(data=>{ this.Disconnected(data); });
        this.collaborativeService.updateClient().subscribe(data=>{this.updateClient(data);})
      }
      //this.sample = this.samples[0];
      var a = this.sample.lastIndexOf("/");
      var b = this.sample.lastIndexOf(".");
      var projectname = this.sample.substr(a+1, b-a-1);
      this.setTitle( projectname + " - https://moldeojs.moldeo.org" );
  }

  ngAfterViewInit () {
      console.log("ngAfterViewInit:",this.moldeojsview);

      if (this.moldeojsview) {
        this.m_Console = this.moldeojsview.GetConsole();
      }

      {
        this.chat_canvas = <HTMLCanvasElement> document.getElementById("full_chat_canvas");
        this.ctx_chat_canvas = this.chat_canvas.getContext("2d");
        this.ctx_chat_canvas.fillStyle = "#000";
        this.ctx_chat_canvas.fillRect(0, 0, this.chat_canvas.width, this.chat_canvas.height);
        this.m_ConnectedColor = this.clientcolor.nativeElement.value;
      }

      window["moldeodebug"] = window.location.href.indexOf("debug")>0;
      if (window["moldeodebug"]) {
        this.navmenu.nativeElement.style.display = "block";
      }
      this.message2send.nativeElement.focus();



      /*this.openModal( this.template_warning );*/
  }

  showHelp( event : any ) {
    console.log(event);
    this.openModal( this.template_help );
  }

  removeByClass( className : string ) : void {
    var vars = document.getElementsByClassName(className);
    var vls = [];
    for (var v = 0; v < vars.length; v++) {
      vls.push(vars[v]);
    }
    for (var v = 0; v < vls.length; v++) {
      document.body.removeChild(vls[v]);
    }
  }

  activateProjectSample( event: any, index: number ) : void {
    var eclass;
    for(var i=1; i<=4; i++) {
      /*eclass = event.toElement.getAttribute("class");
      if (eclass) eclass = eclass.replace("active","").trim();
      else eclass = "";*/
      var button_load_sample = document.getElementById("sample_"+i);
      if (button_load_sample) {
        eclass = button_load_sample.getAttribute("class")
        if (i!=index) {
          eclass = eclass.replace("active","").trim();
        } else {
          eclass = eclass+" active";
        }
        button_load_sample.setAttribute("class",eclass);
      }
    }
    eclass = event.target.getAttribute("class");
    event.target.setAttribute("class",eclass+" active");

  }

  loadsample( event: any, index: number) : void {

    //console.log("loadsample",this.moldeojsview);
    //console.log(event);
    //console.log("Loading:",this.samples[index]);

    this.removeByClass("moldeo_var");

    this.activateProjectSample(event,index);

    this.moldeojsview.audiooff();

    this.sample = this.samples[index];
    this.isCollapsed = true;
  }

  sampleLoaded( event: any ) : void {
    console.log( "sampleLoaded:", event );
  }

  public openModal(template: TemplateRef<any>, initialState : any = {}) {
    this.modalRef = this.modalService.show(template, initialState);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  keyup(event:any) {
      //console.log(event);
      if (event.keyCode==13) {
        this.compose_message(event);
      }
  }

  oscData( oscmsg : any) {

    var data = {
      msg: "",
      options: {
        osc: oscmsg
      }
    };

    this.sendMsg(data);

  }

  clientColor( event : any ) {

    this.m_ConnectedColor = this.clientcolor.nativeElement.value;
    this.message2send.nativeElement.setAttribute("style","color: "+this.m_ConnectedColor+";");
    this.chatmsgbox.nativeElement.setAttribute("style","border: solid 1px "+this.m_ConnectedColor+";");

    var data = {
      msg: "color",
      options: {
        color: this.m_ConnectedColor
      }
    };

    //console.log("clientColor",data);
    this.sendMsg(data);
  }

  toggleplay() : void {
    //console.log("toggle play",this.moldeojsview);
  }

  compose_message(event:any) {
    //debugger;
    this.last_data = {}
    var msg2snd = this.message2send.nativeElement.value;
    //this.sent_message = msg2snd;
    this.sent_message = msg2snd.substr(0,this.max_message);
    this.last_data = { msg: this.sent_message, options: {}}
    this.sendMsg(this.last_data);
    this.message2send.nativeElement.value = "";
    this.message2send.nativeElement.focus();

  }

  recMsg(data) {
      var isMyMessage : string = "";
      var userCardinal : string = "";
      var cardNumber : string;
      var userStyle : string = "";
      var userColor : string = "#FFF";

      if (data.options==undefined) return;
      if (data.options.osc) {
        //console.log("received:",data.options.osc);
        this.oscmsgbox.nativeElement.innerHTML = JSON.stringify(data.options.osc);
        return;
      }

      //console.log("recMsg:",data);
      this.recv_message = data.msg;
      //clase >
      var source_id = data.options.source_id;

      if (data.options.number) {
        cardNumber = "@"+data.options.number;
      } else {
        cardNumber = "@_entrelineas_";
      }

      //OWN MESSAGE (FEEDBACK)
      if (source_id && source_id==this.m_ConnectedId) {
        isMyMessage = "my_message";
        cardNumber = ""+cardNumber;
        userCardinal = ' ';
        if (this.m_ConnectedColor) {
          userColor = this.m_ConnectedColor;
        }
        var obj : any = {
          id: source_id,
          number: data.options.number,

        };
        if (this.m_ListClients[source_id]) {
          obj = this.m_ListClients[source_id];
        }
        obj.color = this.m_ConnectedColor;
        this.m_ListClients[source_id] = obj;
      } else if (source_id) {
        //tabulacion:
        isMyMessage = "their_message";
        cardNumber = ""+cardNumber;
        var mleft : number = 5*Number(data.options.number);
        userCardinal = ' margin-left: '+ mleft + 'px;';

        var obj : any = {};

        if (this.m_ListClients[source_id]) {
          obj = this.m_ListClients[source_id];
        } else {
          obj = {
            id: source_id,
            state: "connected",
            number: data.options.number,
            avatar: false,
          }
        }

        if (data.options.color) {
          obj.color = data.options.color;
        }

        userColor = obj.color;

        this.m_ListClients[source_id] = obj;
      }

      //preparing styles
      userStyle = ' style="color: '+userColor+';'+userCardinal+'" ';
      //preparing new message:
      var newMsg : any = '<div '
                            +'class="message '+isMyMessage+'" '
                            +userStyle
                            +'>'
                              +cardNumber+': '+this.recv_message
                        +'</div>';
      this.message2recv.nativeElement.innerHTML = this.message2recv.nativeElement.innerHTML+newMsg;
      var stripedHtml = this.recv_message.replace(/<[^>]+>/g, '');
      /*this.printMsg( {
                        'msg': stripedHtml,
                        'color': userColor,
                        'mine':isMyMessage,
                        'cardinal': userCardinal
                      });*/
      //console.log(newMsg,"ListClients:",this.m_ListClients);
  }

  printMsg(filterdata) {
    var print_x: number;
    var print_y: number;

    var columnas = false;
    var metrics : any = this.ctx_chat_canvas.measureText(filterdata.msg);
    if ( columnas ) {
      if (this.canvas_y>this.canvas_y_max) {
        this.column++;
        this.canvas_y = this.canvas_y_top;
        if ( (this.column_width*this.chat_font_size)*this.column>this.canvas_x_max) {
          this.column = 0;
        }
      }
      this.canvas_x = (this.column_width*this.chat_font_size)*this.column;
      this.canvas_y+= this.chat_line_height;

      print_x = this.canvas_x;
      print_y = this.canvas_y;

    } else {
      if ( (this.canvas_x+metrics.width) > (this.canvas_x_max) ) {
        print_x = 0;
        this.canvas_x = metrics.width+4;
        this.canvas_y+= this.chat_line_height;
        print_y = this.canvas_y;
      } else {
        print_x = this.canvas_x;
        this.canvas_x+= metrics.width;
        print_y = this.canvas_y;
      }
      if (this.canvas_y>this.canvas_y_max) {
        print_x = 0;
        this.canvas_x = metrics.width+4;
        this.canvas_y = this.canvas_y_top;
        print_y = this.canvas_y;
        this.ctx_chat_canvas.fillStyle = "#000";
        this.ctx_chat_canvas.globalAlpha = 0.5;
        this.ctx_chat_canvas.fillRect(0, 0, this.chat_canvas.width, this.chat_canvas.height);
        this.ctx_chat_canvas.globalAlpha = 1.0;
      }

    }



    this.ctx_chat_canvas.font = this.chat_font_size + "px Courier";
    this.ctx_chat_canvas.fillStyle = filterdata.color;
    this.ctx_chat_canvas.fillText( filterdata.msg, print_x, print_y );

    //this.ctx_chat_canvas.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height);
    if (this.column>=0) {
      //console.log(this.column);
      this.createChatTexture();
      if (this.m_ChatTexture) {
        if (this.m_ChatTexture._texture) {
          this.m_ChatTexture._texture.needsUpdate = true;//Important for update
        }
      }
    }
  }

  sendMsg(data) {
    //console.log("sendMsg:",data);
    if (this.collaborativeService) this.collaborativeService.sendMessage(data);
  }

  ListClients(data) {
    //console.log("ListClients received:",data);
    this.clients = data.clients;
    for( var d in data.list) {
      this.m_ListClients[data.list[d].id] = data.list[d];
    }
    //console.log("ListClients updated:",this.m_ListClients);
  }

  updateClient(data) {
    //console.log("updating other client data:",data);
    if (data.id) {
      if (this.m_ListClients[data.id]) {
        for(var k in data) {
          this.m_ListClients[data.id][k] = data[k];
        }
      } else {
        this.m_ListClients[data.id] = data;
      }
    }
    //console.log("updated!! other client data:",this.m_ListClients[data.id]);
    this.m_Console.m_ListClients = this.m_ListClients;
  }

  Connected(data) {
    //console.log("Connected!",data);
    if (data.state) {
      if (data.state=="connected") {

        var clientData : any  = {};

        //chech our client data
        if (this.m_ListClients[this.m_ConnectedId]) {
          clientData = this.m_ListClients[this.m_ConnectedId];
          clientData.id = data.id;
          this.collaborativeService.sendClient(clientData);
        }

        //new id, new data mixed with old one
        this.m_ConnectedId = data.id;
        for( var key in data) {
          clientData[key]= data[key];
        }
        this.m_ListClients[this.m_ConnectedId] = clientData;

        if (this.m_ListClients[data.id]) {
          this.m_ListClients[data.id] = clientData;
        }

      } else if (data.state=="user connected") {
        //added a new chat buddy
        this.m_ListClients[data.id] = data;
      }
    }

    //this.m_Console.m_pResourceManager.m_ListClients = this.m_ListClients;
    this.collaborativeService.fetchClients();
  }

  Disconnected(data) {
    //console.log("Disconnected!",data);
    if (data.state) {
      if (data.state=="disconnected") {
        this.m_ConnectedId = data.id;
      } else if (data.state=="user disconnected") {
        //siempre borrar la informacion de los otros...
        // para que vuelva actualizada
        if (this.m_ListClients[data.id]) {
          this.m_ListClients[data.id] = null;
        }
      }
    }
  }

  collapsed(event: any): void {
    //console.log(event);
  }

  expanded(event: any): void {
    //console.log(event);
  }

  setTitle( title : string ) : void {
    this.titleService.setTitle(title);
  }

  screenshotTaken( event : any ) {
    console.log("screenshotTaken", event );
    this.openModal( this.template_share );
    setTimeout(() => {
        var imgpreview : any = document.getElementById("preview_image");
        var imgscreenshot : any = document.getElementById("screenshotcap");
        imgpreview.src = imgscreenshot.src;
    }, 1500);

  }

  shareImage( event : any ) : void {
    //console.log("shareimage:",event);
    if (this.screenshotcap.nativeElement.src) {
      var a : any = document.getElementById('screenshotcap_download');
      a.href = this.screenshotcap.nativeElement.src;
      document.getElementById('screenshotcap_download').click();
    }
    //var w = window.open("",'_blank');
    //w.document.write(this.screenshotcap.nativeElement.outerHTML);
    //w.document.close();

  }

  downloadPostcard() {
    document.getElementById('screenshotcap_download').click();
  }

  sharePostcard( event : any ) : void {

    console.log("sharePostcard");

    //var backoffice_url : any = "https://www.teleportation.com.ar/";
    //var backoffice_url : any = "http://odoo14.moldeo.local/";
    var backoffice_url : any = "https://odoo14.moldeo.org/";
    var share_name : any = document.getElementById("share_name");
    var share_email : any = document.getElementById("share_email");
    var share_title : any = document.getElementById("share_title");
    var share_description : any = document.getElementById("share_description");
    var fnew : any = document.createElement("form");
    fnew.setAttribute( "id", "newreport");
    fnew.setAttribute( "method", "post" );
    fnew.setAttribute( "target", "_blank" );
    fnew.setAttribute( "enctype", "multipart/form-data");
    fnew.setAttribute( "action", backoffice_url+"my/moldeo_asset_new");
    fnew.innerHTML = '';
    //fnew.innerHTML = '<input name="url_object_key" type="hidden" value="'+compressed+'"/>';
    //fnew.innerHTML+= '<textarea name="url_object_key_uncompressed" type="hidden">'+uncompressed+'</textarea>';
    fnew.innerHTML+= '<input name="user" type="hidden" value="'+share_name.value+'"/>';
    fnew.innerHTML+= '<input name="email" type="hidden" value="'+share_email.value+'"/>';
    fnew.innerHTML+= '<input name="name" type="hidden" value="'+share_title.value+'"/>';
    fnew.innerHTML+= '<textarea name="description" type="hidden">'+share_description.value+'</textarea>';
    //fnew.innerHTML+= '<input type="hidden" value="'+compressed+'"/>';
    document.body.appendChild(fnew);

    var input_image : any = document.createElement("input");
    input_image.setAttribute("name","url_image");
    input_image.setAttribute("type","hidden");
    input_image.setAttribute("value","");
    fnew.appendChild(input_image);

    var dataURL : any = this.screenshotcap.nativeElement.src;
    if (dataURL) {
      //console.log("dataURL",dataURL.substr(0,5),dataURL.substr(-5,5),dataURL);
      var base : string = "data:image/png;base64,";
      var dataURL2 : string = dataURL.substr(base.length,dataURL.length-base.length);
      //console.log("dataURL2",dataURL2.substr(0,5),dataURL2.substr(-5,5),dataURL2);
      input_image.setAttribute("value",dataURL2);
      fnew.submit();
    } else {
      console.error("error",dataURL);
    }
  }

}
