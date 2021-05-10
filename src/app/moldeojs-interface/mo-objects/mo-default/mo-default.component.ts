import { Component, OnInit, Input, ViewChild, Renderer2, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ConnectionsService } from '../../services/connections.service';
import { ParamsService } from '../../services/params.service';
import { ConsoleService } from "../../../console.service";

@Component({
  selector: 'mo-default',
  templateUrl: './mo-default.component.html',
  styleUrls: ['./mo-default.component.css']
})
export class MoDefaultComponent implements OnInit {
  @Input() public posX:number = 0;
  @Input() public posY:number = 0;
  @Input() public name:string = "";
  @Input() public key:string = "";
  //@ViewChild('moDefault', {static: false } ) moDefault;
  //@ViewChild('moObj', {static: false } ) moDefault;
  @ViewChild('moObj') moObj;
  @ViewChild('moSettings') moSettings;
  @ViewChild('moParams') moParams;
  @ViewChild('moCurrentParams') moCurrentParams;
  @ViewChild('moConnect') moConnect;
  @ViewChild('moPrecon') moPrecon;
  @ViewChild('moMobEdit') moMobEdit;
  @ViewChild('moMobEditTitle') moMobEditTitle;
  @ViewChild('moMobEditName') moMobEditName;
  @ViewChild('moMobEditType') moMobEditType;
  @ViewChild('moMob') moMob;
  public toggle:boolean = false;
  public toggleEditMobDef:boolean = false;
  public drag:boolean = true;

  public type:string = "moDefault";
  public motype:string = "preffect|effect|posteffect|iodevice|resource";
  public title:string = "";
  public objectname:string = "unknown";
  public colorPath:SafeStyle = "";
  public texturePath:string = "";


  /*PARAMS*/
  @Input() public params:any;
  @Input() public Params:any;
  public paramSelect: any = undefined;
  public showParams:boolean = false;

  public globalMouseUp: () => void;
  public globalClick: () => void;
  public globalKey: () => void;

  @Input() public Mob : any = undefined;
  @Input() public MobDef : any = undefined;
  @Input() public Config : any = undefined;
  @Input() public Console : any = undefined;

  constructor(public con: ConnectionsService,
    public par: ParamsService,
    public renderer: Renderer2,
    public viewCon: ViewContainerRef,
    public sanitizer: DomSanitizer) {
    con.renderer = renderer;
  }

  public ngOnInit(): void {
    let this_ = this;
    //this.title = this.type + " - " + this.name;

    /*Global Listener*/
    this.globalClick = this.renderer.listen("document", 'click', (e) => {
      //this_.toggle = false;
      console.log(e.target);
      //if(e.target.className !== "moParams" && e.target.className !== "moParamsContent"){
      if (e.target.getAttribute("id") === "moConnect") {
        this_.toggle = false;
        if (this_.toggleEditMobDef) {
          this.SaveMobDef({});
        }
        this_.toggleEditMobDef = false;
      }

      if(this.globalKey){
        this.globalKey();
      }
    });
    this.globalMouseUp = this.renderer.listen("document", 'mouseup', (e) => {
      this_.drag = true;
    });
    if (this.params) {
      /*
      if(this.params[4][1][0] == "default" || this.params[4][1][0] == ""){
          this.texturePath = "./assets/mojs-interface-data/icons/moldeologo.png"; //Default Texture
      } else {
          this.texturePath = this.params[4][1][0];
      }

      this.colorPath = this.sanitizer.bypassSecurityTrustStyle('rgba('+this.params[1][1][0]+
      ', '+this.params[1][1][1]+', '+this.params[1][1][2]+', '+this.params[1][1][3]+')');
      */
    }
  }

  public ngDoCheck(): void{
    if (this.moConnect)
    if(this.moConnect.nativeElement.children.length > 0){
      if(this.drag){
        this.con.updateCon(this.moObj, this.moConnect);
      }
    }
    if (this.params) {
      /*
      if (this.params[4][1][0] == "default" || this.params[4][1][0] == "") {
          this.texturePath = "./assets/mojs-interface-data/icons/moldeologo.png"; //Default Texture
      } else {
          this.texturePath = this.params[4][1][0];
      }
      this.colorPath = this.sanitizer.bypassSecurityTrustStyle('rgba('+this.params[1][1][0]*255+
      ', '+this.params[1][1][1]*255+', '+this.params[1][1][2]*255+', '+this.params[1][1][3]+')');
      */
    }
  }

  public ngAfterViewInit(): void{
    if (this.moObj) {
      this.moObj.nativeElement.attributes.type = this.motype; //Send Type
      this.moObj.nativeElement.style.left = this.posX+"px";
      this.moObj.nativeElement.style.top = this.posY+"px";
    }
    /********************************************************/
    if (this.moConnect) {
      this.moConnect.nativeElement.style.width = screen.width+"px";
      this.moConnect.nativeElement.style.height = screen.height+"px";
    }
    if (this.moPrecon) {
      this.moPrecon.nativeElement.style.width = screen.width+"px";
      this.moPrecon.nativeElement.style.height = screen.height+"px";
    }
    if (this.moMobEdit) {
      this.moMobEdit.nativeElement.style.display = "none";
    }
  }

