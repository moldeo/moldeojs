import { HttpClient } from "@angular/common/http";
import * as THREE from "three";
import * as html2canvas from "html2canvas";

import {
  MO_VERSION,MO_USERAGENT,
  MOfloat, MOdouble, MOulong,
  MOlong, MOint, MOuint, moNumber,
  moTextFilterParam, MOswitch,
  MO_DEACTIVATED, MO_ACTIVATED, MO_OFF, MO_ON, MO_FALSE,
  MO_NOERROR, MO_SUCCESS, MO_TRUE, MO_FAIL, MO_ERROR,
  MO_UNDEFINED, MO_RELEASED, MO_PULSED,
  MO_DISPLAY, MO_HANDLE, NULL
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import {
  moMoldeoObject, moMoldeoObjects, moMobDefinition,
  MO_MOLDEOOBJECTS_OFFSET_ID
} from "./mo-moldeo-object";
import { moVector2 } from "./mo-math-manager";
import {
  moEffect, moSceneEffect, moEffectsArray, moEffectState,
  moPreEffect, moPreEffectsArray,
  moPostEffect, moPostEffectsArray,
  moMasterEffect, moMasterEffectsArray
} from "./mo-effect";
import { moEffectManager } from "./mo-effect-manager";
import { moEventList, moEvent, moMessage } from "./mo-event-list";
import { moIODeviceManager, moIODevice, moIODevices, moIODeviceArray } from "./mo-iodevice-manager";
import { moResourceManager, moResource, moResources } from "./mo-resource-manager";
import {
  moGUIManager, moGuiObject,
  moMaterial, moMaterialBasic, moColor,
  moGeometry, moSphereGeometry, moPlaneGeometry,
  moMesh, moCamera3D
} from "./mo-gui-manager";
import {
  moSceneNode, moSceneNodeArray
} from "./mo-3d-model-manager";
import {
  moRenderManager, moRenderManagerMode,
  moDisplay, moResolution
} from "./mo-render-manager";
import { DEG_TO_RAD, PI, TWO_PI, RAD_TO_DEG } from "./mo-math";
import { moGLManager, moGLMatrixf } from "./mo-gl-manager";
import { moTextureManager } from "./mo-texture-manager";
import { moTexture } from "./mo-texture";
import {
  moConsoleState, moConsoleMode, MO_DEF_SCREEN_WIDTH, MO_DEF_SCREEN_HEIGHT, MO_DEF_RENDER_WIDTH, MO_DEF_RENDER_HEIGHT
} from "./mo-console-state";
import { moFile, moSlash, moFileManager, EXEDIR } from "./mo-file-manager";
import { moTempo } from "./mo-tempo";
import {
  moTimer, moTimerAbsolute, moTimerState, GlobalMoldeoTimer,
  moStartTimer, moStopTimer, moPauseTimer, moContinueTimer,
  moIsTimerPaused, moIsTimerPlaying, moIsTimerStopped,
  moGetDuration, moSetDuration,
  moGetTicks, moGetTicksAbsolute, moGetTicksAbsoluteStep, moGetTimerState,
  moGetTimerStateStr
} from "./mo-timer";
import {
  moDataSession, moDataSessionConfig, moDataSessionEventKey,
  moDataSessionConfigParameters
} from "./mo-data-manager";
import { moValue } from "./mo-value";
import { moParam } from "./mo-param";
import { moNewIODevice, moNewEffect, moNewResource } from "./mo-plugin";

export const MO_MAX_EFFECT = 40;
export const MO_MAX_PRESETS = 9;
export const MO_NO_EFFECT = -1;

export const MO_CFG_EFFECT = 0;
export const MO_CFG_EFFECT_CONFIG = 1;
export const MO_CFG_EFFECT_LABEL = 2;
export const MO_CFG_EFFECT_PRE = 3;
export const MO_CFG_EFFECT_ON = 4;
export const MO_CFG_EFFECT_KEY = 5;

export const MO_CFG_ACCION_STR = 0;
export const MO_CFG_ACCION_COD = 1;
export const MO_CFG_ACCION_CODDISP = 2;

export const MAX_SELECCIONADOS = 255;

function arrayRemove(arr, value) { return arr.filter(function(mob){ return mob.GetLabelName() != value.GetLabelName(); });}

export class moConsoleOptions {
    apppath : moText;
    datapath : moText;
    consoleconfig : moText;
    pIODeviceManager : moIODeviceManager;
    pResourceManager : moResourceManager;
    render_to_texture_mode : moRenderManagerMode = moRenderManagerMode.RENDERMANAGER_MODE_NORMAL;
    screen_width : MOint = MO_DEF_SCREEN_WIDTH;
    screen_height : MOint = MO_DEF_SCREEN_HEIGHT;
    render_width : MOint = MO_DEF_RENDER_WIDTH;
    render_height : MOint = MO_DEF_RENDER_HEIGHT;
    OpWindowHandle : MO_HANDLE = 0;
    Display: MO_DISPLAY = NULL;
    moldeojs_version : moText = MO_VERSION;

    constructor() {

    }
};

export class moConsole extends moMoldeoObject {

  m_ConsoleState : moConsoleState;
  m_EffectManager: moEffectManager;
  m_pIODeviceManager: moIODeviceManager;
  m_MoldeoObjects: moMoldeoObjects;
  m_MoldeoSceneObjects : moMoldeoObjects;

  /** Console options are saved in .mol > related to context, moldeojs_version, output layout (1,2 monitors), etc... */
  moldeojs_version : moText = MO_VERSION;
  version : moText = "";

  html2canvas : any = undefined;

  constructor( private http: HttpClient ) {
    super();
    this.html2canvas = html2canvas;
    //console.log("this.html2canvas:",this.html2canvas);
    this.m_ConsoleState = new moConsoleState();
    this.m_EffectManager = new moEffectManager();
    this.m_MoldeoObjects = [];
    this.m_MoldeoSceneObjects = [];
    this.SetName("__console__");
    this.SetLabelName("__console__");
    this.SetType( moMoldeoObjectType.MO_OBJECT_CONSOLE );
  }

/** moConsole.Init
 *
 * @options = {
 * "consoleconfig" : path to the *.mol project file
 * "callback" : callback when project is loaded,
 * }
 *
 * Example:
 * Console.Init( {
 *    "consoleconfig": "/moldeorepos/basic/00_Image/00_Image.mol",
 *    "callback": (result) => {
 *        //we are ok to draw
 *        this.animate();
 *    }
 * })
 *
 *
 * @options = {
 * "consoleconfig" : path to the *.mol project file
 * "callback" : callback when project is loaded,
 * "apppath" : Application Path (optional)
 * "datapath" : Data Path (optional)
	 "pIODeviceManager": moIODeviceManager Object (optional),
	 "pResourceManager",
	 "render_to_texture_mode": 0 (Normal), 1 (forcing FBOs), 2 (reserved)
	 "screen_width": Webgl Window Width
   "screen_height": Webgl Window Height
	 "render_width": Webgl Render Width for optimization
   "render_height": Webgl Render Height for optimization
   }
 */
  Init(options?: any): boolean {

    //console.log("moConsole.Init > options: ", options, typeof options);

    if (typeof options == "string") {
      //we assume it is the full console config path... minimal...
      options = {
        "consoleconfig": options,
      };
    }

    if (typeof options == "object") {

      if ("IODeviceManager" in options) {
        //do not create ResourceManager
        this.m_pIODeviceManager = options["IODeviceManager"];
        // test if is ok
      } else {
        this.m_pIODeviceManager = new moIODeviceManager();
        this.m_pIODeviceManager.Init();
        this.m_pFileManager = new moFileManager(this.http);
        this.m_pFileManager.Init();
        //console.log("moConsole::Init > moResourceManager: ", this.m_pResourceManager);
      }


      // "consoleconfig"
      if ("consoleconfig" in options) {
        var cf_name = "";
        if (typeof options["consoleconfig"] == "object") {
          this.SetConfigName( options["consoleconfig"].name );
        } else if (typeof options["consoleconfig"] == "string") {
          this.SetConfigName( options["consoleconfig"] );
        }
      }

      //moFile
      if (options.constructor)
        if ("name" in options.constructor) {
          if (options.constructor.name == "moFile") {
            //console.log("moConsole.Init > Loading moFile >", options);
            //this.m_Config.LoadConfig( options );
            var p_F: moFile = options;
            this.SetConfigName(options.m_CompletePath);
          }
        }
    }

    //OK ===
    if (this.GetConfigName() == undefined || this.GetConfigName() == "") {
      console.error("No config file (.mol) defined. Please read the manual.")
      return false;
    }

    //RUNNING MOLDEO OBJECT INIT for loading base
    super.Init((result) => {
      var File : moFile = new moFile(this.GetConfigName());
      //console.log("Config Loaded!", File.GetFileName());

      var res_ok = this.InitResources({
        "apppath": EXEDIR,
        "datapath": File.GetPath(),
        "consoleconfig": this.m_Config,
        "callback": options["start_loading"]
      });

      if (res_ok) {

        this.m_EffectManager.m_pResourceManager = this.GetResourceManager();
        this.m_EffectManager.Init();

        this.m_ConsoleState.Init();

        if(this.m_pResourceManager) {

          for(var i = 0; i<this.m_pResourceManager.Resources().length; i++) {
            var mobject : moMoldeoObject = this.m_pResourceManager.GetResource(i);
            if (mobject) {
              this.m_MoldeoObjects.push( mobject );
            }
          }

          if (this.m_pIODeviceManager) {
            this.m_pIODeviceManager.m_pResourceManager = this.m_pResourceManager;
          }

        }

        this.LoadObjects(moMoldeoObjectType.MO_OBJECT_IODEVICE, (iod) => {
          this.LoadObjects(moMoldeoObjectType.MO_OBJECT_RESOURCE, (res) => {

            //check sensors and mouse...

            this.LoadObjects(moMoldeoObjectType.MO_OBJECT_PREEFFECT, (pre) => {
              this.LoadObjects(moMoldeoObjectType.MO_OBJECT_EFFECT, (efe) => {
                this.LoadObjects(moMoldeoObjectType.MO_OBJECT_POSTEFFECT, (pos) => {
                  this.LoadObjects(moMoldeoObjectType.MO_OBJECT_MASTEREFFECT, (mas) => {
/*
                this.InitObjects(moMoldeoObjectType.MO_OBJECT_PREEFFECT, (initpre) => {
                  this.InitObjects(moMoldeoObjectType.MO_OBJECT_EFFECT, (initefe) => {
                    if (options["effects_started"]) options["effects_started"](initefe);
                  });
                });
*/

                    //adding console!
                    this.m_MoldeoObjects.push(this);

                    this.UpdateMoldeoIds();
                    if (options["effects_loaded"]) options["effects_loaded"](this);
                    //TODO: OJO: chequear el orden de ScriptExeUpdate > CreateConnectors (que llama a ScriptExeInit) > luego Inicializar los objetos...
                    this.ScriptExeUpdate();
                    this.CreateConnectors();

                    //Effects are all initalized (that's when every config is really processed by every moMoldeoObject.... then taking references from others configs )
                    this._InitializeAllEffects( 0 , (res) => {
                      if (options["effects_started"]) options["effects_started"](this);
                    });

                    //var RenderMan: moRenderManager = this.m_pResourceManager.GetRenderMan();
                    //RenderMan.Black();

                  });
                });
              });
            });
          });
        });
      }

      if (options["config_open"]) options["config_open"](result);
    });


    return this.Initialized();
  }

  RelativeToGeneralIndex( relativeindex : MOint, p_type : moMoldeoObjectType ) : MOint {

  var mindex : MOint = -1;

  switch(p_type) {
    case moMoldeoObjectType.MO_OBJECT_EFFECT:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= this.m_pIODeviceManager.IODevices().length;
      mindex+= this.m_EffectManager.PreEffects().length;
      mindex+= this.m_EffectManager.PostEffects().length;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_PREEFFECT:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= this.m_pIODeviceManager.IODevices().length;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_POSTEFFECT:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= this.m_pIODeviceManager.IODevices().length;
      mindex+= this.m_EffectManager.PreEffects().length;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_MASTEREFFECT:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= this.m_pIODeviceManager.IODevices().length;
      mindex+= this.m_EffectManager.PreEffects().length;
      mindex+= this.m_EffectManager.PostEffects().length;
      mindex+= this.m_EffectManager.Effects().length;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_IODEVICE:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_RESOURCE:
      mindex = 0;
      mindex+= relativeindex;
      break;
    case moMoldeoObjectType.MO_OBJECT_CONSOLE:
      mindex = this.m_pResourceManager.Resources().length;
      mindex+= this.m_pIODeviceManager.IODevices().length;
      mindex+= this.m_EffectManager.PreEffects().length;
      mindex+= this.m_EffectManager.PostEffects().length;
      mindex+= this.m_EffectManager.Effects().length;
      mindex+= this.m_EffectManager.MasterEffects().length;
      break;

    default:
      break;

  }
  if (mindex == -1)
    this.MODebug2.Error("moConsole::RelativeToGeneralIndex > type not found");
  return mindex;

}

  UpdateMoldeoIds() {
    //console.log("moConsole.UpdateMoldeoIds");
    let max : MOint = this.RelativeToGeneralIndex( 0, moMoldeoObjectType.MO_OBJECT_CONSOLE ) + 1;
    this.m_MoldeoObjects = [];

    this.m_MoldeoSceneObjects = [];

    for( let i=0; i<this.m_pResourceManager.Resources().length; i++ ) {
      let pResource : moResource = this.m_pResourceManager.Resources()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_RESOURCE)] = pResource;
    }

    for( let i=0; i<this.m_pIODeviceManager.IODevices().length; i++ ) {
      let pIODevice : moIODevice = this.m_pIODeviceManager.IODevices()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_IODEVICE )] = pIODevice;
    }

    for( let i=0; i<this.m_EffectManager.PreEffects().length; i++ ) {
      let pFx : moPreEffect = this.m_EffectManager.PreEffects()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_PREEFFECT )] = pFx;
    }

    for( let i=0; i<this.m_EffectManager.PostEffects().length; i++ ) {
      let pFx : moPostEffect = this.m_EffectManager.PostEffects()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_POSTEFFECT )] = pFx;
    }

    for( let i=0; i<this.m_EffectManager.Effects().length; i++ ) {
      let pFx : moEffect = this.m_EffectManager.Effects()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_EFFECT )] = pFx;
    }

    for( let i=0; i<this.m_EffectManager.MasterEffects().length; i++ ) {
      let pFx : moMasterEffect = this.m_EffectManager.MasterEffects()[i];
      this.m_MoldeoObjects[ this.RelativeToGeneralIndex( i, moMoldeoObjectType.MO_OBJECT_MASTEREFFECT )] = pFx;
    }

    this.m_MoldeoObjects[ this.RelativeToGeneralIndex( 0, moMoldeoObjectType.MO_OBJECT_CONSOLE )] = this;

    ///SET Moldeo Objects Unique Id's
    for( var i=0; i<this.m_MoldeoObjects.length; i++) {
     let mobject : moMoldeoObject = this.m_MoldeoObjects[i];
      if (mobject) mobject.SetId( MO_MOLDEOOBJECTS_OFFSET_ID + i);
    }

    ///PROCESSING SCENE OBJECTS (recursive)

    for (let i = 0; i < this.m_EffectManager.Effects().length; i++ ) {
      let pFx : moEffect = this.m_EffectManager.Effects()[i];
      if (pFx)
        if (pFx.GetName()=="scene") {
          //let pScene : moSceneEffect = pFx;
          //pScene.UpdateMoldeoIds( this.m_MoldeoSceneObjects );
        }
    }
  }

  InitializeAllEffects() {
    //console.log("moConsole.InitializeAllEffects");
    for ( var i= 0; i < this.m_EffectManager.m_AllEffects.length; i++ ) {
      var p_effect = this.m_EffectManager.m_AllEffects[i];
      if (p_effect) {
        p_effect.Init();
        //p_effect.Activate();
        /*
        pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
        on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();
        */
        //if (pre>=0) p_effect.GetConfig().SetCurrentPreConf(pre);
        //if (on>0) p_effect.Activate();
        //else p_effect.Deactivate();
      }
    }
/*
	int dg;
	moEffect*	p_effect = NULL;

	dg = m_Config.GetParamIndex("fulldebug");


	for(MOuint i=0; i<m_EffectManager.AllEffects().Count(); i++ ) {
		p_effect = m_EffectManager.AllEffects().GetRef(i);
		if( p_effect !=NULL) {

            moMobDefinition MD = p_effect->GetMobDefinition();

            Draw();

            MOint pre,on;
            MOint paramindex = MD.GetMobIndex().GetParamIndex();
            MOint valueindex = MD.GetMobIndex().GetValueIndex();
            moEffectState fxstate = p_effect->GetEffectState();

			if(m_Config.GetParam(dg).GetValue().GetSubValue(0).Text()==moText("yes")) {
				fxstate.fulldebug = MO_ACTIVATED;
			} else {
				fxstate.fulldebug = MO_DEACTIVATED;
			}

			if( p_effect->GetName()!=moText("debug") && p_effect->GetName()!=moText("erase")
				&& p_effect->GetName()!=moText("ligia")) {

				    bool res = p_effect->Init();


					if (res) {

                        pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
                        on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();

                        if (pre>=0) p_effect->GetConfig()->SetCurrentPreConf(pre);
                        if (on>0) p_effect->Activate();
                        else p_effect->Deactivate();

                        // Sucio codigo agregado rapidamente para poder asignar los efectos a teclas arbitrarias de las 4 filas
                        // del teclado:

					} else {
            MODebug2->Error("Error Initializing Effect: " + p_effect->GetName()
            + " Label: " + p_effect->GetLabelName() + " Cfg: " + p_effect->GetConfigName() );
					}
			} else {

                pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
                on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();

                if (pre>=0) p_effect->GetConfig()->SetCurrentPreConf(pre);
                if (on>0) p_effect->Activate();
                else p_effect->Deactivate();

			}
			//carga códigos...
			p_effect->LoadCodes( m_pIODeviceManager );
		}
	}
*/
  }

  _InitializeAllEffects( i : number, last_callback : any ) {
    var self = this;
    if (i>=this.m_EffectManager.m_AllEffects.length) {
      if (last_callback) last_callback();
      return;
    }
    var p_effect = this.m_EffectManager.m_AllEffects[i];
    if (p_effect) {
      p_effect.Init( (config_res, mob ) => {
        self._InitializeAllEffects( i + 1, last_callback );
      } );
    } else {
      if (last_callback) last_callback();
    }
  }

  InitResources(options?: any) : boolean {
    if (options) {
      if (options["ResourceManager"]) {
        this.m_pResourceManager = options["ResourceManager"];
      } else {
        this.m_pResourceManager = new moResourceManager(this.http);
      }
    }

    return this.m_pResourceManager.Init(options);
  }

  InitObjects( fx_type : moMoldeoObjectType, callback?: any ): void {

  }



  LoadObjects( obj_type : moMoldeoObjectType, callback?: any ): void {

    if (obj_type == moMoldeoObjectType.MO_OBJECT_UNDEFINED) {

      for(var i=0;i<moMoldeoObjectType.MO_OBJECT_TYPES;i++ ) {
        this.LoadObjects( i );
      }
      return;
    } else {
      //console.log("moConsole.LoadObjects fx_type: ", fx_type );
    }

    var text: moText;
    var objname: moText;
    var cfname: moText;
    var lblname: moText;
    var keyname : moText;
    var activate : boolean = true;
    var peffect : moEffect;
    var pobject : moMoldeoObject;

    var obj_string: moText = this.m_MobDefinition.GetTypeToName(obj_type, true);
    var param_obj_index : MOint = this.m_Config.GetParamIndex(obj_string);

    this.m_Config.SetCurrentParamIndex(param_obj_index);
    var N : MOint = this.m_Config.GetValuesCount(param_obj_index);

    if (this.MODebug2) {
      //this.MODebug2.Message( "moConsole::LoadObjects > Loading Object configs..." );
      //this.MODebug2.Message( "moConsole::LoadObjects > Objects number: " + N );
    }

    if ( N <= 0 ) {
      if (callback) callback("LoadObjects ok");
      return;
    }

    this.m_Config.FirstValue();

    for( var param_obj_val_index=0; param_obj_val_index < N; param_obj_val_index++) {
      //this.Draw();
      //objname = this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT).Text();
      var Value : moValue = this.m_Config.GetParam().GetValue();
      objname = Value.GetSubValue(MO_CFG_EFFECT).Text();
      cfname = Value.GetSubValue(MO_CFG_EFFECT_CONFIG).Text();
      lblname = Value.GetSubValue(MO_CFG_EFFECT_LABEL).Text();
      var subvalues : any = Value.GetSubValueCount()
      if (subvalues>=6)
        keyname = Value.GetSubValue(MO_CFG_EFFECT_KEY).Text();

      if (subvalues>=4)
        activate = (Value.GetSubValue(MO_CFG_EFFECT_ON).Int()>0);


      var completecfname : moText = "" + this.m_pResourceManager.GetDataMan().GetDataPath() + moSlash + cfname+ ".cfg";
      var FullCF : moFile = new moFile(completecfname);

      if ( !FullCF.Exists() || objname  == "nil" ) {
        if (!!FullCF.Exists()) this.MODebug2.Error( "moConsole::LoadObjects > Error: Config File doesn't exist : " + completecfname);
        if (objname  == "nil") this.MODebug2.Error( "moConsole::LoadObjects > Error: Object file is nil : " + completecfname);
        continue;
      }

      var MobDef : moMobDefinition = new moMobDefinition();
      MobDef.SetName(objname);
      MobDef.SetConfigName( cfname );
      MobDef.SetLabelName( lblname );
      MobDef.SetKeyName( keyname );
      MobDef.SetType( obj_type );

      MobDef.SetConsoleParamIndex(param_obj_index);
      MobDef.SetConsoleValueIndex(param_obj_val_index);
      MobDef.SetActivate(activate);

      this.LoadObject( MobDef );
      this.m_Config.NextValue();
    }

    //if (this.MODebug2)
      //this.MODebug2.Message( "moConsole::LoadObjects > Objects were loaded..." );
    if (callback) callback("LoadObjects ok");
  }

  GetValidLabelName( labelname : any, nextid: any = 0, validlabelname?: any ) : any {
    var founded = true;
    var conflict = false;
    if (validlabelname==undefined) {
      validlabelname = labelname;
    }
    this.m_MoldeoObjects.forEach( function(val, i) {
      if ( val.GetMobDefinition().GetLabelName()==validlabelname ) {
        //using numeral for titles... mmm no, maybe using numerals for preconfig like
        // reference to noname_1#3 = fx noname_1 fixed on preconfig 3
        validlabelname = labelname+"_"+nextid;
        conflict = true;
        founded = false;
      }
    });
    if (conflict) {
      return this.GetValidLabelName( labelname, nextid+1, validlabelname );
    }
    return validlabelname;
  }

  LoadObject( MobDef : moMobDefinition ) : any {

    var pobject : any = undefined;
    //console.log("LoadObject", MobDef);

    var n : any = MobDef.GetLabelName();
    MobDef.SetLabelName( this.GetValidLabelName( MobDef.GetLabelName() ) );
    if (n!=MobDef.GetLabelName()) {
      MobDef.SetConfigName( MobDef.GetLabelName() );
    }

    switch( MobDef.m_Type ) {
      case moMoldeoObjectType.MO_OBJECT_EFFECT:
      case moMoldeoObjectType.MO_OBJECT_PREEFFECT:
      case moMoldeoObjectType.MO_OBJECT_POSTEFFECT:
      case moMoldeoObjectType.MO_OBJECT_MASTEREFFECT:
        pobject = this.m_EffectManager.NewEffect( MobDef.GetName(),
                                                  MobDef.GetConfigName(),
                                                  MobDef.GetLabelName(),
                                                  MobDef.GetKeyName(),
                                                  MobDef.GetType(),
                                                  MobDef.GetMobIndex().m_paramindex,
                                                  MobDef.GetMobIndex().m_valueindex,
                                                  MobDef.GetActivate());
        break;

      case moMoldeoObjectType.MO_OBJECT_RESOURCE:
      case moMoldeoObjectType.MO_OBJECT_IODEVICE:

        if ( MobDef.m_Type == moMoldeoObjectType.MO_OBJECT_RESOURCE ) {
          //create plugin resource from "plugins/resources/objname.ts" see mo-plugins.ts
          var presource : moResource = moNewResource( MobDef.GetName(), {} );
          if (presource) {
            this.m_pResourceManager.AddResource(presource);
            pobject = presource;
          }
        } else {
          //create plugin iodevice from "plugins/iodevices/objname.ts" see mo-plugins.ts
          pobject = moNewIODevice( MobDef.GetName(), {} );
          //if (pobject) this.m_pIODeviceManager.AddDevice(pobject);
        }

        if (pobject) {
          //console.log("moEffectManager.NewEffect", peffect);
          var MDef : moMobDefinition = pobject.GetMobDefinition();
          MDef.SetConfigName( MobDef.GetName() );
          MDef.SetLabelName( MobDef.GetLabelName() );
          MDef.SetKeyName( MobDef.GetKeyName() );

          MDef.SetConsoleParamIndex( MobDef.GetMobIndex().m_paramindex );
          MDef.SetConsoleValueIndex( MobDef.GetMobIndex().m_valueindex );
          MDef.SetActivate( MobDef.GetActivate() );
          if (MDef.GetActivate()) {
            pobject.Activate();
          } else {
            pobject.Deactivate();
          }

          pobject.SetMobDefinition( MDef );
          //m_pMoldeoObjects->Add( (moMoldeoObject*) peffect );
          pobject.SetResourceManager( this.m_pResourceManager );
          pobject.Init();

        }

        break;

      default:

        break;

    }
    if (pobject) {
      this.m_MoldeoObjects.push( pobject );
    }

    if (this.MODebug2) {
      //this.MODebug2.Message( "moConsole::LoadObjects > " + completecfname );
    }

    return pobject;
  }

  UnloadObject( MobDef : moMobDefinition ): void {
    var pobject : any = undefined;
    //console.log("UnloadObject", MobDef);


    switch( MobDef.m_Type ) {
      case moMoldeoObjectType.MO_OBJECT_EFFECT:
      case moMoldeoObjectType.MO_OBJECT_PREEFFECT:
      case moMoldeoObjectType.MO_OBJECT_POSTEFFECT:
      case moMoldeoObjectType.MO_OBJECT_MASTEREFFECT:
        this.m_EffectManager.RemoveEffect(MobDef);
        break;
      case moMoldeoObjectType.MO_OBJECT_IODEVICE:
        this.m_pIODeviceManager.RemoveIODevice(MobDef);
        break;
      case moMoldeoObjectType.MO_OBJECT_RESOURCE:
        this.m_pResourceManager.RemoveResource(MobDef);
        break;
    }

    this.UpdateMoldeoIds();
    //TODO: re create CreateConnectors
    this.CreateConnectors();

  }

  callLoadObjects( obj_type : moMoldeoObjectType, callback?: any ) {

  }

  Draw(p_tempo: moTempo): void {

    if (this.m_pResourceManager == undefined) return;
    var RenderMan: moRenderManager = this.m_pResourceManager.GetRenderMan();

    if (this.Initialized())
      this.ScriptExeRun();

    //console.log("moConsole.Draw", this );
    if (this.m_ConsoleState.pause != MO_DEACTIVATED) return;

    this.ConsoleModeUpdate();

    var borrar: MOswitch = MO_ACTIVATED;
    var pre_effect_on: boolean = false;

    RenderMan.BeginDraw();
    for (var i = 1; i < this.m_EffectManager.m_PreEffects.length; i++) {
      var pEffect: moEffect = this.m_EffectManager.m_PreEffects[i];
      if (pEffect) {
        if (pEffect.Activated() && pEffect.m_Config.m_ConfigLoaded) {
          pre_effect_on = true;
          RenderMan.BeginDrawEffect();
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
          borrar = MO_DEACTIVATED;
        }
      }
    }
    //console.log("borrar:",borrar,"pre_effect_on",pre_effect_on);
    if (borrar == MO_ACTIVATED) {
      if (this.m_EffectManager.m_PreEffects.length > 0) {
        var pEffect: moEffect = this.m_EffectManager.m_PreEffects[0];
        if (pEffect.Activated() && pEffect.m_Config.m_ConfigLoaded) {
          RenderMan.BeginDrawEffect();
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
        }/*
					else
          if (!pre_effect_on && !RenderMan.IsRenderToFBOEnabled()
            && !RenderMan.RenderResEqualScreenRes())
							// All the preeffects are disabled, including erase. And the screen resolution is different from
							// the render resolution. So the last screen image has to be redrawn at render resolution.
							RenderMan.DrawTexture(MO_RENDER_RESOLUTION, MO_FINAL_TEX);*/
      }
    }

    for (var i = 0; i < this.m_EffectManager.m_Effects.length; i++) {
      var pEffect: moEffect = this.m_EffectManager.m_Effects[i];
      if (pEffect) {
        if (pEffect.Activated() && pEffect.m_Config.m_ConfigLoaded) {
          RenderMan.BeginDrawEffect();
          //console.log("draw:",pEffect.GetName());
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
        }
      }
    }

    if (this.IsInitialized()) {
        if (this.ScriptHasFunction("Draw")) {
            this.SelectScriptFunction("Draw");
            //this.AddFunctionParam( i + j*this.m_cols);
            //this.AddFunctionParam( this.dt );
            if (!this.RunSelectedFunction(1)) {
                //this.MODebug2.Error( moText("RunParticle function not executed") );
            }
        }
    }

    RenderMan.CopyRenderToTexture(0);

    //draw overlay (out of render texture...)
    if (this.IsInitialized()) {
        if (this.ScriptHasFunction("DrawOverlay")) {
            this.SelectScriptFunction("DrawOverlay");
            //this.AddFunctionParam( i + j*this.m_cols);
            //this.AddFunctionParam( this.dt );
            if (!this.RunSelectedFunction(1)) {
                //this.MODebug2.Error( moText("RunParticle function not executed") );
            }
        }
    }

    RenderMan.EndDraw();


  }

  DrawX( p_tempo: moTempo) : void {

  }

  ConsoleModeUpdate() : void {
    /**
    chequear que haya una sesion activa en el DataManager...
    */
    var loadedSession : moDataSession = this.GetResourceManager().GetDataMan().GetSession();
    /**
    moldeoplayer -mol xx.mol -mos session.mos -outputmode "AUTOPLAY" -mode "LIVE"|"RECORD"|"PLAYBACK"|"RENDER"
    */
    //session object
    if (loadedSession == undefined) {
      this.MODebug2.Error("moConsole::ConsoleModeUpdate > no session"); return;
    }


    switch( this.m_ConsoleState.m_Mode ) {

      case moConsoleMode.MO_CONSOLE_MODE_LIVE:
        {
        //normal mode: do nothing
          this.m_ConsoleState.tempo.Duration();
          this.m_ConsoleState.tempo.getTempo();
          //console.log("console tempo", this.m_ConsoleState.tempo.ang, this.m_ConsoleState.tempo);
        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_PLAY_SESSION:
        {
        //playing back last session loaded
        //
          //loaded/loading session
          if (!loadedSession.Loaded())
            if (!loadedSession.LoadSession()) {
              this.MODebug2.Error("moConsole::ConsoleModeUpdate > no loaded session"); return;
            }

          //session ended?
          if (loadedSession.SessionEnded()) {
            this.MODebug2.Message("moConsole::ConsoleModeUpdate > session playback ended."); return;
          }

          // 1000 / 20fps = 50 ms
          // 1000 / 24fps = 41 ms = 24 frames + 16/24
          // 1000 / 25fps = 40 ms = 25 frames
          // 1000 / 30fps = 50 ms
          this.m_ConsoleState.step_interval = 41;

          moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );

          //process next keys
          this.ProcessSessionKey( loadedSession.NextKey( this.m_ConsoleState ) );

        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_RECORD_SESSION:
        {
          this.m_ConsoleState.tempo.Duration();
          this.m_ConsoleState.tempo.getTempo();

        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_RENDER_SESSION:
        {
          this.m_ConsoleState.step_interval = 41;
          var tickis : MOlong = moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );
          this.MODebug2.Message("moConsole::ConsoleModeUpdate > render session: " + tickis );
          var console_timecode : MOint = this.m_ConsoleState.tempo.Duration();

          if (console_timecode==0)  {
                this.m_ConsoleState.tempo.Fix();
                this.m_ConsoleState.tempo.Stop();
                this.m_ConsoleState.tempo.Start();
          }

          this.m_ConsoleState.tempo.getTempo();

          this.MODebug2.Message("moConsole::ConsoleModeUpdate > render session: "
            + "m_ConsoleState.tempo.Duration: "
            + console_timecode);

          this.ProcessSessionKey( loadedSession.NextKey( this.m_ConsoleState ) );
          loadedSession.StepRender( this.m_ConsoleState );

        }
        break;

      default:
        /**  */
        break;
    };

  }

  Update() : void {
    if (!this.m_pResourceManager) return;
    var RenderMan : moRenderManager = this.m_pResourceManager.GetRenderMan();
    if (!this.m_pIODeviceManager) return;
    var m_pEventList : moEventList = this.m_pIODeviceManager.GetEvents();
    /*
    m_ScreenshotInterval = m_Config.Int(moR(CONSOLE_SCREENSHOTS));

      if (m_ScreenshotInterval>30) {
          if (!m_ScreenshotTimer.Started()) {
              m_ScreenshotTimer.Start();
          } else {

              if ( m_ScreenshotTimer.Duration()>m_ScreenshotInterval ) {
                  m_pResourceManager->GetRenderMan()->Screenshot(moText(""),m_LastScreenshot);
                  m_ScreenshotTimer.Stop();
                  m_ScreenshotTimer.Start();
              }

          }
      }
      */

    ///TODO: each Object see all events and process a few... can and should be optimized
    /// optimization: only send a partial event list to every object, filtered by
    /// moMoldeoObject->GetMobDefinition()->GetMoldeoId()
  	RenderMan.BeginUpdate();
  	if (this.m_pIODeviceManager) {
  		for(var i = 0; i<(this.m_MoldeoObjects.length + this.m_MoldeoSceneObjects.length); i++) {
  			RenderMan.BeginUpdateObject();
  			var pMOB : moMoldeoObject = null;
  			if (i<this.m_MoldeoObjects.length)
          pMOB = this.m_MoldeoObjects[i];
  			else
          pMOB = this.m_MoldeoSceneObjects[i-this.m_MoldeoObjects.length];
  			if (pMOB) {
          if (pMOB.GetType() != moMoldeoObjectType.MO_OBJECT_IODEVICE)
            ///MO_OBJECT_IODEVICE WERE ALREADY UPDATED VIA m_pIODeviceManager->Update()
            if (pMOB.Activated()) {
              //console.log("updating obj",pMOB,this.m_pIODeviceManager.GetEvents());
              pMOB.Update( m_pEventList );
            }
  			}
  			RenderMan.EndUpdateObject();
  		}

  		this.m_pIODeviceManager.PurgeEvents();
  	}
  	RenderMan.EndUpdate();
/*
  moEventList* pEvents = m_pIODeviceManager->GetEvents();
  int nevents = 0;

  if (pEvents) {
      moEvent *actual=NULL,*tmp;
     // moMessage *pmessage;

      if (pEvents) actual = pEvents->First;

      ///Procesamos los eventos recibidos de los MoldeoObject Outlets
      while(actual!=NULL) {
        nevents++;
        tmp = actual->next;
        ///procesamos aquellos Outlet q estan dirigidos a este objeto
        //moText debugstr = actual->ToJSON();

        if (  actual->deviceid==MO_IODEVICE_CONSOLE
            && actual->devicecode == MO_ACTION_MOLDEOAPI_EVENT_SEND
            && actual->reservedvalue3 == MO_DATAMESSAGE) {
                moDataMessage* mpDataMessage = (moDataMessage*) actual->pointer;
                if (mpDataMessage) {
                  //tmpstr = "MOLDEOAPI MO_DATAMESSAGE > count:" + mpDataMessage->Count();
                  delete mpDataMessage;
                }
                actual->pointer = NULL;
                pEvents->Delete(actual);
        }

        if (actual->deviceid>=MO_MOLDEOOBJECTS_OFFSET_ID) {
          moMoldeoObject* pobj = GetObjectByIdx( actual->deviceid );
          //debugstr = pobj->GetLabelName()+"("+IntToStr(actual->deviceid)+") >> "+actual->ToJSON();
        }
        actual = tmp;

        //MODebug2->Message( debugstr );
      }

      //if ()
        //MODebug2->Message("fps:"+fps_text+" nevents:"+IntToStr(nevents));

  }
  */
/*
  //Procesamos aquellos Mensajes enviados con acciones
  moEvent* actual = m_pIODeviceManager->GetEvents()->First;
  moEvent* tmp = NULL;
  while(actual!=NULL) {

      if ( actual->deviceid==MO_IODEVICE_CONSOLE
        &&
           actual->reservedvalue3 == MO_MESSAGE ) {

          moMessage* ConsoleMessage = (moMessage*)actual;
          this->ProcessConsoleMessage(ConsoleMessage);
      }

      if ( ( actual->deviceid == MO_IODEVICE_CONSOLE )
            && ( actual->devicecode == MO_ACTION_MOLDEOAPI_EVENT_RECEIVE )
            && ( actual->reservedvalue3 == MO_DATAMESSAGE ) ) {

          moDataMessage* MoldeoAPIMessage = (moDataMessage*)actual->pointer;
          this->ProcessMoldeoAPIMessage( MoldeoAPIMessage );
     }

      tmp = actual;
      actual = tmp->next;
  }

	moMoldeoObject::Update( m_pIODeviceManager->GetEvents() );
  */
    super.Update( m_pEventList );
  }

  Resize( w : number, h : number ) : void {
    if (this.m_pResourceManager)
      this.m_pResourceManager.GetRenderMan().Resize(w,h);
  }

  Interaction() : boolean {
    if (this.m_pResourceManager == undefined) return;
    var RenderMan: moRenderManager = this.m_pResourceManager.GetRenderMan();

    RenderMan.BeginUpdate();
    if (this.m_pIODeviceManager) {
  		RenderMan.BeginUpdateDevice();
      this.m_pIODeviceManager.Update();
      //TODO: check special keyboard keys...ESC..F12 (reload-change presentation mode)
      RenderMan.EndUpdateDevice();
    }
    RenderMan.EndUpdate();


    //INTERACCION EFFECTS MAESTROS

  	for( var i : MOint = 0; i < this.m_EffectManager.m_MasterEffects.length; i++) {
  		let pEffect = this.m_EffectManager.m_MasterEffects[i];
  		let fxstate: moEffectState = pEffect.GetEffectState();
  		if(pEffect) {
  			if(pEffect.Activated()) {
  				pEffect.Interaction( this.m_pIODeviceManager );
  			}
  		}
  	}

    for( var i : MOint = 0; i < this.m_EffectManager.m_Effects.length; i++) {
  		let pEffect = this.m_EffectManager.m_Effects[i];
  		let fxstate: moEffectState = pEffect.GetEffectState();
  		if(pEffect) {
  			if(pEffect.Activated() && pEffect.m_Config.m_ConfigLoaded) {
  				pEffect.Interaction( this.m_pIODeviceManager );
  			}
  		}
  	}

    return true;
  }

  TestEnabled() : boolean {
    // clear here:
    return true;
  }

  TestScreen( p_display_info?: moDisplay, options?: any ) {
    if (this.m_pResourceManager==null || this.m_pResourceManager==undefined) {
      this.m_pResourceManager = new moResourceManager(this.http);
      this.m_pResourceManager.Init();
    }
    var RMan: moRenderManager = this.m_pResourceManager.MORenderMan;
    //var GMan: moGUIManager = this.m_pResourceManager.MOGuiMan;
    var TMan: moTextureManager = this.m_pResourceManager.MOTextureMan;
    var GLMan: moGLManager = this.m_pResourceManager.MOGLMan;

    ///MATERIAL
    var Mat: moMaterial = new moMaterial();

    var id: MOint = TMan.GetTextureMOId("default");
    //var id: MOint = TMan.GetTextureMOId("./assets/data/icons/moldeotrans2.png", true, false);
    //var id: MOint = TMan.GetTextureMOId("./assets/data/icons/water.jpg", true, false);
    var customwater_id : MOint = TMan.GetTextureMOId("customwater",false,false);
    //console.log( "customwater_id:", customwater_id)
    if (customwater_id==-1) {
      customwater_id = TMan.AddTexture("customwater",512,512);
      var MoldeoWaterTexture : moTexture = TMan.GetTexture(customwater_id);
      //console.log(MoldeoWaterTexture);
      MoldeoWaterTexture._texture = TMan.m_TextureLoader.load("./assets/data/icons/water.jpg");
    }
    id = customwater_id;
    if (id > -1) {
      var T: moTexture = TMan.GetTexture(id);
      Mat.map = T._texture;
      Mat.transparent = true;
    }

    var id2: MOint = TMan.GetTextureMOId("moldeotrans");
    if (id2 > -1) {
      var T2: moTexture = TMan.GetTexture(id2);
      //Mat.map = T2._texture;
      //Mat.transparent = true;
    }


    var v_options : any = {
      "bakground_animation": true,
      "image_animation": true,
      "sphere_animation": true,
      "step": 0.0,
      "end_step": 120.0
    };

    if (options) {
      for( let i in options ) {
        v_options[i] = options[i];
        //console.log( i, options[i] );
      };
    }


    this.m_ConsoleState.step_interval = 40;
    //var stepi : MOfloat = this.m_ConsoleState.step_interval;
    //var steps : MOfloat = moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );
    //var progress: MOfloat = (steps / stepi) / 120.0;

    //var stepi : MOfloat = this.m_ConsoleState.step_interval;
    var stepi: MOfloat = 1.0;//between 15 and 40
    var steps: MOfloat = moGetTicksAbsolute(true);
    if ( v_options["step"] ) {
      steps = v_options["step"]+1;
      stepi = 1.0;
    }

    //console.log("steps:", steps);
    //120 is defined in
    var progress: MOfloat = (steps / stepi) / v_options["end_step"];
    //console.log( "progress: ", steps, v_options["end_step"], progress )
    if (v_options["bakground_animation"])
      RMan.m_Renderer.setClearColor(new moColor(1.0 - progress, 1.0 - progress, 1.0 - progress), 1.0);
    else
      RMan.m_Renderer.setClearColor(new moColor(0.0, 0.0, 0.0), 1.0);

    RMan.m_Renderer.autoClear = false;
    //RMan.m_Renderer.autoClearColor = false;
    //RMan.m_Renderer.autoClearDepth = false;
    //RMan.m_Renderer.autoClearStencil = false;
    if (progress<1.0) RMan.m_Renderer.clear( true, true, false);
    //glClearColor( 1.0 - progress, 1.0 - progress, 1.0 - progress, 1.0 );
    //glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

      //Mat.material.opacity = 1.0;
      //Mat.material.transparent = false;
      //Mat.material.color = new moColor(1.0, 1.0, 1.0);

      //Mat.material. = new moColor(1.0, 1.0, 1.0);

      //Mat.id = TMan.GetTextureMOId( "default" );
      //Mat.base.map =
      //Mat.base.
    /*
      Mat.m_Map = pTMan->GetTexture(pTMan->GetTextureMOId( "default", false ));
      Mat.m_MapGLId = Mat.m_Map->GetGLId();
      Mat.m_Color = moColor( 1.0, 1.0, 1.0 );
      Mat.m_fTextWSegments = 13.0f;
      Mat.m_fTextHSegments = 13.0f;
      Mat.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
      Mat.m_vLight.Normalize();
      //Mat.m_PolygonMode = MO_POLYGONMODE_LINE;
      Mat.m_PolygonMode = MO_POLYGONMODE_FILL;
      Mat.m_fWireframeWidth = 0.0005f;
    */

    ///GEOMETRY
    if (v_options["sphere_animation"]==3) {

      //console.log("Rendering sphere_animation");
      //console.log( RMan.m_Renderer.info );
      var Sphere : moSphereGeometry = new moSphereGeometry( 4.0*3.14*0.1618, 64.0, 64.0 );

        ///MESH MODEL (aka SCENE NODE)
      var Model : moGLMatrixf = new moGLMatrixf();
      Model.MakeIdentity();
      //Model.Scale( 2.0, 1.4, 2.0);
      Model.Rotate(-40+0.02*360.0 * progress * DEG_TO_RAD, 0.0, 1.0, 0.0);
      //Model.Translate(    0*3.14*0.1618+0.05*progress, 0.2*3.14*0.1618+-0.25*0.0+0.0*0.4*progress, -1.5 + 0.1*0.618*progress );
      Model.Translate(    0.005*progress, -2.5*0 - 1.7+0.1*progress, -1.5 + 0.1*0.618*progress );
      //console.log("Model:", Model);
      Mat.color = new moColor(1.0*(1.0-progress), 0.0, 1.0*(progress));
      Mat.opacity = progress;

      var Mesh: moMesh = new moMesh(Sphere, Mat);
      Mesh.SetModelMatrix(Model);

      var Scene: moSceneNode = new moSceneNode();
      //Scene.background = new THREE.Color( 'red' );
      Scene.add(Mesh);

      var ambientLight : THREE.AmbientLight = new THREE.AmbientLight(0xcccccc);
      Scene.add(ambientLight);

      var pointLight : THREE.PointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(300, 0, 300);
      Scene.add( pointLight );


      ///CAMERA PERSPECTIVE
      var Camera3D: moCamera3D = new moCamera3D();
      //p_display_info.Resolution().Width(),p_display_info.Resolution().Height()
      var rend_size : moVector2 = new moVector2();
      RMan.m_Renderer.getSize(rend_size);
      //if (p_display_info) {
        //rend_size.x = p_display_info.Resolution().width;
        //rend_size.y = p_display_info.Resolution().height;
        //console.log("Display info: ", rend_size);
      //}
      GLMan.SetDefaultPerspectiveView( rend_size.width, rend_size.height );
      Camera3D.projectionMatrix = GLMan.GetProjectionMatrix();

      ///RENDERING SPHERE
      RMan.m_Renderer.autoClearDepth = true;
      RMan.Render( Scene, Camera3D );
    }


    if (v_options["image_animation"]==3) {
      //console.log( RMan.m_Renderer.info );
      var Mat2: moMaterialBasic = new moMaterialBasic();
      var id2: MOint = TMan.GetTextureMOId("moldeotrans");

      if (id2 > -1) {
        var T2: moTexture = TMan.GetTexture(id2);
        Mat2.map = T2._texture;
        Mat2.transparent = true;
        //Mat2.color = new moColor(1.0, 1.0, 1.0);
        //Mat2;
      }
      //Mat2.m_Map = pTMan->GetTexture(pTMan->GetTextureMOId( "moldeotrans", false ));
      //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
      //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
      //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
      //Mat2.m_vLight.Normalize();

      ///MESH GEOMETRY
      var Plane3 : moPlaneGeometry = new moPlaneGeometry( 1.0, 0.33, 1, 1 );

      ///MESH MODEL
      var Model2 : moGLMatrixf = new moGLMatrixf().MakeIdentity();
      Model2.Scale( 1.0, 1.0, 1.0 );
      Model2.Translate( 0.0, -0.0, +1 );
      Mat2.color = new moColor( 1.0, progress, progress );
      Mat2.opacity = (progress-0.25)/(1.0-0.25);
      var Mesh2 : moMesh = new moMesh( Plane3, Mat2 );
      Mesh2.SetModelMatrix(Model2);
      var Scene2: moSceneNode = new moSceneNode();
      Scene2.add(Mesh2);


      ///CAMERA PERSPECTIVE
      var Camera3D2 : moCamera3D = new moCamera3D();
      var rend2_size : moVector2 = new moVector2();
      RMan.m_Renderer.getSize(rend2_size);
      GLMan.SetDefaultOrthographicView( rend2_size.width, rend2_size.height );
      Camera3D2.projectionMatrix = GLMan.GetProjectionMatrix();

      ///RENDERING
      RMan.Render( Scene2, Camera3D2 );
    }



///MESH MATERIAL

  }


  ConsolePlay() : void {

    if (this.m_ConsoleState.tempo.State()!=moTimerState.MO_TIMERSTATE_PLAYING) {
      this.m_ConsoleState.tempo.Start();
    }

    if (moIsTimerPaused()) {
        moContinueTimer();
    } else {
        moStartTimer();
    }
  /*
    if (this.m_ConsoleState.m_Mode==moTimerState.MO_CONSOLE_MODE_RECORD_SESSION) {
      if (this.m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_PLAY );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  ConsolePause() : void {
    moPauseTimer();
    /*
    if (m_ConsoleState.m_Mode==MO_CONSOLE_MODE_RECORD_SESSION) {
      if (m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_PAUSE );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  ConsoleStop() : void {
    moStopTimer();
    /*
    if (m_ConsoleState.m_Mode==MO_CONSOLE_MODE_RECORD_SESSION) {
      if (m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_STOP );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  GetDisplayVersion() : moText {
    this.version = this.GetConfig().m_MajorVersion+"."+this.GetConfig().m_MinorVersion;
    return "mol-version: "+this.version+ " ( moldeojs_version: " +this.moldeojs_version + ")";
  }

  GetUserAgent() : any {
    return MO_USERAGENT;
  }

  GetConsoleState() : moTimerState {
    return moGetTimerState();
  }

  ProcessSessionKey( key : any ) {

  }

  Finish() : boolean {
    this.m_ConsoleState = null;
    this.m_ConsoleState = new moConsoleState();
    this.m_EffectManager = null;
    this.m_EffectManager = new moEffectManager();
    this.m_MoldeoObjects = [];
    this.m_MoldeoSceneObjects = [];
    return super.Finish();
  }

  GetObject( label_name : string ) : moMoldeoObject {
    //this.GetObjectId();
    var founded = false;
    var ret_mObj = null;
    this.m_MoldeoObjects.forEach( function( mObj, i) {
      if ( mObj.GetMobDefinition().GetLabelName() == label_name ) {
        //using numeral for titles... mmm no, maybe using numerals for preconfig like
        // reference to noname_1#3 = fx noname_1 fixed on preconfig 3
        founded = true;
        ret_mObj = mObj;
        return ret_mObj;
      }
    });
    return ret_mObj;
  }

  GetObjectId( label_name : string ) : number {
    var founded = false;
    var ret_id = -1;
    this.m_MoldeoObjects.forEach( function( mObj, i) {
      if ( mObj.GetMobDefinition().GetLabelName() == label_name ) {
        //using numeral for titles... mmm no, maybe using numerals for preconfig like
        // reference to noname_1#3 = fx noname_1 fixed on preconfig 3
        founded = true;
        ret_id = mObj.GetId();
        return ret_id;
      }
    });
    return ret_id;
  }

  Screenshot( delay : any = 0) : void {
    //console.log("Console.Screenshot(delay)",delay)
    if (this.Script.Screenshot) {
      this.Script.Screenshot(delay);
    } else {
      //console.log("default > Console.Screenshot(delay) ",delay)
      this.m_pResourceManager.MORenderMan.Screenshot(delay);
    }
  }

  StartScreenCapture( options : any, callback : any = null ) {
    //console.log("Console.StartScreenCapture()",options)
    if (this.Script.StartScreenCapture) {
      return this.Script.StartScreenCapture( options );
    } else {
      //console.log("default > Console.ScreenCapture()",options)
      return this.m_pResourceManager.MORenderMan.StartScreenCapture( options, callback );
    }
  }

  StopScreenCapture() {
    this.m_pResourceManager.MORenderMan.StopScreenCapture();
  }
};
