import { OnInit, Component, TemplateRef, ViewContainerRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ViewService } from "./view.service";

import { CollaborativeService } from './collaborative.service';

import {MoldeojsViewComponent} from "./moldeojs-view/moldeojs-view.component";

import { Title }  from '@angular/platform-browser';

import { ElectronService } from './providers/electron.service';

import { moTexture, moTextureAnimated, moTextureType } from "./mo-texture";
import * as THREE from 'three';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isCollapsed: boolean = true;
  sample: string = "";
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
  placeholder : any = "¿Qué imaginas ahora? ...";

  canvas_x : any = 0;
  canvas_y : any = 0;
  canvas_x_max : any = 1024;
  canvas_y_max : any = 1024;
  column : any = 0;
  column_width : any = 20;
  chat_font_size : any = 13;
  chat_line_height : any = 16;
  max_message : any = 64;

  m_ChatTexture : moTexture;


  @ViewChild('moldeojsview') moldeojsview: MoldeojsViewComponent;
  @ViewChild('chatmsgbox') chatmsgbox: ElementRef;
  @ViewChild('message2send') message2send: ElementRef;
  @ViewChild('message2recv') message2recv: ElementRef;
  @ViewChild('clientcolor') clientcolor: ElementRef;

  public chat_canvas: HTMLCanvasElement;
  public ctx_chat_canvas: CanvasRenderingContext2D;

  public modalRef: BsModalRef; // {1}