  public ngOnDestroy(): void{
    //NULL Vars
    this.posX = null;
    this.posY = null;
    this.name = null;
    this.moObj = null;
    this.moSettings = null;
    this.moConnect = null;
    this.moPrecon = null;
    this.toggle = null;
    this.drag = null;
    this.type = null;
    this.title = null;
    this.con = null;
    this.renderer = null;
    this.viewCon = null;
    //DESTROY LISTENER WHEN DESTROY Component
    if(this.globalMouseUp){
      this.globalMouseUp();
    }
    if(this.globalClick){
      this.globalClick();
    }
  }
  /*- LYFECYCLE END -*/

  ///////////////////////////////////////////////////////////////////
  /*- moObject Funs -*/
  ///////////////////////////////////////////////////////////////////

  public setMob( mob : any ) : void {
    this.Mob = mob;
    this.MobDef = mob.GetMobDefinition();
    this.objectname = ""+this.Mob.GetName();
    this.title = ""+this.Mob.GetLabelName();
    this.name = ""+this.Mob.GetName();
    this.type = ""+this.Mob.GetName();
    this.motype = ""+this.Mob.GetType();
    this.Config = this.Mob.m_Config;
    this.Params = this.Mob.m_Config.m_Params;
    if (mob.GetLabelName()) this.objectname = ""+this.Mob.GetLabelName();
  }

  public EditMobDef( ev : any ) {
    console.log("EditMobDef: ", ev);
    this.toggleEditMobDef = true;
    this.moMobEdit.nativeElement.style.display = "block";
    this.moMob.nativeElement.style.display = "none";
  }

  public SaveMobDef( ev : any ) {
    console.log("SaveMobDef: ", ev );
    this.toggleEditMobDef = false;
    this.moMobEdit.nativeElement.style.display = "none";
    this.moMob.nativeElement.style.display = "block";
    this.title = this.moMobEditTitle.nativeElement.value;
    this.name = this.moMobEditName.nativeElement.value;
    //this.type = this.moMobEditType.nativeElement.value;
    if (this.Mob) {
      this.Mob.GetMobDefinition().SetLabelName(this.title);
      this.Mob.GetMobDefinition().SetName(this.name.replace(".cfg",""));
      //TODO: upgrade or downgrade fx: this.Mob.GetMobDefinition().SetName(this.type);
      console.log(this.Mob);
      this.Console.UpdateMoldeoIds();
      this.Console.CreateConnectors();
    }

  }

  public showSet(): void{
    this.toggle = true;
    if (this.moSettings) {
      this.moSettings.nativeElement.style.left = this.moObj.nativeElement.style.left;
      this.moSettings.nativeElement.style.top = this.moObj.nativeElement.style.top;
    }

    this.globalKey = this.renderer.listen("document", 'keydown', (e) => {
      if(e.key == "Delete"){
        this.removeMOObject();
      }
    });
  }

  public selParam(param): void {
    let this_ = this;
    this.paramSelect = param;
    this.showParams = false;
    setTimeout(function(){this_.showParams = true;}, 1);
  }

  public getNewParam(e): void{
    if(e.key == "Enter"){
      let this_ = this;
      let indexPar = Array.from(e.target.parentNode.children).indexOf(e.target);
      let currentPar = 0;

      for (let i = 0; i < this.Params.length; i++) {
        if (typeof this.paramSelect == 'object') {
          console.log("getNewParam:",this.Params[i],this.paramSelect);
          var pname = this.Params[i].GetName();
          var psel = this.paramSelect.GetName();
          if( pname === psel ){
            currentPar = i;
          }
        }
      }

      let preconf_index = 0;
      //this_.params[currentPar][1][indexPar] = e.target.value;
      //this_.params[currentPar][1][indexPar] = e.target.value;
      //this_.Params[currentPar].m_List[indexPar] = e.target.value;
      this_.Params[currentPar].m_Values[0].m_List[indexPar].SetVal( e.target.value );
      this_.Mob.ResolveValue( this.Params[currentPar], preconf_index );

      /**
      for (let i = 0; i < this.params.length; i++) {
        if(this.params[i][0] === this.paramSelect[0]){
          currentPar = i;
        }
      }
      this_.params[currentPar][1][indexPar] = e.target.value;
      **/

      this.showParams = false;
      setTimeout(function(){this_.showParams = true;}, 1);
    }
  }

  public changeName(e): void{
    if(e.key == "Enter"){
      this.name = e.target.value;
    }
  }

  public changeKey(e): void{
    if(e.key == "Enter"){
      this.key = e.target.value;
    }
  }

  public removeMOObject(): void{
    this.viewCon.element.nativeElement.parentElement.removeChild(this.viewCon.element.nativeElement);
    console.log( "mob to delete: ", this.Mob, this.Console );
    this.Console.UnloadObject( this.Mob.GetMobDefinition() );
    this.ngOnDestroy();
    //


  }

  private testObject(): void{
    console.log("MoldeoJS");
    console.log("moObject Type: "+this.type);
    console.log("moObject Name: "+this.name);
    console.log(this.type + " " + this.name + " connections: "+this.moConnect.nativeElement.children.length);
  }
}
