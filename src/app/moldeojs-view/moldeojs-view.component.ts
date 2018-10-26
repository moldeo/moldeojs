import {
  Component, OnInit, OnChanges, ElementRef, Input,
  SimpleChange, SimpleChanges,
  ContentChild, ViewChild, ViewChildren
} from '@angular/core';


import { moConsole } from '../mo-console';
import { moConsoleState } from '../mo-console-state';
import { ConsoleService } from "../console.service";

import { JsonService } from '../json.service';
import { FileAdminService } from '../fileadmin.service';

@Component({
  selector: 'moldeojs-view',
  templateUrl: './moldeojs-view.component.html',
  styleUrls: ['./moldeojs-view.component.css']
})
export class MoldeojsViewComponent implements OnInit {

  message: string = "- no project -";
  hostElement: ElementRef;
  rendererElement : HTMLCanvasElement;
  test: number = 0;
  testmax: number = 120;
  @Input() mol: string;

  //jsonRute : string = 'http://admin.moldeointeractive.com.ar/wiwe/principal/home/jasones.php?_tema_=Mosaico&output=json';
  //jsonRute: string = "http://admin.moldeointeractive.com.ar/wiwe/principal/home/jasones.php?_temaid_=423&output=json";
  //jsonInit : any;
  @ViewChild('webview_contenidos') contenidos: ElementRef;
  @ViewChild('webview_titulo') titulo: ElementRef;
  @ViewChild('webview_descripcion') descripcion: ElementRef;
  mititulo: string = "Completar titulo";
  midescripcion : string = "Completar descripcion";

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


  ngOnChanges(changes: SimpleChanges) {

      console.log("MoldeojsViewComponent::ngOnChanges > changes:", changes);
      if (changes["mol"]) {
        const mol : SimpleChange = changes.mol;
        console.log('prev value: ', mol.previousValue);
        console.log('got name: ', mol.currentValue);

        if (mol.firstChange) {
          this.MoldeoCS.Init({ "consoleconfig": "./assets/"+mol.currentValue } );
        }

        if (!mol.firstChange && mol.previousValue!=mol.currentValue) {
          console.log("Change view please!");
          if (this.MoldeoCS.m_Console.Initialized()) {
            this.MoldeoCS.Finish();
            this.MoldeoCS.Init({ "consoleconfig": "./assets/"+mol.currentValue } );
          } else {
            this.MoldeoCS.Init({ "consoleconfig": "./assets/"+mol.currentValue } );
          }
        }
      }


      //console.log('prev value: ', name.previousValue);
      //console.log('got name: ', name.currentValue);
      //this._name = name.currentValue.toUpperCase();
  }

  ngOnInit() {

    console.log("MoldeojsViewComponent::ngOnInit", this);
    this.MoldeoCS.updated$.subscribe((result) => {
      //called when ConsoleService has created the Renderer Element
      if (result == true) {
        console.log("MoldeojsView > Console Service OK! Associate renderer to HTML Element", this.MoldeoCS.m_Console);
        var RM = this.MoldeoCS.m_Console.GetResourceManager();
        if (RM) {
          var RenderMan = RM.GetRenderMan();
          if (RenderMan) {
            if (this.rendererElement) this.rendererElement.remove();
            this.rendererElement = RenderMan.m_Renderer.domElement;
            this.rendererElement.setAttribute("class","moldeojscanvas");
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

  GetConsole() : moConsole {
    return this.MoldeoCS.m_Console;
  }

  public animate() {
    //console.log("animate");
    window.requestAnimationFrame(_=>this.animate() );
    //console.log("animate: ",this.test);
    if (this.test < this.testmax) {
      //console.log("Running TestScreen!");
      this.MoldeoCS.m_Console.TestScreen();
      this.test = Number(this.test) + Number(1);
      this.message = ""+this.test;
    } else
    if (this.MoldeoCS.m_Console.Initialized()) {
      //console.log("Running Console animation!");
      this.message = "Running "+this.MoldeoCS.m_Console.GetConfigName();
      if (this.MoldeoCS.m_Console.Interaction()) {
        this.MoldeoCS.m_Console.Draw(undefined);
        this.MoldeoCS.m_Console.Update();
      }
    }
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

  onResize( event: any ) : void {
    //console.log("moldeojsview resize:",event, event.target.innerWidth);

  }

}