/*
  @ViewChild('dynamic', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef;*/

  constructor(private modalService: BsModalService,
    private titleService: Title,
    public electronService: ElectronService,
    @Inject(ViewService) service,
  @Inject(ViewContainerRef) viewContainerRef,
@Inject(CollaborativeService) coservice ) {

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    this.samples.push("molrepos/moldeoorg/Speak/Speak.mol");
    //this.samples.push("molrepos/basic/00_Image/00_Image.mol");
    //this.samples.push("molrepos/basic/01_Icon/01_Icon.mol");
    //this.samples.push("molrepos/basic/08p_CameraParticles/08p_CameraParticles.mol");
    //this.MoldeoCS.Init({ "consoleconfig": "./assets/molrepos/basic/01_Icon/01_Icon.mol" } );"
    this.viewservice = service;
    this.viewservice.setRootViewContainerRef(viewContainerRef);
    this.collaborativeService = coservice;
    this.clients = 0;
    this.canvas_x = 0;
    this.canvas_y = 0;
    this.m_ChatTexture = undefined;
  } // {2}

  ngOnInit() {
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
      //this.viewservice.addMoldeojsViewComponent(this.sample);

      this.collaborativeService.getMessage().subscribe( data => { this.recMsg(data); } );
      this.collaborativeService.getClients().subscribe(clients=> {this.clients = clients;});
      this.collaborativeService.getListClients().subscribe(data=>{ this.ListClients(data); });
      this.collaborativeService.Connected().subscribe(data=>{ this.Connected(data); });
      this.collaborativeService.Disconnected().subscribe(data=>{ this.Disconnected(data); });
      this.collaborativeService.updateClient().subscribe(data=>{this.updateClient(data);})
      this.sample = this.samples[0];
      var a = this.sample.lastIndexOf("/");
      var b = this.sample.lastIndexOf(".");
      var projectname = this.sample.substr(a+1, b-a-1);
      this.setTitle( projectname + " - MoldeoJS" );
      this.m_Console = this.moldeojsview.GetConsole();


      //this.m_Console.AppComponent = this;
      this.chat_canvas = <HTMLCanvasElement> document.getElementById("full_chat_canvas");
      this.ctx_chat_canvas = this.chat_canvas.getContext("2d");
      this.ctx_chat_canvas.fillStyle = "#000";
      this.ctx_chat_canvas.fillRect(0, 0, this.chat_canvas.width, this.chat_canvas.height);

      if (this.electronService.isElectron()) {
        var self = this;
        var oscs = new this.electronService.osc.Server(9991, '0.0.0.0');
        if (oscs)
          oscs.on("message", function (msg, rinfo) {
                //console.log("TUIO message:");
                if (msg[1]>0) {
                  //console.log(JSON.stringify(msg));
                  self.oscData(msg);
                }

          });
      }

      this.m_ConnectedColor = this.clientcolor.nativeElement.value;
  }

  createChatTexture() {
    console.log(this.m_Console);
    var resid : number = -1;
    console.log(this.m_Console);
    if (this.m_ChatTexture==undefined && resid==-1) {
      resid = this.m_Console.GetResourceManager().GetTextureMan().GetTextureMOId("full_chat_canvas", false);

      if (resid==-1) resid = this.m_Console.GetResourceManager().GetTextureMan().AddTexture( moTextureType.MO_TYPE_TEXTURE, "full_chat_canvas" );
      if (resid>-1) {
        this.m_ChatTexture = this.m_Console.GetResourceManager().GetTextureMan().GetTexture(resid);
        this.m_ChatTexture._texture = new THREE.Texture(this.chat_canvas);
        this.m_ChatTexture._texture.minFilter = THREE.LinearFilter;
        this.m_ChatTexture._texture.needsUpdate = true;//Important for update
      }
    }

  }

  /*
    Receive a message from the server.
    data structure:
    {
      msg: "message string",
      options: {
        source_id: id of client sending message,
        color: color just chosen by the sender,
        number: index order [cardinal] of the sender, "#0", "#1", "#23456", "_speak_"
        : index order of the sender
      }
    }
  */
  recMsg(data) {
      var isMyMessage : string = "";
      var userCardinal : string = "";
      var cardNumber : string;
      var userStyle : string = "";
      var userColor : string = "#AAA";
      //console.log("recMsg:",data);
      this.recv_message = data.msg;
      //clase >
      var source_id = data.options.source_id;

      if (data.options.number) {
        cardNumber = "@"+data.options.number;
      } else {
        cardNumber = "@_speak_";
      }

      //OWN MESSAGE (FEEDBACK)
      if (source_id && source_id==this.m_ConnectedId) {
        isMyMessage = "my_message";
        cardNumber = "m_> "+cardNumber;
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
        cardNumber = "<< "+cardNumber;
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
      //this.message2recv.nativeElement.innerHTML = newMsg+this.message2recv.nativeElement.innerHTML;
      var stripedHtml = this.recv_message.replace(/<[^>]+>/g, '');
      this.printMsg( {
                        /*'msg': cardNumber+': '+this.recv_message,*/
                        'msg': stripedHtml,
                        'color': userColor,
                        'mine':isMyMessage,
                        'cardinal': userCardinal
                      });
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
        this.canvas_y = 0;
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
        this.canvas_x = metrics.width;
        this.canvas_y+= this.chat_line_height;
        print_y = this.canvas_y;
      } else {
        print_x = this.canvas_x;
        this.canvas_x+= metrics.width;
        print_y = this.canvas_y;
      }
      if (this.canvas_y>this.canvas_y_max) {
        print_x = 0;
        this.canvas_x = metrics.width;
        this.canvas_y = 0;
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
      console.log(this.column);
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
    this.collaborativeService.sendMessage(data);
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

    this.m_Console.m_pResourceManager.m_ListClients = this.m_ListClients;
    this.collaborativeService.fetchClients();
  }

  Disconnected(data) {
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

  oscData(oscmsg) {
    /*
    var data = {
      msg: "osc "+oscmsg[1],
      options: {
        oscmsg: oscmsg
      }
    };

    this.sendMsg(data);*/

  }

  clientColor(event) {

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
  keyup(event:any) {
      console.log(event);
      if (event.keyCode==13) {
        this.compose_message(event);
      }
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

  collapsed(event: any): void {
    console.log(event);
  }

  expanded(event: any): void {
    console.log(event);
  }

  setTitle( title : string ) : void {
    this.titleService.setTitle(title);
  }

  onResize( event: any ) : void {
    //console.log("moldeojs app resize:",event, event.target.innerWidth);
    //console.log("must resize:",this.moldeojsview);
    var renderer : any = this.moldeojsview.GetConsole().m_pResourceManager.GetRenderMan().m_Renderer;
    if(renderer) {
      //console.log("resizing renderer",renderer,event.target.innerWidth,event.target.innerHeight);
      renderer.setSize(event.target.innerWidth,event.target.innerHeight);
    }
  }

}
